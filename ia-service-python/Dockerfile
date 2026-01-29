# 1. Usar la imagen base
FROM python:3.10-slim

# 2. Establecer directorio de trabajo
WORKDIR /app

# 3. Instalar dependencias del sistema
# CORRECCIÓN: Cambiamos 'libgl1-mesa-glx' por 'libgl1'
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# 4. Copiar requirements
COPY requirements.txt .

# 5. Instalar dependencias de Python
RUN pip install --no-cache-dir -r requirements.txt

# 6. Copiar el código fuente
COPY . .

# 7. Exponer puerto
EXPOSE 5001

# 8. Ejecutar la app
CMD ["python", "app.py"]