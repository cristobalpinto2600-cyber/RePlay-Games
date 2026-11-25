FROM node:20-alpine

WORKDIR /app

# Se copian primero los manifiestos para aprovechar la caché de capas de Docker.
COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src

# Ejecuta el proceso con un usuario sin privilegios.
USER node

EXPOSE 3000

HEALTHCHECK --interval=15s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:' + (process.env.PORT || 3000) + '/api/salud').then((r) => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "src/server.js"]
