#!/bin/sh

unset BUNDLE_PATH
mkdir -p $HOME

if [ ! -f /mnt/persistent/rails-first-run-done ]; then
  echo "First run of the rails container"
  touch /mnt/persistent/rails-first-run-done

  echo "Running bin/setup"
  ./bin/setup
fi

if [ -f /app/server/tmp/pids/server.pid ]; then
  rm -f /app/server/tmp/pids/server.pid
fi

exec "$@"
