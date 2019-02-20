# README for rtl-wx #

A project for snooping in, logging and displaying data captured from a "Fine Offset Electronics WH1080/WH3080 Weather Station".

## Prerequisites ##
librtlsdr-dev
rtl_433 
apache2



## Setup ##
sudo apt-get install librtlsdr-dev
git clone https://github.com/merbanan/rtl_433.git
cd rtl_433
mkdir -p build
cd build
cmake ..
make
sudo make install

git clone git://git.osmocom.org/rtl-sdr.git
cd rtl-sdr
sudo cp rtl-sdr.rules /etc/udev/rules.d/

sudo reboot

sudo apt-get install certbot
certbot -d wx.your.domain --manual --preferred-challenges dns certonly
