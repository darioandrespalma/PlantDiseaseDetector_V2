from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import cv2
import numpy as np
from tensorflow.keras.models import load_model
import os
import json

app = Flask(__name__)
CORS(app)

print("=== BACKEND IA ACTUALIZADO CON APPLE ===")

MODEL_DIR = os.path.join(os.path.dirname(__file__), 'models')

# Modelo de Banano
BANANA_MODEL_PATH = os.path.join(MODEL_DIR, 'banana_leaf_disease_model.h5')
banana_model = load_model(BANANA_MODEL_PATH)
banana_classes = ['cordana', 'healthy', 'pestalotiopsis', 'sigatoka']

# Modelo de Arroz
RICE_MODEL_PATH = os.path.join(MODEL_DIR, 'arroz_modelo.pkl')
rice_model = None
rice_fixed_size = (100, 100)
rice_classes = ['Saludable', 'ManchaMarron', 'Tizon']

try:
    rice_model = joblib.load(RICE_MODEL_PATH)
    print("Modelo de arroz cargado correctamente.")
except Exception as e:
    print(f"No se pudo cargar el modelo de arroz: {e}")

# Modelo de Café
COFFEE_MODEL_PATH = os.path.join(MODEL_DIR, 'coffee_leaf_disease_model.h5')
coffee_model = load_model(COFFEE_MODEL_PATH)
coffee_classes = ['healthy', 'miner', 'rust']

# Modelo de Manzana
APPLE_MODEL_PATH = os.path.join(MODEL_DIR, 'apple_leaf_disease_model.keras')
APPLE_CLASSES_PATH = os.path.join(MODEL_DIR, 'apple_classes.json')

apple_model = load_model(APPLE_MODEL_PATH)
with open(APPLE_CLASSES_PATH, 'r', encoding='utf-8') as f:
    apple_classes = json.load(f)

print("Modelo de manzana cargado correctamente.")
print("Clases apple:", apple_classes)

def preprocess_image_224(img_bytes, target_size=(224, 224)):
    img = cv2.imdecode(np.frombuffer(img_bytes, np.uint8), cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("No se pudo decodificar la imagen.")
    img = cv2.resize(img, target_size)
    img = img.astype("float32")
    img = np.expand_dims(img, axis=0)
    return img

def preprocess_image_rice(img_bytes, target_size=rice_fixed_size):
    img = cv2.imdecode(np.frombuffer(img_bytes, np.uint8), cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("No se pudo decodificar la imagen.")
    img = cv2.resize(img, target_size)
    img = img.astype("float32") / 255.0
    img = cv2.GaussianBlur(img, (5, 5), 0)
    img_array = img.flatten()
    return img_array

@app.route('/predict', methods=['POST'])
def predict():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        crop = request.form.get('crop')
        if not crop:
            return jsonify({'error': 'Crop parameter is required'}), 400

        crop = crop.strip().lower()
        print("Crop recibido:", crop)

        img_bytes = file.read()

        if crop == 'banana':
            img_array = preprocess_image_224(img_bytes)
            prediction = banana_model.predict(img_array, verbose=0)
            predicted_class_idx = int(np.argmax(prediction, axis=1)[0])
            result = banana_classes[predicted_class_idx]
            confidence = float(prediction[0][predicted_class_idx])

        elif crop == 'rice':
            if rice_model is None:
                return jsonify({'error': 'Rice model is not available in this environment'}), 500

            img_array = preprocess_image_rice(img_bytes)
            prediction = rice_model.predict([img_array])
            result = rice_classes[int(prediction[0])]

            if hasattr(rice_model, 'predict_proba'):
                proba = rice_model.predict_proba([img_array])[0]
                confidence = float(np.max(proba))
            else:
                confidence = 1.0

        elif crop == 'coffee':
            img_array = preprocess_image_224(img_bytes)
            prediction = coffee_model.predict(img_array, verbose=0)
            predicted_class_idx = int(np.argmax(prediction, axis=1)[0])
            result = coffee_classes[predicted_class_idx]
            confidence = float(prediction[0][predicted_class_idx])

        elif crop == 'apple':
            print("Entró al bloque APPLE")
            img_array = preprocess_image_224(img_bytes)
            prediction = apple_model.predict(img_array, verbose=0)
            predicted_class_idx = int(np.argmax(prediction, axis=1)[0])
            result = apple_classes[predicted_class_idx]
            confidence = float(prediction[0][predicted_class_idx])

        else:
            return jsonify({'error': f'Crop "{crop}" not supported'}), 400

        return jsonify({
            'success': True,
            'prediction': result,
            'confidence': round(confidence, 4),
            'confidence_percent': round(confidence * 100, 2),
            'crop': crop
        })

    except Exception as e:
        print("ERROR INTERNO:", str(e))
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'OK', 'message': 'IA Service is running'})

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 7860))
    app.run(host='0.0.0.0', port=port, debug=False)