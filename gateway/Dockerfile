FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY tsconfig*.json ./
COPY src ./src
RUN npm run build

FROM node:20-alpine AS production

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /usr/src/app/dist ./dist

ENV PORT=3000
EXPOSE 3000

CMD sh -c "node dist/main"
