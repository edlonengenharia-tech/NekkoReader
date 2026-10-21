# Testando a Abertura de Arquivos

## Como Testar

1. **Prepare um arquivo de teste:**
   - Crie um arquivo CBZ com algumas imagens JPG/PNG
   - Ou use um arquivo CBR/PDF existente

2. **Execute o NekkoReader:**
   ```
   TESTE-NPM.cmd
   ```

3. **Abra o arquivo:**
   - Clique no botão "📂 Abrir" na barra de título
   - Selecione o arquivo CBZ/CBR/PDF
   - Aguarde o processamento

4. **Verifique:**
   - As páginas devem ser extraídas e exibidas
   - O progresso deve ser mostrado durante o carregamento
   - Erros devem ser exibidos em um toast vermelho

## Formatos Suportados

### ✅ Totalmente Suportado
- **CBZ** (Comic Book ZIP) - Extração completa de imagens
- **CBR** (Comic Book RAR) - Extração completa de imagens

### ⚠️ Suporte Parcial
- **PDF** - Detecta número de páginas, mas não renderiza ainda
  - Requer integração com pdf.js para renderização

### ❌ Não Suportado Ainda
- **CBT** (TAR)
- **CB7** (7Z)

## Como Funciona

### Fluxo de Abertura de Arquivo

1. Usuário clica em "Abrir" ou arrasta um arquivo
2. Electron mostra diálogo de seleção de arquivo
3. Arquivo é enviado para o processo principal
4. `book-extractor.cjs` detecta o formato e extrai as páginas
5. Páginas são convertidas para base64 e enviadas ao renderer
6. React cria um novo livro e exibe as páginas

### Estrutura dos Dados

```javascript
{
  filePath: "/caminho/para/arquivo.cbz",
  fileName: "arquivo.cbz",
  pages: [
    {
      id: 1,
      url: "data:image/jpeg;base64,/9j/4AAQ...",
      alt: "Página 1",
      fileName: "page001.jpg"
    },
    // ... mais páginas
  ],
  totalPages: 24
}
```

## Próximos Passos

### Integração com AutoComix (Python)

Para usar o motor completo do AutoComix com detecção de painéis por ML:

1. Instale o AutoComix:
   ```bash
   pip install autocomix
   ```

2. Crie um microserviço Python que:
   - Recebe o caminho do arquivo
   - Usa AutoComix para processar
   - Retorna as páginas com metadados de painéis

3. Integre via HTTP ou IPC com o Electron

### Melhorias Planejadas

- [ ] Renderização de PDF com pdf.js
- [ ] Suporte a CBT/CB7
- [ ] Cache de páginas extraídas
- [ ] Progresso de extração em tempo real
- [ ] Thumbnails das páginas
- [ ] Integração completa com AutoComix Python

## Troubleshooting

### "Arquivo não abre"
- Verifique se o arquivo não está corrompido
- Tente com um arquivo CBZ simples primeiro
- Verifique os logs do console (F12 → Console)

### "Erro ao extrair"
- Certifique-se de que o arquivo é um CBZ/CBR válido
- Verifique se as imagens dentro do arquivo são JPG/PNG
- Arquivos RAR protegidos por senha não são suportados

### "PDF não mostra páginas"
- PDFs ainda não são renderizados
- Use CBZ/CBR para teste completo
- Integração com pdf.js está planejada
