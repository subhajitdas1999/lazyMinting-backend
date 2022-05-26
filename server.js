import app from "./app.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: "./.env" });

//suppose we have uncaught error (ex console.log(x))
//We have to define this process.on before any exception ,any exception occurs after defining this process.on will be not handled by this handler
process.on("uncaughtException",err => {
  console.log(err.name, err.message);
  console.log("UNCAUGHT Exception");
  
    process.exit(1);
})

//local DB connection
const DB = process.env.DB_LOCAL;

//cloud db connection
// const DB = process.env.DB_CLOUD.replace("<PASSWORD>", process.env.DB_PASSWORD);

mongoose.connect(DB).then((connection) => {
  console.log("DB connection is successful");
})
.catch((err) => {
  console.log(err);
});

const PORT =process.env.PORT || 8000;

const server = app.listen(PORT, () =>
  console.log(`starts listening on port ${PORT}`)
);

//any UnhandledPromiseRejection(suppose our cloud db is down for reason)
//Each time there is unhandled rejection in our app the process obj will emit an object called unhandled rejection, we have subscribe to that event

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION");
  server.close(() => {
    process.exit(1);
  });
});

