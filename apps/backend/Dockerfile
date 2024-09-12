FROM oven/bun:1.1.27-alpine

WORKDIR /app/backend

COPY package*.json bun.lockb ./
RUN bun install

COPY . .

COPY wait-for-it.sh /usr/local/bin/

RUN chmod +x /usr/local/bin/wait-for-it.sh

CMD /usr/local/bin/wait-for-it.sh postgres:5432 -- bun db:migrate && bun src/app.ts