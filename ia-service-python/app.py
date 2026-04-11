"""
Backend IA - PlantDiseaseDetector V2
Correcciones aplicadas:
  1. BGR→RGB en TODOS los modelos CNN (banana, coffee, apple)
  2. Gemini actualizado a gemini-2.0-flash (gratuito)
  3. Validación de archivos y manejo de errores mejorado
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import cv2
import numpy as np
from tensorflow.keras.models import load_model
import os
import json

from agent.core import generate_agronomist_response

app = Flask(__name__)
CORS(app)

print("=== BACKEND IA v2.1 — BGR/RGB CORREGIDO + GEMINI 2.0 ===")

MODEL_DIR = os.path.join(os.path.dirname(__file__), 'models')

# ============================================================
# 1. CARGA DE MODELOS
# ============================================================

# --- Banana ---
BANANA_MODEL_PATH = os.path.join(MODEL_DIR, 'banana_leaf_disease_model.h5')
banana_model = load_model(BANANA_MODEL_PATH)
banana_classes = ['cordana', 'healthy', 'pestalotiopsis', 'sigatoka']
print("Modelo banana cargado.")

# --- Arroz (sklearn) ---
RICE_MODEL_PATH = os.path.join(MODEL_DIR, 'arroz_modelo.pkl')
rice_model = None
rice_fixed_size = (100, 100)
rice_classes = ['Saludable', 'ManchaMarron', 'Tizon']
try:
    rice_model = joblib.load(RICE_MODEL_PATH)
    print("Modelo de arroz cargado.")
except Exception as e:
    print(f"[WARN] Modelo de arroz no disponible: {e}")

# --- Café ---
COFFEE_MODEL_PATH = os.path.join(MODEL_DIR, 'coffee_leaf_disease_model.h5')
coffee_model = load_model(COFFEE_MODEL_PATH)
coffee_classes = ['healthy', 'miner', 'rust']
print("Modelo café cargado.")

# --- Manzana ---
APPLE_MODEL_PATH = os.path.join(MODEL_DIR, 'apple_leaf_disease_model.keras')
APPLE_CLASSES_PATH = os.path.join(MODEL_DIR, 'apple_classes.json')
apple_model = load_model(APPLE_MODEL_PATH)
with open(APPLE_CLASSES_PATH, 'r', encoding='utf-8') as f:
    apple_classes = json.load(f)
print("Modelo manzana cargado.")

# --- Tomate ---
TOMATO_MODEL_PATH = os.path.join(MODEL_DIR, 'tomato_leaf_disease_model.keras')
TOMATO_CLASSES_PATH = os.path.join(MODEL_DIR, 'tomato_classes.json')
tomato_model = load_model(TOMATO_MODEL_PATH)
with open(TOMATO_CLASSES_PATH, 'r', encoding='utf-8') as f:
    tomato_classes = json.load(f)
print("Modelo tomate cargado.")

# --- Maíz ---
CORN_MODEL_PATH = os.path.join(MODEL_DIR, 'corn_leaf_disease_model.keras')
CORN_CLASSES_PATH = os.path.join(MODEL_DIR, 'corn_classes.json')
corn_model = load_model(CORN_MODEL_PATH)
with open(CORN_CLASSES_PATH, 'r', encoding='utf-8') as f:
    corn_classes = json.load(f)
print("Modelo maíz cargado.")


# ============================================================
# 2. PREPROCESAMIENTO — CORREGIDO PARA TODOS LOS MODELOS
# ============================================================

def preprocess_cnn(img_bytes, target_size=(224, 224)):
    """
    Preprocesa imagen para modelos CNN (EfficientNet, MobileNet, VGG, etc.)
    
    CORRECCIÓN CRÍTICA:
    - OpenCV lee imágenes en formato BGR
    - TensorFlow/Keras espera RGB
    - Sin esta conversión el modelo ve colores invertidos → predicciones erróneas
    - EfficientNetV2 espera valores 0-255 (sin normalizar a 0-1)
      porque incluye su propia capa de normalización interna.
    """
    img = cv2.imdecode(np.frombuffer(img_bytes, np.uint8), cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("No se pudo decodificar la imagen. ¿Está corrupta?")
    
    # PASO 1: Corregir espacio de color BGR → RGB (aplica a TODOS los modelos)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    
    # PASO 2: Redimensionar
    img = cv2.resize(img, target_size)
    
    # PASO 3: Convertir a float32
    # NO dividir por 255.0 si el modelo base es EfficientNet/EfficientNetV2
    # Sí dividir si el modelo fue entrenado con normalización manual
    img = img.astype("float32")
    
    # PASO 4: Añadir dimensión batch: (224, 224, 3) → (1, 224, 224, 3)
    img = np.expand_dims(img, axis=0)
    return img


def preprocess_rice(img_bytes, target_size=(100, 100)):
    """
    Preprocesamiento especial para modelo sklearn de arroz.
    Este modelo usa features de imagen clásicas (HOG o flatten).
    """
    img = cv2.imdecode(np.frombuffer(img_bytes, np.uint8), cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("No se pudo decodificar la imagen.")
    
    # El modelo de arroz fue entrenado con BGR (sklearn/OpenCV directo)
    # Si fue entrenado con normalización:
    img = cv2.resize(img, target_size)
    img = img.astype("float32") / 255.0
    img = cv2.GaussianBlur(img, (5, 5), 0)
    img_array = img.flatten()
    return img_array


# ============================================================
# 3. PREDICCIÓN CENTRALIZADA
# ============================================================

def run_ml_prediction(crop: str, img_bytes: bytes) -> tuple:
    """
    Ejecuta predicción para cualquier cultivo soportado.
    
    Returns:
        (clase_predicha: str, confianza: float)  # confianza en 0.0-1.0
    """
    crop = crop.strip().lower()
    
    if crop == 'banana':
        img = preprocess_cnn(img_bytes)
        pred = banana_model.predict(img, verbose=0)
        idx = int(np.argmax(pred, axis=1)[0])
        return banana_classes[idx], float(pred[0][idx])

    elif crop == 'rice':
        if rice_model is None:
            raise ValueError('Modelo de arroz no disponible.')
        img = preprocess_rice(img_bytes)
        pred = rice_model.predict([img])
        label = rice_classes[int(pred[0])]
        conf = float(np.max(rice_model.predict_proba([img])[0])) if hasattr(rice_model, 'predict_proba') else 1.0
        return label, conf

    elif crop == 'coffee':
        img = preprocess_cnn(img_bytes)
        pred = coffee_model.predict(img, verbose=0)
        idx = int(np.argmax(pred, axis=1)[0])
        return coffee_classes[idx], float(pred[0][idx])

    elif crop == 'apple':
        img = preprocess_cnn(img_bytes)
        pred = apple_model.predict(img, verbose=0)
        idx = int(np.argmax(pred, axis=1)[0])
        return apple_classes[idx], float(pred[0][idx])
    
    elif crop == 'tomato':
        img = preprocess_cnn(img_bytes)
        pred = tomato_model.predict(img, verbose=0)
        idx = int(np.argmax(pred, axis=1)[0])
        return tomato_classes[idx], float(pred[0][idx])

    elif crop == 'corn':
        img = preprocess_cnn(img_bytes)
        pred = corn_model.predict(img, verbose=0)
        idx = int(np.argmax(pred, axis=1)[0])
        return corn_classes[idx], float(pred[0][idx])

    else:
        supported = ['banana', 'rice', 'coffee', 'apple', 'tomato', 'corn']
        raise ValueError(f'Cultivo "{crop}" no soportado. Disponibles: {supported}')


# ============================================================
# 4. ENDPOINTS REST API
# ============================================================

@app.route('/predict', methods=['POST'])
def predict():
    """Predicción directa: devuelve clase y confianza sin pasar por el agente."""
    try:
        # Validaciones de entrada
        if 'file' not in request.files:
            return jsonify({'error': 'No se envió ningún archivo (campo "file")'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'El archivo está vacío'}), 400
        
        crop = request.form.get('crop', '').strip().lower()
        if not crop:
            return jsonify({'error': 'Parámetro "crop" requerido'}), 400

        img_bytes = file.read()
        if len(img_bytes) == 0:
            return jsonify({'error': 'El archivo no contiene datos'}), 400

        prediction, confidence = run_ml_prediction(crop, img_bytes)

        return jsonify({
            'success': True,
            'crop': crop,
            'prediction': prediction,
            'confidence': round(confidence, 4),
            'confidence_percent': round(confidence * 100, 2),
        })

    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        print(f"[ERROR /predict] {e}")
        return jsonify({'error': 'Error interno del servidor.'}), 500


@app.route('/agent/query', methods=['POST'])
def agent_query():
    """
    Agente agrónomo inteligente:
    1. Predice con el modelo CNN
    2. Genera respuesta experta con Gemini 2.0
    3. Fallback a respuesta local si Gemini falla
    """
    try:
        user_query = request.form.get('query', '¿Qué le pasa a mi planta?').strip()
        crop = request.form.get('crop', '').strip().lower()
        
        if not crop:
            return jsonify({'error': 'Parámetro "crop" requerido.'}), 400

        prediction_result = "No se proporcionó imagen"
        confidence = 0.0
        prediction_ok = False

        # Predicción con modelo CNN (si hay imagen)
        if 'file' in request.files and request.files['file'].filename != '':
            file = request.files['file']
            img_bytes = file.read()
            
            if len(img_bytes) > 0:
                try:
                    prediction_result, confidence_raw = run_ml_prediction(crop, img_bytes)
                    confidence = round(confidence_raw * 100, 2)
                    prediction_ok = True
                except ValueError as e:
                    return jsonify({'error': str(e)}), 400
                except Exception as e:
                    print(f"[WARN] Error en predicción CNN: {e}")
                    prediction_result = "No se pudo procesar la imagen"

        # Respuesta del agente con Gemini 2.0
        agent_reply = generate_agronomist_response(
            user_query=user_query,
            crop=crop,
            prediction_result=prediction_result,
            confidence=confidence
        )

        return jsonify({
            'success': True,
            'agent_response': agent_reply,
            'technical_data': {
                'prediction': prediction_result,
                'confidence': confidence,
                'confidence_percent': confidence,
                'crop': crop,
                'image_analyzed': prediction_ok,
            },
            'suggested_actions': _get_suggested_actions(prediction_result, confidence)
        })

    except Exception as e:
        print(f"[ERROR /agent/query] {e}")
        return jsonify({'error': 'Error interno del agente.'}), 500


def _get_suggested_actions(prediction: str, confidence: float) -> list:
    """Genera acciones sugeridas dinámicas según el diagnóstico."""
    actions = [{'type': 'create_task', 'label': 'Crear tarea de revisión'}]
    
    if confidence > 75 and prediction.lower() not in ['healthy', 'saludable']:
        actions.append({'type': 'alert', 'label': 'Notificar al técnico agrícola'})
    
    if confidence < 60:
        actions.append({'type': 'rescan', 'label': 'Tomar otra foto con mejor iluminación'})
    
    return actions


@app.route('/health', methods=['GET'])
def health():
    """Health check con información de modelos cargados."""
    return jsonify({
        'status': 'OK',
        'models_loaded': {
            'banana': banana_model is not None,
            'rice': rice_model is not None,
            'coffee': coffee_model is not None,
            'apple': apple_model is not None,
            'tomato': tomato_model is not None,
            'corn': corn_model is not None,
        },
        'version': '2.2.0'
    })


@app.route('/crops', methods=['GET'])
def get_crops():
    """Lista los cultivos soportados y sus clases."""
    return jsonify({
        'supported_crops': {
            'banana': banana_classes,
            'rice': rice_classes,
            'coffee': coffee_classes,
            'apple': apple_classes,
            'tomato': tomato_classes,
            'corn': corn_classes,
        }
    })


# ============================================================
# 5. INICIO
# ============================================================
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 7860))
    app.run(host='0.0.0.0', port=port, debug=False)