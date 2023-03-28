FROM cirrusci/flutter as builder

RUN apt update && apt install clang pkg-config cmake ninja-build pkg-config libgtk-3-dev liblzma-dev make wget npm -y

RUN npm install http-server -g

#RUN curl -LO  https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
#RUN apt-get install -y ./google-chrome-stable_current_amd64.deb
#RUN rm google-chrome-stable_current_amd64.deb
## Check chrome version
#RUN echo "Chrome: " && google-chrome --version

WORKDIR /app

COPY . .
RUN flutter clean
RUN flutter pub get

#RUN flutter build web --web-renderer canvaskit

#RUN flutter build web --web-renderer html

EXPOSE 8081
#
#RUN flutter run -d web-server --web-port=8081 --web-renderer html --web-hostname=0.0.0.0
#

CMD flutter run -d web-server --web-port=8081 --web-renderer canvaskit --web-hostname=0.0.0.0

#RUN ["chmod", "+x", "./entrypoint.sh"]
#
#CMD ["./entrypoint.sh"]


#CMD flutter run -d web-server --web-port=8081 --web-renderer canvaskit
#FROM nginx:1.21.1-alpine
#COPY --from=builder /app/build/web /usr/share/nginx/html