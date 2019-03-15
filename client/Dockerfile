FROM node:alpine

WORKDIR '/app'

COPY ./package.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx

EXPOSE 3000

COPY ./nginx/defalut.conf /etc/nginx/conf.d/defalut.conf

COPY --from=builder /app/build /usr/share/nginx/html