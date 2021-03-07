# Imagem de Origem
FROM node:14.15.4-alpine

# Diretório de trabalho(é onde a aplicação ficará dentro do container).
WORKDIR /app

# Adicionando `/app/node_modules/.bin` para o $PATH
ENV PATH /app/node_modules/.bin:$PATH

# Instalando dependências da aplicação e armazenando em cache.
COPY package.json ./
COPY package-lock.json ./
RUN npm i fsevents@latest -f --save-optional
RUN npm install --silent

# add app
COPY . ./

# start app
CMD ["npm", "start"]
