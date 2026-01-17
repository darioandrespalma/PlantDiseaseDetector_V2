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
  // Aceptamos jpeg, jpg, png, gif, webp, avif, bmp
  const filetypes = /jpeg|jpg|png|gif|webp|avif|bmp/;
  
  // Verificamos extensión y mimetype
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  // --- DEBUG: ESTO SALDRÁ EN TU CONSOLA ---
  console.log('📂 Procesando archivo:', file.originalname);
  console.log('   Tipo detectado:', file.mimetype);
  console.log('   Extensión:', path.extname(file.originalname));
  // ----------------------------------------

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    // Si falla, veremos por qué en la consola
    console.error('❌ Archivo rechazado por filtro');
    cb(new Error('Error: ¡Solo se permiten imágenes (jpg, png, gif, webp, avif)!'));
  }
}

// 4. Inicializar 'multer'
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // 10MB
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
});

module.exports = upload;