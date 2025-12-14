#!/bin/bash

echo "===================================================="
echo "       INICIANDO FONO-TRACKER V1.0 (Mac/Linux)"
echo "===================================================="
echo ""

# Get the directory where the script is located
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

# Check if Node is installed
if ! command -v node &> /dev/null
then
    echo "[ERROR] Node.js no esta instalado."
    echo "Por favor descargalo e instalalo desde https://nodejs.org/"
    read -p "Presiona Enter para salir..."
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "[INFO] Primera vez iniciando. Instalando dependencias..."
    npm install
    if [ $? -ne 0 ]; then
        echo "[ERROR] Fallo al instalar dependencias."
        read -p "Presiona Enter para salir..."
        exit 1
    fi
fi

echo ""
echo "[INFO] Iniciando servidor..."
echo "[INFO] Se abrira tu navegador automaticamente."
echo ""
echo "PUEDES MINIMIZAR ESTA TERMINAL, PERO NO LA CIERRES."

# Start the server (Vite opens browser automatically on Mac usually, but we can force open if needed)
# The 'open' command works on macOS. On Linux it's xdg-open.
# We'll rely on npm run dev to open it mostly, or just start it.

npm run dev
