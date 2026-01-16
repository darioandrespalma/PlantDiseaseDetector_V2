const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateTask } = require('../middleware/validators');

// RUTA TEMPORAL PARA QUE EL SERVIDOR ARRANQUE
// (Luego crearemos el controlador completo)
router.get('/', authMiddleware, (req, res) => res.json({ message: "Lista de tareas" }));
router.post('/', authMiddleware, (req, res) => res.json({ message: "Tarea creada" }));

module.exports = router;