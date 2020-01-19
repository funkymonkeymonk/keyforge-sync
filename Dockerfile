FROM debian
WORKDIR /usr/src/app
ADD exec/keyforge-sync-linux /usr/src/app
ENTRYPOINT ["./keyforge-sync-linux"]