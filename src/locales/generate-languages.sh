#!/bin/bash
# regenerate en/vi/jp/kr/cn json and languages.xlsx from languages.csv
set -euo pipefail

LOCALES_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENV_DIR="$LOCALES_DIR/.venv"
PYTHON=python3

# use the system python when it already has openpyxl, otherwise a local venv
if ! "$PYTHON" -c "import openpyxl" >/dev/null 2>&1; then
  if [ ! -d "$VENV_DIR" ]; then
    echo "creating virtual environment in $VENV_DIR"
    python3 -m venv "$VENV_DIR"
  fi
  PYTHON="$VENV_DIR/bin/python"
  if ! "$PYTHON" -c "import openpyxl" >/dev/null 2>&1; then
    echo "installing openpyxl"
    "$PYTHON" -m pip install --quiet openpyxl
  fi
fi

"$PYTHON" "$LOCALES_DIR/generate-languages.py"
