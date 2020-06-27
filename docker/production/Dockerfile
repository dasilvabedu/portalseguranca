FROM node:10-alpine@sha256:d5d419abdd59d3c9f1ab5acc1c3880fcc6208fdb7995edf55c1e6489adb5e371 as build-static

ARG geoserver_base_url
ARG geoserver_workspace_name
ENV REACT_APP_GEOSERVER_BASE_URL=$geoserver_base_url \
    REACT_APP_GEOSERVER_WORKSPACE_NAME=$geoserver_workspace_name

RUN mkdir -p /app/client
WORKDIR /app/client

COPY client/package.json ./
RUN yarn install

COPY client ./
RUN yarn build

#-------------------------------------------------------

FROM ruby:2.6.5-alpine@sha256:da560e130d6a4b75b099e932a98331ec3b2420b914d51a88edc4fe3c60aee9b1 as build-gems

RUN mkdir -p /app
COPY server/Gemfile server/Gemfile.lock /app/

RUN cd /app && \
    apk add --no-cache \
      build-base \
      git \
      libc-dev \
      libxml2-dev \
      libxslt-dev \
      libressl-dev \
      postgresql-dev \
      ruby-dev && \
    gem update --system 3.0.3 && \
    gem install bundler:2.0.1 && \
    bundle install --deployment --without "test development" --no-cache --clean --jobs 20 --retry 5 && \
    mkdir /libtocopy && \
    scanelf --needed --recursive /app/vendor \
      | grep ET_DYN \
      | awk '{ gsub(/,/, "\n", $2); print $2 }' \
      | sort -u \
      | xargs -I{} find /usr /lib -name {} \
      | xargs -I{} cp --parents {} /libtocopy

#-------------------------------------------------------

FROM ruby:2.6.5-alpine@sha256:da560e130d6a4b75b099e932a98331ec3b2420b914d51a88edc4fe3c60aee9b1 as production

ARG commit_hash
ARG working_directory=/app/server

# Runtime dependencies
RUN apk add --no-cache tzdata \
      libldap && \
    gem update --system 3.0.3 && \
    gem install bundler:2.0.1 && \
    adduser -D rails

USER rails
WORKDIR $working_directory

COPY --chown=rails:rails --from=build-gems /app ./
COPY --chown=rails:rails --from=build-gems /libtocopy /
COPY --chown=rails:rails --from=build-gems /usr/local/bundle ./.bundle
COPY --chown=rails:rails server ./
COPY --from=build-static --chown=rails:rails /app/client/build /app/server/public/

ENV RAILS_SERVE_STATIC_FILES=true \
    RAILS_LOG_TO_STDOUT=true \
    BUNDLE_APP_CONFIG=$working_directory/.bundle \
    RAILS_ENV=production \
    RAKE_ENV=production \
    COMMIT_HASH=$commit_hash

CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0"]
