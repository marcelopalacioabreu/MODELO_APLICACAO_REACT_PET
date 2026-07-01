const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuração Industrial de Elite (Padrão CRM-EMTEC)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dest = 'public/uploads/';
    
    // Roteamento dinâmico de destino por campo de formulário
    if (file.fieldname === 'floorPlan') {
      dest += 'locations/';
    } else if (file.fieldname === 'attachments') {
      dest += 'exams/';
    } else {
      dest += 'others/';
    }

    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Apenas imagens (JPG/PNG) ou PDF são permitidos.'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB para plantas baixas
  fileFilter: fileFilter
});

module.exports = upload;
