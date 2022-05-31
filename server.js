import app from "./app.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: "./.env" });

//suppose we have uncaught error (ex console.log(x))
//We have to define this process.on before any exception ,any exception occurs after defining this process.on will be not handled by this handler
process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("UNCAUGHT Exception");

  process.exit(1);
});

//local DB connection
// const DB = process.env.DB_LOCAL;

//cloud db connection
const DB = process.env.DB_CLOUD.replace("<PASSWORD>", process.env.DB_PASSWORD);


mongoose
  .connect(DB)
  .then((connection) => {
    console.log("DB connection is successful");
  })
  .catch((err) => {
    console.log(err);
  });

const PORT = process.env.PORT || 8000;

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


//part of hero ku deployment
//heroku dyno -> dyno ->A container in which a our application is running
//this dyno restarts in every 24hrs in order to make our app healthy state
//the way heroku does this by sending  SiGTERM signal to our nodejs signal and the application shut down immediately
//the problem with this is the shutdown can be problematic and this can leave request currently being executed hanging in the air
process.on("SIGTERM", (err) => {
  console.log("SIGTERM recieved, shutting down ...........");
  server.close(() => {
    console.log("process terminated");
  });
  
});