'use client';

import React from 'react';

interface DynamicTextProps {
  text: string;
  className?: string;
}

const DynamicText = ({ text, className = "" }: DynamicTextProps) => {
  if (!text) return null;

  // Processar (Nova Linha)
  const lines = text.split('(Nova Linha)');

  const parseTags = (input: string) => {
    // 1. Processar Gradients
    let parts: any[] = [];
    let currentText = input;

    // Regex para {{gradient:from-X to-Y}}...{{/gradient}}
    const gradientRegex = /\{\{gradient:from-(.+?) to-(.+?)\}\}(.+?)\{\{\/gradient\}\}/g;
    let match;
    let lastIndex = 0;

    while ((match = gradientRegex.exec(currentText)) !== null) {
      // Adicionar texto antes do match
      if (match.index > lastIndex) {
        parts.push(currentText.substring(lastIndex, match.index));
      }

      const fromColor = match[1];
      const toColor = match[2];
      const content = match[3];

      parts.push(
        <span key={`grad-${match.index}`} className={`bg-gradient-to-r from-${fromColor} to-${toColor} bg-clip-text text-transparent`}>
          {content}
        </span>
      );

      lastIndex = gradientRegex.lastIndex;
    }

    // Adicionar resto do texto
    if (lastIndex < currentText.length) {
      const remainingText = currentText.substring(lastIndex);
      
      // Processar Cores no texto restante: {{color:X}}...{{/color}}
      const colorRegex = /\{\{color:(.+?)\}\}(.+?)\{\{\/color\}\}/g;
      let colorParts: any[] = [];
      let cMatch;
      let cLastIndex = 0;

      while ((cMatch = colorRegex.exec(remainingText)) !== null) {
        if (cMatch.index > cLastIndex) {
          colorParts.push(remainingText.substring(cLastIndex, cMatch.index));
        }
        colorParts.push(
          <span key={`color-${cMatch.index}`} className={`text-${cMatch[1]}`}>
            {cMatch[2]}
          </span>
        );
        cLastIndex = colorRegex.lastIndex;
      }

      if (cLastIndex < remainingText.length) {
        colorParts.push(remainingText.substring(cLastIndex));
      }

      parts.push(...colorParts);
    }

    return parts;
  };

  return (
    <div className={className}>
      {lines.map((line, i) => (
        <p key={i}>{parseTags(line)}</p>
      ))}
    </div>
  );
};

export default DynamicText;
