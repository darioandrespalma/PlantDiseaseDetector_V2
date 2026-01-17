# IA Service - Plant Disease Detector V2

## 🤖 Descripción

Servicio de **inferencia de IA** basado en **Flask** que proporciona predicciones de enfermedades en plantas utilizando modelos de deep learning y machine learning entrenados previamente.

### Características

- 🧠 Modelos de IA pre-entrenados para 3 cultivos
- ⚡ Inferencia rápida con Keras/TensorFlow
- 📊 Retorno de probabilidades por clase
- 🔄 API RESTful simple y escalable
- 🖼️ Procesamiento automático de imágenes

---

## 📋 Requisitos

- **Python 3.8+**
- **Flask** - Framework web
- **TensorFlow/Keras** - Modelos de deep learning
- **OpenCV** - Procesamiento de imágenes
- **NumPy** - Operaciones numéricas
- **scikit-learn** - Modelos clásicos

---

## 🚀 Instalación

### 1. Crear Entorno Virtual

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

### 2. Instalar Dependencias

```bash
pip install -r requirements.txt
```

### 3. Descargar/Obtener Modelos

Los modelos deben colocarse en la carpeta `models/`:

```
ia-service-python/
├── models/
│   ├── banana_leaf_disease_model.h5
│   └── coffee_leaf_disease_model.h5
├── app.py
└── requirements.txt
```

### 4. Iniciar Servicio

```bash
python app.py
```

El servicio estará disponible en `http://localhost:5001`

---

## 📦 Modelos Disponibles

### 1. **Banano** (Deep Learning - Keras)

**Archivo**: `banana_leaf_disease_model.h5`

**Clases**:
- `healthy` - Hoja saludable
- `cordana` - Enfermedad: Cordana
- `pestalotiopsis` - Enfermedad: Pestalotiopsis
- `sigatoka` - Enfermedad: Sigatoka

**Entrada**: Imágenes RGB
**Framework**: Keras/TensorFlow

### 2. **Café** (Deep Learning - Keras)

**Archivo**: `coffee_leaf_disease_model.h5`

**Clases**:
- `healthy` - Hoja saludable
- `rust` - Enfermedad: Roya
- `miner` - Enfermedad: Minador

**Entrada**: Imágenes RGB
**Framework**: Keras/TensorFlow

---

## 🔌 Endpoints API

### Predicción para Banano

```http
POST /predict/banana
Content-Type: multipart/form-data

Form Data:
- image: [archivo JPG/PNG]

Response: 200 OK
{
  "crop": "banana",
  "prediction": "pestalotiopsis",
  "confidence": 0.9847,
  "classes": {
    "cordana": 0.0056,
    "healthy": 0.0018,
    "pestalotiopsis": 0.9847,
    "sigatoka": 0.0079
  },
  "timestamp": "2024-01-14T15:30:45.123Z"
}
```

### Predicción para Café

```http
POST /predict/coffee
Content-Type: multipart/form-data

Form Data:
- image: [archivo JPG/PNG]

Response: 200 OK
{
  "crop": "coffee",
  "prediction": "healthy",
  "confidence": 0.9765,
  "classes": {
    "healthy": 0.9765,
    "miner": 0.0178,
    "rust": 0.0057
  },
  "timestamp": "2024-01-14T15:30:45.123Z"
}
```

### Health Check

```http
GET /health

Response: 200 OK
{
  "status": "healthy",
  "models_loaded": {
    "banana": true,
    "coffee": true
  },
  "timestamp": "2024-01-14T15:30:45.123Z"
}
```

---

## 📊 Estructura de Respuesta

### Campo: `prediction`
Clase predicha (enfermedad o saludable)

### Campo: `confidence`
Nivel de confianza (0.0 - 1.0)
- `0.9+` → Muy confiado
- `0.7-0.9` → Confiado
- `0.5-0.7` → Moderado
- `<0.5` → Bajo

