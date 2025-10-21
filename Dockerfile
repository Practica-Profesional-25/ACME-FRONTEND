#############################################
# Builder stage: instala dependencias y compila
#############################################
FROM node:22-alpine AS builder

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ARG AUTH0_SECRET
ARG APP_BASE_URL
ARG AUTH0_DOMAIN
ARG AUTH0_CLIENT_ID
ARG AUTH0_CLIENT_SECRET
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET

ENV AUTH0_SECRET=${AUTH0_SECRET}
ENV APP_BASE_URL=${APP_BASE_URL}
ENV AUTH0_DOMAIN=${AUTH0_DOMAIN}
ENV AUTH0_CLIENT_ID=${AUTH0_CLIENT_ID}
ENV AUTH0_CLIENT_SECRET=${AUTH0_CLIENT_SECRET}
ENV GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
ENV GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}

# Dependencia recomendada para librerías nativas (sharp, etc.) en Alpine
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copia solo archivos de dependencias para aprovechar el cache
COPY package.json pnpm-lock.yaml ./

# Usa corepack para gestionar pnpm de forma confiable
RUN corepack enable \
  && corepack prepare pnpm@10.13.1 --activate \
  && pnpm approve-builds \
  && pnpm install --no-frozen-lockfile

# Copia el resto del código y construye
COPY . .
RUN pnpm run build \
  && pnpm prune --prod

#############################################
# Runner stage: solo dependencias de producción y artefactos
#############################################
FROM node:22-alpine AS runner

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copia artefactos standalone generados y assets necesarios
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Ejecuta como usuario no privilegiado
USER node

EXPOSE 3000

# Usa el servidor standalone de Next en producción
CMD ["node", "server.js"]