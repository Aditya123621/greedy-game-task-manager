import { connectDB } from "./db/index.js";
import { app } from "./app.js";
import dotenv from "dotenv";
dotenv.config();

console.log(process.env.PORT,"process.env.PORT")

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 5001, function (err) {
      if (err) {
        console.error(err, "Here I have console log the error");
      }
      console.log("Server running on, ", process.env.PORT);
    });
  })
  .catch((err) => {
    console.log("There was problem saar", err);
  });
