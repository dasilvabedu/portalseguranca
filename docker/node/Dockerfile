FROM node:10-alpine@sha256:d5d419abdd59d3c9f1ab5acc1c3880fcc6208fdb7995edf55c1e6489adb5e371

ENV PROJECT_ROOT /app

RUN \
    : "Create the project root directory" && \
    mkdir -p /app && \
\
    : "Set npm prefix to a separate location" && \
    npm config set prefix /mnt/persistent/npm && \
\
    : "Set yarn global dir to a separate location" && \
    echo '--global-folder /mnt/persistent/yarn' >> $HOME/.yarnrc

ENV PATH /app/node_modules/.bin:/mnt/persistent/yarn/bin:/mnt/persistent/npm/bin:$PATH

WORKDIR /app

VOLUME /app

COPY docker-entrypoint.sh /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["node"]
