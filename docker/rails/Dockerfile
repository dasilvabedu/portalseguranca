FROM ruby:2.6.5-alpine@sha256:da560e130d6a4b75b099e932a98331ec3b2420b914d51a88edc4fe3c60aee9b1

# Change the home folder to go inside /mnt/persistent
RUN sed -i -e "s/:\/root:/:\/mnt\/persistent\/root:/g" /etc/passwd

ENV PROJECT_ROOT /app
ENV GEM_HOME /mnt/persistent/rubygems
ENV BUNDLE_SILENCE_ROOT_WARNING 1

ENV PATH /app/server/bin:/mnt/persistent/rubygems/bin:/mnt/persistent/root/.bundler/bin:$PATH
ENV EDITOR vim

RUN \
    : "Create the project root directory" && \
    mkdir -p /app && \
\
    : "Install native dependencies" && \
    apk add --no-cache \
      build-base \
      git \
      less \
      libc-dev \
      libxml2-dev \
      libxslt-dev \
      libressl-dev \
      postgresql-dev \
      ruby-dev \
      tzdata \
      vim && \
\
    : "Update rubygems (needed for bundler 2)" && \
    gem update --system 3.0.3

WORKDIR /app
VOLUME /app
VOLUME /mnt/persistent

EXPOSE 3000

COPY docker-entrypoint.sh /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["rails", "server", "-b", "0.0.0.0"]
