# Ta Mere En Slip

Projets Open-Source du site [Ta Mere En Slip](http://tamereenslip.cf)

# Informations
 This projects is split in 3 parts:

 **1. [Backend](#backend)**
 **2. [Backup Server](#backup)**
 **3. [Frontend](#frontend)**
 
 If your backend server don't change IP on launch you will don't need the [Backup Server](#backup)
 *Refer you to each parts if he don't change IP it in [Backend](#backend), [Backup Server](#backup) and [Frontend](#frontend)

# Backend

### 1. Informations
This Backend project use some environment variables
For Development save theses in */backend/.env*
For Production save theses in */backend/production.env*

##### Here is the variables :

```
DATABASE_URL=[mongodb_database_link] //mongodb://localhost/TaMereEnSlip
PORT=[port_of_server] // 4999
BACKUP_ENDPOINT=[backup_server_url] // http://255.255.255.255:4998
BACKUP_PASSWORD=[backup_server_password] // randompassword
```

**DATABASE_URL** : Is your mongodb database url
**PORT**: Is your backend server port that will exposed
**BACKUP_ENDPOINT**: Is your [Backup Server](#backup) url
**BACKUP_PASSWORD**: Is the password of the [Backup Server](#backup)

This project has a script to get automatically the server IP
*Refer you to the sixth point for more informations*

### 2. Development Installation

**MONGODB need to installed on your device**

Use this commands to install the development server:

```
npm install
```

### 3. Production Installation

**docker and docker-compose need to installed on your prod server**
**There are 2 method, one with ressources restrictions and the other without**

##### You first need to build image of the project:
```
// in /backend folder
docker build -tag app:[project_version] . 
```
*You can save the image and export to your prod server and load after the image*
*Most importante thing is to have the tag attributs for the docker-compose.yml file*

#### In case your use some restrictions you can edit docker-compose-default.yml file :

This is an example of the docker-compose-swarm.yml file content:
```
version: "3"
services: 
    app:
        image: app:0.1.0
        env_file: 
            - production.env
        ports: 
            - "4999:4999"
        deploy:
            resources:
                limits:
                    cpus: '0.03'
                    memory: 400m
                reservations:
                    cpus: '0.01'
                    memory: 100m
    mongo:
        image: mongo
        volumes: 
            - ./data:/data/db
        ports: 
            - "27017:27017"
        deploy:
            resources:
                limits:
                    cpus: '0.05'
                    memory: 500m
                reservations:
                    cpus: '0.01'
                    memory: 100m
```

You can make some change to make it work for you
Here it is :
```
version: "3"
services: 
    app:
        image: [BackendImageName]:[BackendImageVersion]
        env_file: 
            - [EnvironmentFile]
        ports: 
            - "[PORT]:[PORT]"
        deploy:
            resources:
                limits:
                    cpus: '[MaxCpuUtilisationInDecimal]'
                    memory: [MaxMemoryUsageInMegabyte]m
                reservations:
                    cpus: '[ReservationCpuUtilisationInDecimal]'
                    memory: [ReservationMemoryUsageInMegabyte]m
    mongo:
        image: mongo
        volumes: 
            - ./data:/data/db
        ports: 
            - "27017:27017"
        deploy:
            resources:
                limits:
                    cpus: '0.05'
                    memory: 500m
                reservations:
                    cpus: '0.01'
                    memory: 100m
```

##### In case you don't use some restrictions you can edit docker-compose-default.yml file :

This is an example of the docker-compose-default.yml file content:
```
version: "3"
services: 
    app:
        container_name: app
        restart: always
        image: app:0.1.0
        env_file: 
            - production.env
        ports: 
            - "4999:4999"
        links: 
            - mongo
    mongo:
        container_name: mongo
        image: mongo
        volumes: 
            - ./data:/data/db
        expose: 
            - 27017
        ports: 
            - "27017:27017"
```

If you have change the port in the env don't forget do change it in this file

In resume that are the change that you can make
```
version: "3"
services: 
    app:
        container_name: app
        restart: always
        image: [imageName:imageTag]
        env_file: 
            - [PathToEnvFile]
        ports: 
            - "[PORT]:[PORT]"
        links: 
            - mongo
    mongo:
        container_name: mongo
        image: mongo
        volumes: 
            - ./data:/data/db
        expose: 
            - 27017
        ports: 
            - "27017:27017"
```

### 4. Development run
Here is the commande to run the devlopment server
```
npm run devStart
```

### 5. Production run

You can launch your app with */backend/launch.sh* but this will make some memory and cpu limitations

Or you can launch your app with */backend/launch_default.sh* and this will not make some restrictions

Here is an example of launch.sh structure :
```
#!/bin/bash
sudo /usr/bin/docker swarm init
sudo /usr/bin/docker stack deploy -c /home/ubuntu/docker-compose-swarm.yml app
```

This file is make for my aws ec2 server but here is the change you can make
```
sudo [PathToDockerComposeScript] swarm init
sudo [PathToDockerComposeScript] stack deploy -c [PathToDockerComposeFile] app
```

Here is an example of launch_default.sh structure :
```
#!/bin/bash
sudo /usr/bin/docker-compose -f /home/ubuntu/docker-compose.yml up
```

This file is make for my aws ec2 server but here is the change you can make :
```
#!/bin/bash
sudo [PathToDockerComposeScript] -f [PathToDockerComposeFile] up
```

Or simply use
```
docker-compose up
```

### 6. IP Script

If you don't need to get automatically the IP of the server remove the */backend/configs/init.js* file
and remove theses line in app.js
```
- 12. const initServer = require('./configs/init');
- 47. initServer()
```

# Backup Server

### 1. Informations

**Is important to run your backup server on another server**
**If your prod server don't change ip you can delete the backup server**

This Backup project use some environment variables
For Development save theses in */backend/.env*
This is temporary

##### Here is the variables :

```
PASSWORD=[password_for_auth] // randompassword
PORT=[port_of_backup_server] // 4998
```

**PASSWORD** : Is your mongodb database url
**PORT**: Is your backup server port that will exposed

### 2. Development Installation

Use this command to install the develop backup server:

```
npm install
```

### 3. Production Installation

Use theses commands to install the prod backup server 

```
// in /backend folder
docker build .
docker tag [imageID] backup-server:[project_version]
```
*You can save the image and export to your prod server and load after the image*
*Most importante thing is to have the tag attributs for the docker-compose.yml file*

### 4. Development Run
Here is the commande to run the develop backup server:
```
npm start
```

### 5. Production Run
Here is the commande to run the prod backup server:
```
docker run backup-server
```

# Frontend

### 1. Informations

This Frontend project use react;
And use:
1. axios
2. material-ui
3. socket io

This project has a script to get automatically the server IP
*Refer you to the fifth point for more informations*

### 2. Installation

Use this commands to install the frontend:

```
npm install
```

### 3. Run

Here is the commande to run the front:
```
npm start
```

### 4. Deployment

Here is the commande to build the frontend:
```
npm run build
```

### 5. Script IP

If you don't need to get automatically the IP of the server you can replace the Initing class by this:
```
function Initing(props) {
    return <>{props.children}</>
}
```