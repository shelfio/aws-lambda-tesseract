from lambci/lambda:build-nodejs8.10

RUN yum install -y autoconf aclocal automake install libtool libjpeg-devel \
	libpng-devel libtiff-devel zlib-devel wget gzip make cmakegcc freetype-devel \
  gcc gcc-c++ git lcms2-devel libjpeg-turbo-devel autogen libpng-devel \
  libtiff-devel libwebp-devel libzip-devel zlib-devel libgcc

RUN yum groupinstall "Development Tools" -y

RUN yum install -y cmake

COPY . .

RUN wget https://github.com/google/brotli/archive/v1.0.7.tar.gz
RUN tar -zxvf v1.0.7.tar.gz
RUN cd brotli-1.0.7 && mkdir out && cd out && ../configure-cmake && make && make test && make install
