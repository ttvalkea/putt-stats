# Frontend and backend for a disc golf putting stat service

With this app you can easily mark your putt makes and misses when playing a round to gather statistics.

### Running the app with Docker

In the root of the putt-stats project (here), run `docker-compose up --build`

After that, the frontend can be accessed from http://localhost:3000 and the backend is exposed at http://localhost:8081

Unfortunately hot reload doesn't work when running the app this way, so running the app without docker for developing purposes may be a good idea.

To shut down the project, run `docker-compose down`
