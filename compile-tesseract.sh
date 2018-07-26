#!/usr/bin/env bash

# install basic stuff required for compilation
sudo yum-config-manager --enable epel

sudo yum install -y aclocal autoconf automake cmakegcc freetype-devel gcc gcc-c++ \
	git lcms2-devel libjpeg-devel libjpeg-turbo-devel autogen autoconf libtool \
	libpng-devel libtiff-devel libtool libwebp-devel libzip-devel make zlib-devel
sudo yum groupinstall "Development Tools" -y

# autoconf
cd ~
wget http://babyname.tips/mirrors/gnu/autoconf-archive/autoconf-archive-2017.09.28.tar.xz
tar -xvf autoconf-archive-2017.09.28.tar.xz
cd autoconf-archive-2017.09.28
./configure && make && sudo make install
sudo cp m4/* /usr/share/aclocal/cd ~ wget http://babynam

# leptonica
cd ~
git clone https://github.com/DanBloomberg/leptonica.git
cd leptonica/
./autogen.sh
./configure
make
sudo make install

# tesseract
cd ~
git clone https://github.com/tesseract-ocr/tesseract.git
cd tesseract
export PKG_CONFIG_PATH=/usr/local/lib/pkgconfig
./autogen.sh
./configure
make
sudo make install

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
cp /usr/lib64/libjpeg.so.62 lib/
cp /usr/lib64/libwebp.so.4 lib/
cp /usr/lib64/libstdc++.so.6 lib/

# copy training data
mkdir tessdata
cd tessdata
wget https://github.com/tesseract-ocr/tessdata_fast/raw/master/eng.traineddata

# archive
cd ~
tar -zcvf tesseract.tar.gz tesseract-standalone

# download from EC2 to local machine
scp ec2-user@ec2-54-162-129-95.compute-1.amazonaws.com:/home/ec2-user/tesseract.tar.gz $(pwd)

# run compress-with-brotli.sh on local machine now
