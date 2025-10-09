#############################################
# Builder stage: instala dependencias y compila
#############################################
FROM node:22-alpine AS builder

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Dependencia recomendada para librerías nativas (sharp, etc.) en Alpine
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copia solo archivos de dependencias para aprovechar el cache
COPY package.json pnpm-lock.yaml ./

# Usa corepack para gestionar pnpm de forma confiable
RUN corepack enable \
  && corepack prepare pnpm@10.13.1 --activate \
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

# Copia package.json y node_modules ya podados de la etapa de build
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Copia artefactos generados y assets necesarios
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs

# Ejecuta como usuario no privilegiado
USER node

EXPOSE 3000

# Usa el servidor de Next en producción
CMD ["pnpm", "start"]