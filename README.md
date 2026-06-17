# 3D Point Cloud & Mesh Viewer — Pix Force

Visualizador profissional de alto desempenho para nuvens de pontos 3D e malhas geométricas (Meshes) executado diretamente no navegador. Desenvolvido com **Three.js** e **loaders.gl**.

---

## 🚀 Novas Funcionalidades Implementadas

O visualizador foi aprimorado com uma suíte de ferramentas avançadas de análise e navegação 3D:

1. **📸 Captura de Tela Flutuante (Screenshot)**:
   - Botão de atalho flutuante no canto inferior direito.
   - Opção para exportar capturas em formato PNG com **fundo transparente** (removendo o fundo do visualizador automaticamente).

2. **✂️ Plano de Corte Interativo (Clipping)**:
   - Permite fatiar dinamicamente a nuvem de pontos ou malha nos eixos **X, Y e Z**.
   - Controle de offset e inversão de direção do corte.
   - Auxiliar visual em tempo real (plano de corte vermelho) e indicação de compatibilidade universal.

3. **📊 Painel de Estatísticas Dinâmico**:
   - Detecção em tempo real e exibição de dados técnicos do arquivo aberto:
     - Formato do arquivo original.
     - Quantidade total de pontos e faces (se malha).
     - Tamanho do arquivo original estruturado (KB, MB, GB).
     - Presença de cores originais.
     - Dimensões exatas da bounding box (X x Y x Z em metros).
     - Tempo exato de parse e processamento dos dados.

4. **🎬 Rotação Automática (Turntable)**:
   - Controle para iniciar a rotação orbital da câmera ao redor do centro do modelo.
   - Ajuste dinâmico de velocidade em **RPM (Rotações por Minuto)**.

5. **🔍 Seleção de Região (Box Select)**:
   - Seleção retangular na tela arrastando o mouse (clique esquerdo).
   - Destaque visual: os pontos selecionados retêm as cores originais, enquanto os não selecionados são suavemente escurecidos com base na sua luminância.
   - Contador dinâmico de pontos dentro da seleção.

6. **🌗 Temas de Background Inteligentes**:
   - Alternância rápida entre os temas **Escuro, Claro, Cinza Neutro e Gradiente Azul Escuro**.
   - Atualização automática do grid auxiliar para contrastar com a cor de fundo.
   - Persistência automática da preferência do usuário no `localStorage`.

7. **🗺️ Cubo de Orientação 3D (ViewCube)**:
   - Cubo interativo renderizado em CSS 3D no canto superior direito.
   - Sincronização em tempo real com a rotação da câmera principal.
   - Clique em qualquer face (Frente, Trás, Esq, Dir, Topo, Base) para alinhar a câmera de forma suave e animada (Cubic Easing).

8. **🎨 Paletas de Cores Estendidas (Colormaps)**:
   - Expansão das rampas de cores por elevação com paletas científicas de alto contraste: **Spectral, Viridis, Plasma, Magma, Turbo e Temperatura (Red-White-Blue)**.
   - **Legenda Visual Dinâmica**: Barra gradiente que reflete as cores do colormap selecionado e mostra as cotas mínima e máxima de elevação (Z) da nuvem.

---

## 📁 Formatos Suportados

- **Nuvens de Pontos**:
  - `.las / .laz` (Coordenadas georreferenciadas de alta precisão e mapa de intensidade com paleta Turbo).
  - `.pcd` (Point Cloud Data).
  - `.ply` (Polygon File Format - modo pontos).
- **Modelos 3D / Meshes**:
  - `.ply` (Polygon File Format - modo faces).
  - `.obj` (Wavefront OBJ).
  - `.fbx` (Autodesk FBX).
  - `.glb / .gltf` (GL Transmission Format).
  - `.3ds` (3D Studio).

---

## 🛠️ Otimizador Integrado (Arquivos Gigantes)
O visualizador possui uma aba dedicada a otimização que permite carregar múltiplos arquivos pesados, filtrá-los estatisticamente mantendo de **0.1% a 25%** dos pontos e exportá-los consolidados como arquivos compactos `.ply` ou `.pcd` binários ou texto.

---

## ⌨️ Atalhos de Controle

- **Botão Esquerdo do Mouse**: Rotacionar visualização.
- **Botão Direito do Mouse / Shift + Setas**: Mover a câmera (Pan).
- **Scroll do Mouse / Teclas `+` e `-`**: Zoom.
- **Setas do Teclado**: Rotacionar câmera manualmente.

