import express from "express";
import { config } from "dotenv";
import cors from "cors";

//middleware
import connectDb from "./middleware/db-connect.js";

//routes
import routeCharacter from "./routes/Character.Route.js";
import routeUser from "./routes/User.Route.js";

config();

const app = express();
const port = process.env.PORT || 5000;

connectDb();

app.use(express.json());
app.use(cors());

// Routes
app.use("/Character", routeCharacter);
app.use("/User", routeUser);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
