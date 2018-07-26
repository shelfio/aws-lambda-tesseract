#!/usr/bin/env bash

tar -cf tt.tar ./tesseract
brotli --best --force ./tt.tar
