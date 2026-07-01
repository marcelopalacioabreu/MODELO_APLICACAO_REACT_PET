const express = require('express');
const path = require('path');
const fs = require('fs');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @desc    Serve arquivos de upload com o padrão de elite CRM-EMTEC
 * @route   GET /uploads/:folder/:filename
 */
router.get('/:folder/:filename', (req, res, next) => {
  const { folder, filename } = req.params;
  
  // No nosso sistema, os exames são sensíveis, mas permitiremos a visualização 
  // para profissionais logados através do middleware protect abaixo.
  const SENSITIVE_FOLDERS = [
    'exams',
    'pets',
    'records',
    'users'
  ];

  // Caminho absoluto conforme estrutura do container
  const filePath = path.join(process.cwd(), 'uploads', folder, filename);

  // 1. Verificar se o arquivo existe fisicamente
  if (!fs.existsSync(filePath)) {
    console.error(`❌ [Files] Arquivo não encontrado: ${filePath}`);
    return res.status(404).send('Cannot GET ' + req.originalUrl);
  }

  // 2. Proteção de Acesso: Apenas usuários autenticados podem ver arquivos de saúde
  return protect(req, res, () => {
    res.sendFile(filePath);
  });
});

module.exports = router;
