FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY tsconfig*.json ./
COPY prisma ./prisma
COPY src ./src
RUN npm run build

FROM node:20-alpine AS production

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package*.json ./

RUN npm ci --omit=dev
RUN npm i tsx -g

COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/dist ./dist

ENV PORT=3002
EXPOSE 3002

CMD sh -c "npx prisma generate && npx prisma migrate deploy && npx prisma db seed && node dist/src/main"
