import React from 'react';

/**
 * Elite Text Parser V2 - Motor de Renderização Industrial
 * Processa tags {{gradient:...}} e {{color:...}} em qualquer ordem e frequência.
 */
export const parseEliteText = (text: string) => {
  if (!text) return null;

  // 1. Quebra de linha por marcador explícito
  const lines = text.split('(Nova Linha)');
  
  return lines.map((line, lIdx) => {
    // Regex unificada para capturar gradient e color
    // Grupo 1: Tipo (gradient|color) | Grupo 2: Atributos | Grupo 3: Conteúdo
    const combinedRegex = /\{\{(gradient|color):(.*?)\}\}(.*?)\{\{\/\1\}\}/g;
    
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = combinedRegex.exec(line)) !== null) {
      // Texto antes da tag
      const before = line.substring(lastIndex, match.index);
      if (before) parts.push(before);

      const type = match[1];
      const attributes = match[2];
      const content = match[3];

      if (type === 'gradient') {
        parts.push(
          <span key={`grad-${lIdx}-${match.index}`} className={`bg-gradient-to-r ${attributes} bg-clip-text text-transparent inline-block`}>
            {content}
          </span>
        );
      } else if (type === 'color') {
        // Suporte para classes Tailwind ou Hex
        const isHex = attributes.startsWith('#');
        const className = isHex ? "" : `text-${attributes}`;
        const style = isHex ? { color: attributes } : {};
        
        parts.push(
          <span key={`color-${lIdx}-${match.index}`} className={className} style={style}>
            {content}
          </span>
        );
      }

      lastIndex = combinedRegex.lastIndex;
    }

    // Texto depois da última tag
    const after = line.substring(lastIndex);
    if (after) parts.push(after);

    return (
      <React.Fragment key={`line-${lIdx}`}>
        {parts.length > 0 ? parts : line}
        {lIdx < lines.length - 1 && <br />}
      </React.Fragment>
    );
  });
};
