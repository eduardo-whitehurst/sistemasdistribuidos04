# Imagem base do Node.js
FROM node:18

# Diretório de trabalho na imagem
WORKDIR /app

# Copiar arquivos do package.json para a instalação de dependências
COPY package*.json ./

# Instalar dependências do projeto
RUN npm install

# Copiar o restante do código
COPY . .

# Expor a porta que a API irá utilizar
EXPOSE 3000

# Comando para iniciar a API
CMD ["npm", "start"]
