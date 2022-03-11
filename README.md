# bundle-installer-functions

Server for the mspr login

## Run app in development

set process.env.NODE_ENV to 'development'
```shell
npm run start
```

## Deploy docker image in docker hub

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


## Config IP

# Development environnement

Database : 

    -   Interne localhost:6033

Node server : 

    -   Interne localhost:4000

Active Directory :  

    -   Interne localhost:389


# Production environnement

Database : 

    -   Interne 192.168.5.100:6033

Node server : 

    -   Interne 192.168.5.100:8061
    -   Externe 92.188.98.73:8061
Active Directory :  

    -   Interne 192.168.5.20:389
