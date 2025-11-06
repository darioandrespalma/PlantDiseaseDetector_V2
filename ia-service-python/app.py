# ia-service-python/app.py
from flask import Flask, request, jsonify
import time

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    # 1. Asegurarse de que se envió un archivo
    if 'file' not in request.files:
        return jsonify({'error': 'No se envió ningún archivo'}), 400
    
    file = request.files['file']

    # 2. (SIMULACIÓN) Aquí es donde cargarías tu modelo .h5
    # Por ahora, solo simulamos el tiempo de procesamiento
    print(f"Recibida imagen: {file.filename}. Simulando análisis...")
    time.sleep(1) # Simula 1 segundo de trabajo de IA
    
    # 3. (SIMULACIÓN) Devolver un resultado falso (mock)
    # Más adelante, reemplazarás esto con el resultado real de tu modelo .h5
    resultado_simulado = {
        "disease": "Sigatoka Negra (Simulado)",
        "confidence": 0.92,
        "recommendations": "Esta es una recomendación de tratamiento simulada."
    }
    
    return jsonify(resultado_simulado)

if __name__ == '__main__':
    # Corremos la API de IA en el puerto 5000
    app.run(port=5000, debug=True)