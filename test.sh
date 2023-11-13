#!/usr/bin/env bash

cd bin
tar -xvzf tt.tar.gz
cd ..

(sleep 5; curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{"payload":"hello world!"}') &


docker run --rm \
  -v "$PWD":/var/task \
  -p 9000:8080 \
  public.ecr.aws/lambda/nodejs:18-arm64 \
  test.handler
