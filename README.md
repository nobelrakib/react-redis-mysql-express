# react-redis-mysql-express
1.Download docker.
2.run these command
 ----docker pull redis
 ----docker run -d -p 6379:6379 --name redis-container redis
 ----docker pull mysql
 ----docker run --name mysql-container -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mysql
 
 3. After that enter into mysql container by this command
 ----docker exec -it mysql-container mysql -uroot -p
4.run these scripts
----
    DROP DATABASE IF EXISTS mydb;

    CREATE DATABASE mydb;

    USE mydb;

    DROP TABLE IF EXISTS exam_db;

    CREATE TABLE exam_db ( 
      id VARCHAR(255) PRIMARY KEY,, 
      data VARCHAR(255)
    );
 5.Go to api folder and client folder seperately and run npm install
 6.Now for api run node index.js and for client run npm start
 
