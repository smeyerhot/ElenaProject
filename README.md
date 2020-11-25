# Elena Project

This is the final project for c520 UMass Amherst

#### What you need to run this code
1. Node (13.12.0)
2. NPM (6.14.4) or Yarn (1.22.4)
3. MYSQL (8.0.17)


####  How to run this code

cd server 

npm install

vi .env

npm run start

####  Inside of server/.env :

DB_HOST=localhost

DB_DRIVER=mysql     

DB_PORT=3306

DB_USER=<your_mysql_username>

DB_PASSWORD=<your_mysql_database_password> 

DB_NAME=<your_mysql_database_name>

PORT=5000

API_KEY=<your_googlemaps_api_key>

Note: Key must have 1. Maps JavaScript API and 2. Maps Elevation API enabled. https://developers.google.com/maps/documentation/javascript/elevation

####  Back in /server :

cd ../

cd client

npm install

npm run dev


### FWI

Currently, the login system hashes, salts, and stores user info in our database. We also issue jwt's on the backend. The frontend has two "hidden routes" /signin and /signup. This system was created in the interest of scalability and extensibility. We didn't encorporate this functionality in our UI but the architecture is stable and offers a solid foundation for building upon.