### Campo: `classes`
Probabilidades de todas las clases (suma = 1.0)

---

## 🖼️ Procesamiento de Imágenes

### Pasos Internos

1. **Lectura**: OpenCV lee imagen subida
2. **Validación**: Verifica que sea imagen válida
3. **Redimensionamiento**: Ajusta a tamaño de entrada esperado
4. **Normalización**: Convierte valores a rango [0, 1]
5. **Predicción**: Pasa por red neuronal
6. **Post-procesamiento**: Extrae probabilidades

### Formatos Soportados

- `.jpg` / `.jpeg`
- `.png`
- `.webp`
- `.bmp`
- `.tiff`

### Recomendaciones para Imágenes

✅ **Buena imagen**
- Enfoque en la hoja
- Iluminación uniforme
- Fondo neutral
- Resolución mínima 224x224

❌ **Mala imagen**
- Borrosidad
- Iluminación sesgada
- Sombras
- Múltiples hojas
- Muy pequeña

---

## 📋 Archivo `requirements.txt`

```
Flask==2.3.2
TensorFlow==2.13.0
Keras==2.13.1
opencv-python==4.8.0.74
numpy==1.24.3
scikit-learn==1.3.0
joblib==1.3.1
Pillow==10.0.0
python-dotenv==1.0.0
```

---

## 🔧 Configuración (app.py)

### Variables Internas

```python
MODEL_DIR = './models'  # Carpeta de modelos
BANANA_MODEL_PATH = './models/banana_leaf_disease_model.h5'
COFFEE_MODEL_PATH = './models/coffee_leaf_disease_model.h5'
```

### Parámetros de Imagen

```python
# Banano (se redimensiona automáticamente)
# Café (se redimensiona automáticamente)
```

---

## 💻 Ejemplos de Uso

### Con cURL

```bash
# Predicción Banano
curl -X POST http://localhost:5001/predict/banana \
  -F "image=@/path/to/banana_leaf.jpg"

# Predicción Café
curl -X POST http://localhost:5001/predict/coffee \
  -F "image=@/path/to/coffee_leaf.jpg"

# Health Check
curl http://localhost:5001/health
```

### Con Python (requests)

```python
import requests

image_path = 'banana_leaf.jpg'
with open(image_path, 'rb') as f:
    files = {'image': f}
    response = requests.post('http://localhost:5001/predict/banana', files=files)
    print(response.json())
```

### Con JavaScript (Fetch API)

```javascript
const formData = new FormData();
formData.append('image', imageFile);

fetch('http://localhost:5001/predict/banana', {
  method: 'POST',
  body: formData
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));
```

### Con Angular (HttpClient)

```typescript
uploadImage(imageFile: File, crop: string) {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  return this.http.post(`http://localhost:5001/predict/${crop}`, formData);
}
```

---

## ⚙️ Configuración Avanzada

### Variables de Entorno (.env)

```bash
FLASK_ENV=development
FLASK_DEBUG=True
PORT=5001
HOST=0.0.0.0
```

### CORS (Cross-Origin)

El servicio está configurado para aceptar requests desde:
- `http://localhost:4200` (Frontend local)
- `http://localhost:3000`
- Agregar orígenes en `app.py`:

```python
CORS(app, origins=["http://localhost:4200", "http://ejemplo.com"])
```

---

## 📈 Performance

### Tiempos Típicos

| Modelo | Tiempo Promedio |
|--------|-----------------|
| Banano | 80-150ms |

| Café | 80-150ms |

*Tiempos en máquina estándar. Varía según hardware.*

### Optimizaciones

- Carga de modelos al inicio (no por request)
- Procesamiento eficiente con NumPy
- GPU opcional (TensorFlow detecta automáticamente)

### Usar GPU (si disponible)

```bash
pip install tensorflow-gpu
```

---

## 🐛 Troubleshooting

### Error: "No module named 'tensorflow'"

