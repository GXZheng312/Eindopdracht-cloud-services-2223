# Eindopdracht-cloud-services-2223

## Docker

To start the project, navigate to the project directory in your terminal and run the following command:
`docker-compose up --force-recreate --build -d`


### Container Details

| Container Name | Internal Port | External Port | Dependencies        |
|----------------|---------------|---------------|---------------|
| messagebroker  |               |               |                    |
| backend        | 3000          | 3000          |        |
| auth-service   | 3010          | 3010          | authdb |
| authdb         | 27100         | 27017         |                      |
| competition-service    | 3020          | 3020          | competitiondb |
| competitiondb  | 27200         | 27017                |                     |
| image-service    | 3030          | 3030          | competitiondb |
| imagendb  | 27300         | 27017                |                     |
| user-service    | 3040          | 3040          | competitiondb |
| userdb  | 27400         | 27017                |                     |

## Useful commands
Here are some useful commands for working with the containers in this project:

- Update and deploy the docker-compose: `docker compose up --force-recreate --build -d`
- npm install every folder: `npm run install-all`
