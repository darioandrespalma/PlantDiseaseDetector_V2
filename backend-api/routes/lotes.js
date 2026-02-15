const express = require('express');
const router = express.Router();
const loteController = require('../controllers/loteController');
const authMiddleware = require('../middleware/authMiddleware');
const dailyJob = require('../jobs/dailyCheck');

router.get('/', authMiddleware, loteController.obtenerLotesConRecomendaciones); 
router.post('/', authMiddleware, loteController.crearLote);
router.post('/aceptar-recomendacion', authMiddleware, loteController.aceptarRecomendacion); 
router.delete('/:id', authMiddleware, loteController.eliminarLote);
router.post('/run-analysis', async (req, res) => {
    try {
        console.log("🛠️ Ejecución manual del motor agronómico solicitada...");
        await dailyJob.runNow(); // Ejecuta la función directamente
        res.json({ success: true, message: 'Análisis ejecutado. Revisa la consola del servidor.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
module.exports = router;