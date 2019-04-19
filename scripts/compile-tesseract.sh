#!/usr/bin/env bash

echo "Building"
# Build leptonica
wget http://www.leptonica.com/source/leptonica-1.77.0.tar.gz
tar -zxvf leptonica-1.77.0.tar.gz
ls -la ./
cd leptonica-1.77.0
ls -la 
./configure
make
make install

# Build tesseract 4.0
cd ..
wget https://github.com/tesseract-ocr/tesseract/archive/4.0.0.tar.gz
tar -zxvf 4.0.0.tar.gz
cd tesseract-4.0.0/
export PKG_CONFIG_PATH=/usr/local/lib/pkgconfig
./autogen.sh
./configure
make
make install
ldconfig

cd ~
mkdir tesseract-standalone

# trim unneeded ~ 15 MB
strip ./tesseract-standalone/**/*

# copy files
cd tesseract-standalone
cp /usr/local/bin/tesseract .
mkdir lib
cp /usr/local/lib/libtesseract.so.4 lib/
cp /usr/local/lib/liblept.so.5 lib/
# cp /usr/lib64/* lib/
cp /usr/lib64/libjpeg.so.62 lib/
cp /usr/lib64/libwebp.so.4 lib/
cp /usr/lib64/libstdc++.so.6 lib/
cp /usr/lib64/libpng15.so.15 lib/
cp /usr/lib64/libtiff.so.5 lib/
cp /usr/lib64/libgomp.so.1 lib/
cp /usr/lib64/libjbig.so.2.0 lib/

# copy training data
mkdir tessdata
cd tessdata
wget https://github.com/tesseract-ocr/tessdata_fast/raw/master/eng.traineddata

# Create configs
mkdir configs
echo "tessedit_create_tsv 1" > configs/tsv

# archive
cd ~
tar -zcvf tesseract.tar.gz tesseract-standalone
mv tesseract.tar.gz /build/

echo "Done!"
