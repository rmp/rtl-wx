PKG=$(shell grep ^Package DEBIAN/control | cut -d\  -f 2)
PATCH  ?= 1
VERSION = $(shell date +'%Y.%m-%d')-$(PATCH)~$(shell lsb_release -cs)

SEDI = sed -i

ifeq ($(shell uname), Darwin)
        SEDI = sed -i ""
endif

deb:
	touch tmp
	rm -rf tmp
	mkdir tmp
	cp -pR DEBIAN opt etc tmp/
	$(SEDI) "s/VERSION/$(VERSION)/g" tmp/DEBIAN/control
	chmod -R 755 tmp/DEBIAN
	fakeroot dpkg -b tmp $(PKG)-$(VERSION).deb
