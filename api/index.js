"use strict";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { createClient } from "redis";
import mysql from "mysql2/promise";
//import { v4: uuidv4 } = require('uuid');
import { v4 as uuidv4 } from 'uuid';


dotenv.config();
// environment variables
const expressPort = 5001;

// redis
const redisUrl = 'redis://localhost:6379'
// mysql
const myTable ="exam_db";

// configs

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "root",
  database: "mydb",
};

const redisClient = createClient({ url: redisUrl });

const getMysqlData = async () => {
  const sqlQuery = `SELECT data FROM ${myTable}`;
  const sqlConnection = await mysql.createConnection(dbConfig);
  return sqlConnection.execute(sqlQuery);
};

const insertDataMysql = async (data) => {
  let guid = uuidv4().toString();
  console.log(guid);

  //const sqlQuery = `INSERT INTO ${myTable} (id,data) VALUES(${guid},${data})`;
  const sqlQuery = `INSERT INTO ${myTable} (id,data) VALUES('${guid}','${data}')`;

  const sqlConnection = await mysql.createConnection(dbConfig);
  return sqlConnection.execute(sqlQuery);
};


const setRedisData = async (jsonData) => {
  const value = JSON.stringify({ data: jsonData });
  await redisClient.connect();
  await redisClient.set("key", value);
  return redisClient.disconnect();
};

const getRedisData = async () => {
  await redisClient.connect();
  const cachedData = await redisClient.get("key");
  await redisClient.disconnect();
  return cachedData;
};

const deleteRedisData = async () => {
  await redisClient.connect();
  await redisClient.del("key");
  return redisClient.disconnect();
};



//express
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// express endpoints
app.get("/", (_, res) => res.status(200).send("connected to server 1!"));
app.get("/get", async (_, res) => {
  try {

    const [data, _] = await getMysqlData();
    res.status(200).json({ data });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: "failure", error });
  }
});

app.get("/getredisdata", async (_, res) => {
  try {

    let data = await getRedisData();
    console.log(data);
    res.status(200).json({ data });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: "failure", error });
  }
});


app.post("/create", async (req, res) => {
  const { data } = req.body;
  console.log("data from request ",data);
  try {
    if (!data) throw new Error("missing data");
    await insertDataMysql(data);
    await setRedisData(data);
    console.log('data from redis ',await getRedisData())
    res.status(200).json({ message: "success" });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: "failure", error });
  }
});

app.listen(expressPort, () => console.log(`served on port ${expressPort}`));
