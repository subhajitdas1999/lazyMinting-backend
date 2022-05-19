import app from "./app.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: "./.env" });

//local DB connection
const DB = process.env.DB_LOCAL;

//cloud db connection
// const DB = process.env.DB_CLOUD.replace("<password>", process.env.DB_PASSWORD);

mongoose
  .connect(DB)
  .then((connection) => {
    console.log("DB connection is successful");
  })
  .catch((err) => {
    console.log(err);
  });

const PORT = 3000;

const server = app.listen(PORT, () =>
  console.log(`starts listening on port ${PORT}`)
);
