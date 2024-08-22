import express from "express";
import cors from "cors";
import "./loadEnvironment.mjs";
import "express-async-errors";
import todoList from "./routes/todoList.mjs";
import "./loadEnvironment.mjs";
const PORT = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());
// Middleware to check for User ID in the request headers
app.use((req, res, next) => {
  const userId = req.headers["user-code"];

  if (!userId) {
    return res.status(400).send("User ID is required in the headers.");
  }

  next();
});

// Load the /todoList routes
app.use("/todoList", todoList);

// Global error handling
app.use((err, _req, res, next) => {
  console.log(err);
  res.status(500).send("Uh oh! An unexpected error occured.");
});

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
