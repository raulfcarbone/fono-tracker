#!/bin/bash
# Script to launch fono-tracker on macOS
# Place this file in the same folder as the fono-tracker binary.
# Make it executable with: chmod +x Abrir-fono-tracker.command

DIR="$(cd "$(dirname "$0")" && pwd)"
"$DIR/fono-tracker" "$@"
