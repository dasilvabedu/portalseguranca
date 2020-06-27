FROM golang:1.11.5-alpine3.8 as build
ENV GO111MODULE=on

WORKDIR /go/locale-unifier

RUN apk add --no-cache git

COPY go.mod main.go ./
RUN go mod edit -require gopkg.in/yaml.v2@v2.2.2 && \
    go mod edit -require github.com/imdario/mergo@v0.3.7

RUN go build

###############
FROM alpine:3.8 as pywatchman
RUN apk add --no-cache \
      python2-dev \
      py-pip \
      build-base && \
    pip install pywatchman

###############
FROM alpine:3.8

ENV MERGED_LOCALE_FILENAME=locale_messages.yml

WORKDIR /files

RUN apk add --no-cache \
      libcrypto1.0 \
      libgcc \
      libstdc++ \
      python2

COPY --from=icalialabs/watchman:4.9.0-alpine3.8 /usr/local/bin/watchman* /usr/local/bin/
COPY --from=build /go/locale-unifier/locale-unifier /locale-unifier
COPY --from=pywatchman /usr/lib/python2.7/site-packages/pywatchman /usr/lib/python2.7/site-packages/pywatchman/

RUN mkdir -p /usr/local/var/run/watchman && \
    touch /usr/local/var/run/watchman/.not-empty

VOLUME /files
VOLUME /destination

CMD watchman-make -p '**/*.yml' --run "/locale-unifier ."
