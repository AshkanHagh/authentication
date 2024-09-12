#!/bin/sh

# Usage: ./wait-for-it.sh host:port [--timeout=seconds] [-- command args]
# Example: ./wait-for-it.sh postgres:5432 -- bun db:migrate

TIMEOUT=15
HOST_PORT=$1
shift
COMMAND="$@"

HOST=$(echo $HOST_PORT | cut -d':' -f1)
PORT=$(echo $HOST_PORT | cut -d':' -f2)

if [ -z "$HOST" ] || [ -z "$PORT" ]; then
  echo "Error: host and port must be provided in the format host:port"
  exit 1
fi

echo "Waiting for $HOST:$PORT to be ready..."

for i in $(seq $TIMEOUT); do
  nc -z $HOST $PORT > /dev/null 2>&1
  if [ $? -eq 0 ]; then
    echo "$HOST:$PORT is ready!"
    break
  fi
  echo "Waiting for $HOST:$PORT... ($i/$TIMEOUT)"
  sleep 1
done

if ! nc -z $HOST $PORT > /dev/null 2>&1; then
  echo "Error: $HOST:$PORT not available after $TIMEOUT seconds"
  exit 1
fi

if [ ! -z "$COMMAND" ]; then
  echo "Executing command: $COMMAND"
  exec $COMMAND
else
  echo "No command provided to execute after waiting"
fi