```bash
pip install tensorflow
# o para GPU:
pip install tensorflow-gpu
```

### Error: "Model not found"

Verifica que los archivos .h5 y .pkl existen en `models/`

```bash
ls models/
# Debe mostrar:
# - banana_leaf_disease_model.h5
# - arroz_modelo.pkl
# - coffee_leaf_disease_model.h5
```

### Error: "Image format not supported"

Verifica que la imagen sea JPG/PNG válida:

```python
from PIL import Image
Image.open('image.jpg')  # Debe funcionar sin error
```

### Puerto 5001 en uso

Cambiar puerto en `app.py`:

```python
if __name__ == '__main__':
    app.run(port=5002)
```

### Servicio muy lento

Posibles causas:
- CPU bajo rendimiento
- Modelos muy grandes
- Falta de memoria RAM
- GPU no disponible

---

## 🔐 Seguridad

### Validaciones Implementadas

- ✅ Validación de tipo de archivo
- ✅ Límite de tamaño de imagen
- ✅ Manejo de excepciones
- ✅ Sanitización de entrada

### Mejoras Futuras

- [ ] Autenticación API Key
- [ ] Rate limiting
- [ ] HTTPS/TLS
- [ ] Logging detallado

---

## 📊 Interpretación de Resultados

### Confianza Alta (>0.85)
La predicción es muy probable. Usar con confianza.

```json
{
  "prediction": "pestalotiopsis",
  "confidence": 0.9847
}
```

→ **Acción**: Implementar tratamiento inmediatamente

### Confianza Moderada (0.60-0.85)
La predicción es probable pero revisar manualmente.

```json
{
  "prediction": "cordana",
  "confidence": 0.72
}
```

→ **Acción**: Revisar imagen y considerar segunda opinión

### Confianza Baja (<0.60)
El modelo no está seguro. Rechazar o revisar imagen.

```json
{
  "prediction": "sigatoka",
  "confidence": 0.48
}
```

→ **Acción**: Pedir nueva imagen o consultar experto

---

## 🚀 Deployment

### Local (Desarrollo)

```bash
python app.py
```

### Producción (Gunicorn)

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5001 app:app
```

### Docker

```dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "app.py"]
```

```bash
docker build -t plant-disease-ai .
docker run -p 5001:5001 plant-disease-ai
```

---

## 📝 Logs y Debugging

### Habilitar Logs Detallados

En `app.py`:

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

### Ver Logs de Predicción

```bash
# Los logs aparecerán en consola:
# [2024-01-14 15:30:45] Processing banana prediction...
# [2024-01-14 15:30:45] Result: pestalotiopsis (0.9847)
```

---

## 🔗 Integración con Backend

El Backend API espera respuestas con este formato:

```python
{
    "crop": "banana",
    "prediction": "pestalotiopsis",
    "confidence": 0.9847,
    "classes": { ... }
}
```

Asegurate de retornar exactamente este formato.

---

## 📈 Roadmap Futuro

- [ ] Agregar más cultivos
- [ ] Fine-tuning de modelos
- [ ] Caché de resultados
- [ ] API de batch predictions
- [ ] Explicabilidad (Grad-CAM)
- [ ] Monitoreo de drift

---

## 📞 Soporte

### Debugging Steps

1. Verifica que Flask esté corriendo: `http://localhost:5001/health`
2. Revisa que los modelos se cargaron: Busca "Model loaded" en logs
3. Intenta predicción de prueba con cURL
4. Revisa error en consola

### Comandos Útiles

```bash
# Ver tamaño de modelos
ls -lh models/

# Verificar instalación de dependencias
pip list | grep -E "tensorflow|keras|opencv"

# Ejecutar en modo debug
FLASK_DEBUG=1 python app.py
```

---

**Versión**: 1.0.0  
**Última actualización**: 14 de Enero de 2026  
**Autor**: Dario
