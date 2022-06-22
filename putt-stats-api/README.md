# API for disc golf putt data stored in GCP Cloud SQL MySQL database

Create a .env file to the root using "example of .env file" as an example. Make sure it has correct values. At least the database password needs to be set.

### Running the app using Docker

In the root of the putt-stats project (so one level up from here), run `docker-compose up --build`

The API will be exposed in http://localhost:8081

### Running the app without using Docker

First install dependencies with `npm i`

Build and run the API with `npm run serve`

If a database connection can't be formed, check that the server's network is in authorized networks in GCP.
