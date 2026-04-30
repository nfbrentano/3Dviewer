document.addEventListener('DOMContentLoaded', () => {
    const editor = document.getElementById('html-editor');
    const iframe = document.getElementById('preview-iframe');
    const btnExportPng = document.getElementById('btn-export-png');
    const btnExportPdf = document.getElementById('btn-export-pdf');
    const btnLoadExample = document.getElementById('btn-load-example');
    const btnClear = document.getElementById('btn-clear');
    const btnRefresh = document.getElementById('btn-refresh');
    const loadingOverlay = document.getElementById('loading-overlay');
    const resizer = document.getElementById('resizer');
    
    // Status and config
    let syncTimeout;
    const EXAMPLE_HTML = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; line-height: 1.6; }
        .card { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background: linear-gradient(135deg, #6366f1, #a855f7); padding: 30px; color: white; text-align: center; }
        .content { padding: 30px; }
        h1 { margin: 0; font-size: 24px; }
        p { color: #666; margin: 15px 0; }
        .stats { display: flex; justify-content: space-around; margin-top: 20px; border-top: 1px solid #eee; padding-top: 20px; }
        .stat-item { text-align: center; }
        .stat-value { font-weight: bold; color: #6366f1; font-size: 20px; }
        .stat-label { font-size: 12px; color: #999; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #aaa; background: #fafafa; }
    </style>
</head>
<body>
    <div class="card">
        <div class="header">
            <h1>Relatório de Desempenho</h1>
        </div>
        <div class="content">
            <p>Este é um exemplo de preview que pode ser exportado para PNG ou PDF. O conteúdo é renderizado fielmente e mantido em alta resolução.</p>
            <p>Use o painel ao lado para editar o código em tempo real.</p>
            
            <div class="stats">
                <div class="stat-item">
                    <div class="stat-value">98%</div>
                    <div class="stat-label">Eficiência</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">1.2s</div>
                    <div class="stat-label">Tempo Médio</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">24k</div>
                    <div class="stat-label">Usuários</div>
                </div>
            </div>
        </div>
        <div class="footer">
            Gerado automaticamente via HTML Preview Export Tool
        </div>
    </div>
</body>
</html>`;

    // --- Core Functions ---

    function updatePreview() {
        const content = editor.value;
        iframe.srcdoc = content;
        document.getElementById('last-sync').innerText = 'Sincronizado';
    }

    function showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerText = message;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    function toggleLoading(show, text = 'Processando...') {
        document.getElementById('loading-text').innerText = text;
        if (show) loadingOverlay.classList.remove('hidden');
        else loadingOverlay.classList.add('hidden');
    }

    /**
     * Captura o HTML para uma imagem (Canvas) de forma segura.
     * Esta função evita o SecurityError do iframe no protocolo file://
     * ao isolar completamente o conteúdo durante a captura.
     */
    async function captureHTML(scale = 1, forceWhite = true) {
        const content = editor.value;
        const iframe = document.getElementById('preview-iframe');
        
        // 1. Esconder o iframe temporariamente para o html2canvas não tentar acessá-lo
        const originalDisplay = iframe.style.display;
        iframe.style.display = 'none';

        // 2. Criar contêiner temporário
        const container = document.createElement('div');
        container.id = 'capture-temp-container'; // ID correto para o onclone
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        container.style.top = '0';
        container.style.width = '800px'; // Largura base fixa para consistência
        container.style.backgroundColor = forceWhite ? 'white' : 'transparent';
        container.innerHTML = content;
        document.body.appendChild(container);

        try {
            // Aguardar um pouco para garantir que estilos e imagens locais carreguem
            await new Promise(r => setTimeout(r, 100));

            const canvas = await html2canvas(container, {
                scale: scale,
                useCORS: true,
                backgroundColor: forceWhite ? '#ffffff' : null,
                logging: false,
                ignoreElements: (el) => el.tagName === 'IFRAME', // Ignorar qualquer iframe remanescente
                onclone: (clonedDoc) => {
                    // Garantir que o contêiner clonado esteja visível no clone
                    const clonedContainer = clonedDoc.getElementById('capture-temp-container');
                    if (clonedContainer) {
                        clonedContainer.style.left = '0';
                        clonedContainer.style.position = 'relative';
                    }
                    // Remover qualquer iframe que possa ter sido clonado acidentalmente
                    const iframes = clonedDoc.getElementsByTagName('iframe');
                    for (let i = 0; i < iframes.length; i++) iframes[i].remove();
                }
            });
            return canvas;
        } finally {
            // 3. Restaurar o iframe e limpar o contêiner
            document.body.removeChild(container);
            iframe.style.display = originalDisplay;
        }
    }

    // --- Export PNG ---

    async function exportPNG() {
        try {
            toggleLoading(true, 'Renderizando PNG...');
            const scale = parseFloat(document.getElementById('png-scale').value);
            const forceWhite = document.getElementById('force-white').checked;
            
            const canvas = await captureHTML(scale, forceWhite);

            const link = document.createElement('a');
            link.download = `preview-export-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            
            showToast('PNG exportado com sucesso!');
        } catch (err) {
            console.error(err);
            showToast('Erro ao exportar PNG: ' + err.message, 'error');
        } finally {
            toggleLoading(false);
        }
    }

    // --- Export PDF ---

    async function exportPDF() {
        const container = document.createElement('div');
        try {
            toggleLoading(true, 'Gerando PDF com Paginação Inteligente...');
            const format = document.getElementById('pdf-format').value;
            const orientation = document.getElementById('pdf-orientation').value;
            const mode = document.getElementById('pdf-mode').value;
            const hasMargin = document.getElementById('pdf-margin').checked;
            const forceWhite = document.getElementById('force-white').checked;
            const content = editor.value;

            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF(orientation, 'pt', format);
            
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const margin = hasMargin ? 40 : 0;
            const contentWidth = pdfWidth - (margin * 2);
            const contentHeight = pdfHeight - (margin * 2);

            // 1. Criar contêiner temporário na página principal para evitar erros de iframe
            container.style.position = 'fixed';
            container.style.left = '-10000px';
            container.style.top = '0';
            container.style.width = '210mm'; // Simula a largura A4 para renderização correta
            container.innerHTML = content;
            document.body.appendChild(container);

            // 2. Identificar elementos de página no contêiner local
            const pageElements = container.querySelectorAll('.pdf-page, .pagina, .capa, section, [style*="page-break-after: always"]');

            if (mode === 'multi' && pageElements.length > 0) {
                // MODO INTELIGENTE: Captura cada elemento detectado
                for (let i = 0; i < pageElements.length; i++) {
                    const el = pageElements[i];
                    
                    const canvas = await html2canvas(el, {
                        scale: 2,
                        useCORS: true,
                        backgroundColor: forceWhite ? '#ffffff' : null,
                        logging: false
                    });
                    
                    const imgData = canvas.toDataURL('image/jpeg', 0.95);
                    const imgProps = pdf.getImageProperties(imgData);
                    const ratio = imgProps.width / imgProps.height;
                    
                    if (i > 0) pdf.addPage(format, orientation);
                    
                    let renderWidth = contentWidth;
                    let renderHeight = renderWidth / ratio;
                    
                    if (renderHeight > contentHeight) {
                        renderHeight = contentHeight;
                        renderWidth = renderHeight * ratio;
                    }
                    
                    const x = (pdfWidth - renderWidth) / 2;
                    const y = hasMargin ? margin : (pdfHeight - renderHeight) / 2;
                    
                    pdf.addImage(imgData, 'JPEG', x, y, renderWidth, renderHeight);
                }
            } else {
                // MODO CLÁSSICO: Captura o contêiner inteiro
                const canvas = await html2canvas(container, {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: forceWhite ? '#ffffff' : null,
                    logging: false
                });
                
                const imgData = canvas.toDataURL('image/jpeg', 0.95);
                const imgProps = pdf.getImageProperties(imgData);
                const ratio = imgProps.width / imgProps.height;
                
                if (mode === 'fit') {
                    let renderWidth = contentWidth;
                    let renderHeight = renderWidth / ratio;
                    if (renderHeight > contentHeight) {
                        renderHeight = contentHeight;
                        renderWidth = renderHeight * ratio;
                    }
                    const x = (pdfWidth - renderWidth) / 2;
                    const y = (pdfHeight - renderHeight) / 2;
                    pdf.addImage(imgData, 'JPEG', x, y, renderWidth, renderHeight);
                } else {
                    const renderWidth = contentWidth;
                    const renderHeight = renderWidth / ratio;
                    let heightLeft = renderHeight;
                    let position = margin;
                    
                    pdf.addImage(imgData, 'JPEG', margin, position, renderWidth, renderHeight);
                    heightLeft -= contentHeight;
                    
                    while (heightLeft > 0) {
                        position = heightLeft - renderHeight + margin;
                        pdf.addPage(format, orientation);
                        pdf.addImage(imgData, 'JPEG', margin, position, renderWidth, renderHeight);
                        heightLeft -= (pdfHeight - (hasMargin ? 80 : 0));
                    }
                }
            }
            
            pdf.save(`preview-export-${Date.now()}.pdf`);
            showToast('PDF exportado com sucesso!');
        } catch (err) {
            console.error(err);
            showToast('Erro ao exportar PDF: ' + err.message, 'error');
        } finally {
            if (container.parentNode) document.body.removeChild(container);
            toggleLoading(false);
        }
    }

    // --- Event Listeners ---

    editor.addEventListener('input', () => {
        document.getElementById('last-sync').innerText = 'Digitando...';
        clearTimeout(syncTimeout);
        syncTimeout = setTimeout(updatePreview, 500);
    });

    btnExportPng.addEventListener('click', exportPNG);
    btnExportPdf.addEventListener('click', exportPDF);
    
    btnLoadExample.addEventListener('click', () => {
        editor.value = EXAMPLE_HTML.trim();
        updatePreview();
        showToast('Exemplo carregado');
    });

    btnClear.addEventListener('click', () => {
        editor.value = '';
        updatePreview();
        showToast('Editor limpo');
    });

    btnRefresh.addEventListener('click', () => {
        updatePreview();
        showToast('Preview atualizado');
    });

    // Resizer Logic
    let isResizing = false;
    resizer.addEventListener('mousedown', (e) => {
        isResizing = true;
        document.body.style.cursor = 'col-resize';
        // Add overlay to iframe to prevent it from stealing events
        iframe.style.pointerEvents = 'none';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        const containerWidth = document.querySelector('.app-content').offsetWidth;
        const newWidth = (e.clientX / containerWidth) * 100;
        if (newWidth > 10 && newWidth < 90) {
            document.querySelector('.editor-section').style.flex = `0 0 ${newWidth}%`;
        }
    });

    document.addEventListener('mouseup', () => {
        isResizing = false;
        document.body.style.cursor = 'default';
        iframe.style.pointerEvents = 'auto';
    });

    // Initial load
    editor.value = EXAMPLE_HTML.trim();
    updatePreview();
});
