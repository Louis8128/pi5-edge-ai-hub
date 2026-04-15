#!/bin/bash

echo "========== Pi 5 Edge AI Environment Check =========="

# 1. 检查 CPU 温度 (树莓派极客必备)
TEMP=$(vcgencmd measure_temp)
echo "[Hardware] CPU $TEMP"

# 2. 检查内存 (确保 8GB 正常识别)
MEM=$(free -h | grep Mem | awk '{print $2}')
echo "[Hardware] Total Memory: $MEM"

# 3. 检查 Ollama 服务
if command -v ollama &> /dev/null; then
    echo "[Software] Ollama is installed."
    ollama --version
else
    echo "[Software] Ollama is NOT installed. Please run install script."
fi
echo "===================================================="
