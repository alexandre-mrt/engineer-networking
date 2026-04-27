#!/bin/bash
# No build step needed — vanilla HTML/CSS/JS with CDN dependencies
# Just verify files exist
echo "Checking project files..."
for f in index.html src/css/style.css src/js/main.js DESIGN.md; do
  if [ -f "$f" ]; then
    echo "  OK: $f"
  else
    echo "  MISSING: $f"
    exit 1
  fi
done
echo "All files present. Open index.html in browser."
