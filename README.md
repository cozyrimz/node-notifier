# express-template

Node JS - Express - Typescript Server Template

# environment variables for local development at server root

create a .env file with the following variables
```
PORT=<localPort_to_run_server_on>
NODE_ENV=<development_staging_production_etc>
MONGO_URI=mongodb+srv://<staging_or_local_mongodb_db_uri_string>/<db>?retryWrites=true&w=majority
```

# install with yarn

```sh
yarn
```

# start the server

```sh
yarn dev
```
