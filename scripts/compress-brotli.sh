#!/usr/bin/env bash

tar -C /build -zxvf /build/tesseract.tar.gz
mv /build/tesseract-standalone /build/tesseract
cd /build
tar -cf tt.tar tesseract
rm -rf tesseract
echo "Running brotli (this can take a few minutes)"
brotli --best --force --verbose /build/tt.tar
echo "Done"
