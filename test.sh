#!/usr/bin/env bash

docker run --rm \
  -v "$PWD":/var/task \
  lambci/lambda:nodejs8.10 test.handler
