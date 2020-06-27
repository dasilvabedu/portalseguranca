# Water dams geospatialization
---

#### System project for geospatial monitoring of dams, initially in Brazil.

#
#### Pre-requirements

*Make Sure you have `Docker` and `Docker Compose` installed!*

#### Installation

In order to get up and running with this project it is pretty simple, you just have to:

  - `git clone` this repository into your local machine
  - `cd` into root folder where you have cloned it
  - run `docker-compose build` to build the images into your machine
  - run `docker-compose up` to start those built images

At this moment you have the containers running, you now just have to install ruby and javascript dependencies as follow:

  - Open a new tab or window in your terminal, console or multiplexer
  - Run `docker-compose run --rm rails bundle install` to install ruby gems
  - Run `docker-compose run --rm rails rails db:setup` to load the database
  - Run `docker-compose run --rm node npm install` to install javascript dependencies, this might take a while, don't worry

#### That's it!
##### You should now be able to access `http://localhost:8003` and see it running!

#### Do not forget to update this README if you change the project, it will help the next as it just helped you!
