#!/bin/sh

if [ ! -f /mnt/persistent/node-first-run-done ]; then
  echo "First run of the node container"
  touch /mnt/persistent/node-first-run-done

  echo "Installing node dependencies..."
  yarn install
fi

exec "$@"
