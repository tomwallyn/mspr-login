FROM node:16-slim
LABEL version=1.0.0
RUN mkdir /app
ADD . /app
WORKDIR /app
RUN npm install
USER 1001
EXPOSE 4000
CMD ["node","index.js"]
ENV NODE_ENV=production