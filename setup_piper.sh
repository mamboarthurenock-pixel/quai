#!/bin/bash
set -e
mkdir -p "$HOME/piper"
cd "$HOME/piper"
if [ ! -x piper/piper ]; then
  curl -sL -o piper.tar.gz https://github.com/rhasspy/piper/releases/download/2023.11.14-2/piper_linux_x86_64.tar.gz
  tar xzf piper.tar.gz
fi
if [ ! -f fr_FR-siwis-medium.onnx ]; then
  B="https://huggingface.co/rhasspy/piper-voices/resolve/main/fr/fr_FR/siwis/medium"
  curl -sL -o fr_FR-siwis-medium.onnx "$B/fr_FR-siwis-medium.onnx"
  curl -sL -o fr_FR-siwis-medium.onnx.json "$B/fr_FR-siwis-medium.onnx.json"
fi
if [ ! -f en_US-lessac-medium.onnx ]; then
  B="https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/lessac/medium"
  curl -sL -o en_US-lessac-medium.onnx "$B/en_US-lessac-medium.onnx"
  curl -sL -o en_US-lessac-medium.onnx.json "$B/en_US-lessac-medium.onnx.json"
fi
echo "Piper pret"
