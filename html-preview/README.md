# HTML Preview & Export Tool

Uma ferramenta estática, moderna e poderosa para visualizar e exportar código HTML para formatos de imagem (PNG) e documento (PDF) em alta resolução. Ideal para desenvolvedores e designers que precisam gerar assets rapidamente a partir de código.

## 🚀 Funcionalidades

- **Preview em Tempo Real**: Veja as alterações instantaneamente conforme edita o código.
- **Exportação PNG HD**: Escolha escalas de 1x até 4x para imagens super nítidas.
- **Exportação PDF Inteligente**:
  - Ajuste automático para uma única página (Fit to Page).
  - Divisão automática em múltiplas páginas para conteúdos longos.
  - Suporte a formatos A4 e Letter, orientações Retrato e Paisagem.
- **Fundo Branco Forçado**: Garanta que seus exports não tenham transparências indesejadas.
- **Interface Responsiva**: Editor lado a lado no desktop e empilhado no mobile.
- **Sem Backend**: Funciona 100% no navegador, pronto para GitHub Pages.

## 🛠️ Tecnologias Utilizadas

- **HTML5 / CSS3 / JavaScript (Vanilla)**
- [html2canvas](https://html2canvas.hertzen.com/) - Para captura de tela do preview.
- [jsPDF](https://github.com/parallax/jsPDF) - Para geração de documentos PDF.
- [Google Fonts (Inter & JetBrains Mono)](https://fonts.google.com/) - Tipografia moderna.

## 📦 Como Rodar Localmente

1. Clone o repositório ou baixe os arquivos.
2. Abra o arquivo `index.html` em qualquer navegador moderno.
3. Não é necessário servidor web (Node.js, Apache, etc), embora recomende-se usar extensões como "Live Server" no VS Code para uma melhor experiência de desenvolvimento.

## 🌐 Como Publicar no GitHub Pages

1. Crie um novo repositório no GitHub.
2. Faça o upload dos arquivos `index.html`, `style.css`, `script.js` e `README.md`.
3. No GitHub, vá em **Settings** > **Pages**.
4. Em **Build and deployment**, selecione a branch `main` e a pasta `/ (root)`.
5. Clique em **Save**. Em poucos minutos, seu app estará online!

## ⚠️ Limitações Conhecidas

- **Recursos Externos**: Imagens de outros domínios podem não aparecer no export devido a restrições de CORS (Cross-Origin Resource Sharing). Recomenda-se usar imagens com permissões CORS ou Base64.
- **Canvas Gigantes**: Exportar conteúdos extremamente longos em 4x pode exceder o limite de memória do navegador para elementos `<canvas>`. Se isso ocorrer, tente reduzir a escala para 2x ou 1x.
- **Estilos Complexos**: Algumas propriedades CSS avançadas (como filtros complexos ou certas transformações 3D) podem não ser capturadas perfeitamente pelo `html2canvas`.

## 📄 Licença

Este projeto é de código aberto e livre para uso pessoal e comercial.
# html--pdf
