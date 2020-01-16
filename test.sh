#!/usr/bin/env bash

cd bin
tar -xvzf tt.tar.gz
cd ..

yarn babel test.ts --out-file test.js

docker run --rm \
  -v "$PWD":/var/task \
  lambci/lambda:nodejs12.x test.handler
