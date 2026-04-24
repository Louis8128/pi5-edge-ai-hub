# Pi 5 Edge AI Hub

A small Raspberry Pi 5 project for running a local LLM with Ollama and chatting through a simple web interface.

## What is included

- `web/`: lightweight browser chat UI
- `scripts/setup/install_ollama.sh`: installs Ollama and pulls `phi3:mini`
- `scripts/setup/check_env.sh`: checks Pi temperature, memory, and Ollama availability

## Quick start

```bash
bash scripts/setup/install_ollama.sh
bash scripts/setup/check_env.sh
```

Then open `web/index.html` in a browser and make sure the Ollama API URL in [web/script.js] points to your Raspberry Pi.

## Notes

- The current frontend is configured for `phi3:mini`
- The API endpoint is hardcoded in [web/script.js]
- This repo is a simple starting point for local edge AI experiments on Raspberry Pi 5
