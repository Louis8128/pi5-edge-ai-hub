#!/bin/bash

echo "========== Edge AI Engine Setup: Ollama =========="

# 1. 自动下载并执行官方安装脚本
echo "[Step 1] Fetching and installing Ollama for ARM64..."
curl -fsSL https://ollama.com/install.sh | sh

# 2. 验证安装
if command -v ollama &> /dev/null; then
    echo "[Success] Ollama installed successfully! Version:"
    ollama --version
else
    echo "[Error] Ollama installation failed. Please check your network."
    exit 1
fi

# 3. 预下载轻量级大模型
# 这里为你选择了微软的 Phi-3 Mini。它体积小巧，在树莓派 5 上推理速度极快，非常适合做初步测试。
MODEL_NAME="phi3:mini"
echo "[Step 2] Pulling the LLM: $MODEL_NAME..."
echo "(This may take a few minutes depending on your internet speed...)"
ollama pull $MODEL_NAME

echo "===================================================="
echo "🎉 All Done! You can now chat with your local AI."
echo "Test it with: ollama run $MODEL_NAME 'Hello, who are you?'"
