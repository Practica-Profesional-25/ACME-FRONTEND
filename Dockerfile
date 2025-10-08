#############################################
# Builder stage: instala dependencias y compila
#############################################
FROM node:22-alpine AS builder

ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

# Dependencia recomendada para librerías nativas (sharp, etc.) en Alpine
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copia solo archivos de dependencias para aprovechar el cache
COPY package.json pnpm-lock.yaml ./

# Usa corepack para gestionar pnpm de forma confiable
RUN corepack enable \
  && corepack prepare pnpm@8 --activate \
  && pnpm install --frozen-lockfile

# Copia el resto del código y construye
COPY . .
RUN pnpm run build

#############################################
# Runner stage: solo dependencias de producción y artefactos
#############################################
FROM node:2-alpine AS runner

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

RUN apk add --no-cache libc6-compat

WORKDIR /app

# Instala únicamente dependencias de producción
COPY package.json pnpm-lock.yaml ./
RUN corepack enable \
  && corepack prepare pnpm@8 --activate \
  && pnpm install --frozen-lockfile --prod

# Copia artefactos generados y assets necesarios
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs

# Ejecuta como usuario no privilegiado
USER node

EXPOSE 3000

# Usa el servidor de Next en producción
CMD ["pnpm", "start"]