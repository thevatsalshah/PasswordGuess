# IndiaNIC Node Project

## Prequisites (Development):

| Module | Version |
| --- | --- |
| Node | 10.16.0 |
| Npm | 6.9.0 |


##### Take Clone of project
> git clone -b git_url  folder_name


##### Rename configSample.js to configs.js
> cd configs
> mv configSample.js configs.js

##### Change the url of database and set credential if applicable
> vi configs.js

##### Install node modules

> npm install

##### Deployment

>pm2 start server.js --name="node_seed_v10"


