const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRouter = require("./routes/userRoutes");
dotenv.config({ path: "./.env" });

const app = express();
app.use(express.json());
app.use("/user", userRouter);

const DB = process.env.DATABASE.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB)
  .then(() => {
    console.log("DB connection secured !!");
  })
  .catch((e) => {
    console.log(e);
  });

const port = 1234;

app.listen(port, () => {
  try {
    console.log("The server is running !!!!");
  } catch (error) {
    console.log("server error: " + error);
  }
});
