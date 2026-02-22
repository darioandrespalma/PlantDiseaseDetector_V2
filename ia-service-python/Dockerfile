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

# 7. Exponer puerto (Hugging Face usa 7860)
EXPOSE 7860

# 8. Crear un usuario no-root (Requisito de Hugging Face Spaces)
RUN useradd -m -u 1000 user
USER user

# 9. Agregar permisos al usuario para el directorio de trabajo
ENV HOME=/home/user \
	PATH=/home/user/.local/bin:$PATH
WORKDIR $HOME/app
COPY --chown=user . $HOME/app

# 10. Ejecutar la app
CMD ["python", "app.py"]