const mongoose = require('mongoose');

const loteSchema = new mongoose.Schema({
  // ... (tus campos existentes: nombre, usuario, cultivo, etc.)
  nombre: { type: String, required: true, trim: true },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cultivo: { type: mongoose.Schema.Types.ObjectId, ref: 'Cultivo', required: true },
  
  ubicacion: {
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
    provincia: { type: String, default: '' } // Nuevo campo útil para filtros
  },

  // ✅ NUEVA SECCIÓN: Configuración de Alertas
  alertasClima: {
    activas: { type: Boolean, default: false },
    frecuencia: { 
      type: String, 
      enum: ['diaria', 'semanal', 'critica'], // 'critica' = solo si hay heladas/sequía
      default: 'semanal' 
    },
    emailNotificacion: { type: String } // Opcional, por si quiere recibir en otro correo
  },
  // El semáforo de salud
  estadoSalud: {
    type: String,
    enum: ['saludable', 'riesgo', 'peligro'],
    default: 'saludable'
  },
  // Bitácora de eventos (Riegos, Enfermedades, Cosechas)
  historial: [{
    tipo: {
      type: String,
      enum: ['riego', 'fertilizante', 'plaga', 'enfermedad', 'cosecha', 'nota'],
      required: true
    },
    titulo: String,
    descripcion: String,
    fecha: {
      type: Date,
      default: Date.now
    },
    fotoUrl: String
  }],
  activo: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Middleware para actualizar el estadoSalud automáticamente basado en el historial
loteSchema.pre('save', function(next) {
  if (this.historial && this.historial.length > 0) {
    // Ordenar historial por fecha descendente
    const ultimosEventos = this.historial.sort((a, b) => b.fecha - a.fecha);
    const ultimoEvento = ultimosEventos[0];

    // Lógica básica de Semáforo
    if (ultimoEvento.tipo === 'enfermedad') {
      this.estadoSalud = 'peligro';
    } else if (ultimoEvento.tipo === 'plaga') {
      this.estadoSalud = 'riesgo';
    } else if (['riego', 'fertilizante', 'nota'].includes(ultimoEvento.tipo)) {
      // Si lo último fue cuidarlo, vuelve a saludable (puedes hacer lógica más compleja)
      this.estadoSalud = 'saludable'; 
    }
  }
  next();
});

module.exports = mongoose.model('Lote', loteSchema);