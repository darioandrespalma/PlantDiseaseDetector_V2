// backend-api/middleware/uploadMiddleware.js
const multer = require('multer');
const path = require('path');

// 1. Crear una carpeta 'uploads' en la raíz de 'backend-api' si no existe
const fs = require('fs');
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// 2. Configurar dónde y cómo guardar los archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Los guarda en la carpeta 'uploads'
  },
  filename: (req, file, cb) => {
    // Crea un nombre de archivo único para evitar colisiones
    cb(null, `img-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// 3. Filtro para aceptar solo imágenes
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Error: ¡Solo se permiten imágenes!'));
  }
}

// 4. Inicializar 'multer' con la configuración
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // Límite de 10MB
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
});

module.exports = upload;