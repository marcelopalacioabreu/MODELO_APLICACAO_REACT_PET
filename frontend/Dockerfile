FROM node:18

WORKDIR /app

COPY package.json package-lock.json* ./

RUN apt-get update && apt-get install -y tzdata && rm -rf /var/lib/apt/lists/*
ENV TZ=America/Sao_Paulo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN npm config set strict-ssl false
RUN npm install --include=dev --legacy-peer-deps

COPY . .

# Disabling SSL check for build process
ENV NODE_TLS_REJECT_UNAUTHORIZED=0
# Em desenvolvimento, não rodamos build no Dockerfile se usarmos volumes, 
# mas para manter o padrão EMTEC de produção:
# RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "dev"]
