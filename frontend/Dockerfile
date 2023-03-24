FROM cirrusci/flutter as builder

RUN apt update && apt install clang pkg-config cmake ninja-build pkg-config libgtk-3-dev liblzma-dev make wget npm -y

RUN npm install http-server -g

WORKDIR /app

COPY . .
RUN flutter clean
RUN flutter pub get

RUN flutter build web --web-renderer canvaskit

EXPOSE 8081

RUN ["chmod", "+x", "./entrypoint.sh"]

CMD ["./entrypoint.sh"]


#CMD flutter run -d web-server --web-port=8081 --web-renderer canvaskit
#FROM nginx:1.21.1-alpine
#COPY --from=builder /app/build/web /usr/share/nginx/html