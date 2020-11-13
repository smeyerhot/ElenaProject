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

API_KET=<your_googlemaps_api_key>

####  Back in /server :

cd ../

cd client

npm install

npm run dev




