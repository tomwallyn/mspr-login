# bundle-installer-functions

Server for the mspr login

## Run in development

set process.env.NODE_ENV to 'development'
```shell
npm run start
```

## Deploy docker image

Deploy a version
```
docker build -t tomwallyn/mspr-node:tag .
docker push tomwallyn/mspr-node:tag
```

Deploy latest
```
docker build -t tomwallyn/mspr-node .
docker push tomwallyn/mspr-node
```

## Run in production

run the docker-compose.yml
```
docker-compose up -d
```