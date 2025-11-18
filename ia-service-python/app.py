# ia-service-python/app.py
from flask import Flask, request, jsonify
import joblib
import cv2
import numpy as np
from keras.models import load_model
import os

app = Flask(__name__)

# --- CARGA DE MODELOS AL INICIO ---
# Asegúrate de que estas rutas sean relativas a la carpeta del proyecto
MODEL_DIR = os.path.join(os.path.dirname(__file__), 'models')

# Modelo de Banano
BANANA_MODEL_PATH = os.path.join(MODEL_DIR, 'banana_leaf_disease_model.h5')
banana_model = load_model(BANANA_MODEL_PATH)
banana_classes = ['cordana', 'healthy', 'pestalotiopsis', 'sigatoka']

# Modelo de Arroz
RICE_MODEL_PATH = os.path.join(MODEL_DIR, 'arroz_modelo.pkl')
rice_model = joblib.load(RICE_MODEL_PATH)
rice_fixed_size = (100, 100)
rice_classes = ['Saludable', 'ManchaMarron', 'Tizon']

# Modelo de Café
COFFEE_MODEL_PATH = os.path.join(MODEL_DIR, 'coffee_leaf_disease_model.h5')
coffee_model = load_model(COFFEE_MODEL_PATH)
coffee_classes = ['healthy', 'miner', 'rust']


# --- FUNCIONES DE PREPROCESAMIENTO ---
def preprocess_image_banana(img_bytes, target_size=(224, 224)):
    img = cv2.imdecode(np.frombuffer(img_bytes, np.uint8), cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("No se pudo decodificar la imagen.")
    img = cv2.resize(img, target_size)
    img = img / 255.0
    img = np.expand_dims(img, axis=0)
    return img

def preprocess_image_rice(img_bytes, target_size=rice_fixed_size):
    img = cv2.imdecode(np.frombuffer(img_bytes, np.uint8), cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("No se pudo decodificar la imagen.")
    img = cv2.resize(img, target_size)
    img = img / 255.0
    img = cv2.GaussianBlur(img, (5, 5), 0)
    img_array = img.flatten()
    return img_array

def preprocess_image_coffee(img_bytes, target_size=(224, 224)):
    img = cv2.imdecode(np.frombuffer(img_bytes, np.uint8), cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("No se pudo decodificar la imagen.")
    img = cv2.resize(img, target_size)
    img = img / 255.0
    img = np.expand_dims(img, axis=0)
    return img


# --- RUTA PRINCIPAL DE PREDICCIÓN ---
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Validar que se envió un archivo
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        # Obtener el cultivo seleccionado
        crop = request.form.get('crop')  # 'banana', 'rice', 'coffee'
        if not crop:
            return jsonify({'error': 'Crop parameter is required'}), 400

        # Leer bytes de la imagen
        img_bytes = file.read()

        # Seleccionar modelo y preprocesamiento según el cultivo
        if crop == 'banana':
            img_array = preprocess_image_banana(img_bytes)
            prediction = banana_model.predict(img_array)
            predicted_class_idx = np.argmax(prediction, axis=1)[0]
            result = banana_classes[predicted_class_idx]
            confidence = float(prediction[0][predicted_class_idx])

        elif crop == 'rice':
            img_array = preprocess_image_rice(img_bytes)
            prediction = rice_model.predict([img_array])
            result = rice_classes[prediction[0]]
            # Para modelos sklearn, podemos obtener probabilidades si el modelo lo soporta
            if hasattr(rice_model, 'predict_proba'):
                proba = rice_model.predict_proba([img_array])[0]
                confidence = float(max(proba))
            else:
                confidence = 1.0  # Si no hay probabilidad, asumimos 100%

        elif crop == 'coffee':
            img_array = preprocess_image_coffee(img_bytes)
            prediction = coffee_model.predict(img_array)
            predicted_class_idx = np.argmax(prediction, axis=1)[0]
            result = coffee_classes[predicted_class_idx]
            confidence = float(prediction[0][predicted_class_idx])

        else:
            return jsonify({'error': f'Crop "{crop}" not supported'}), 400

        # Devolver resultado
        return jsonify({
            'success': True,
            'prediction': result,
            'confidence': round(confidence * 100, 2),  # En porcentaje
            'crop': crop
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# --- RUTA DE SALUD DEL SERVICIO ---
@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'OK', 'message': 'IA Service is running'})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)