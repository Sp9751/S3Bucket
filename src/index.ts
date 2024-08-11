import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import ConnectToMongo from "./config/db";
import { router } from "./routes/user.routes";
import { PORT, URI } from "./config/env.variable";
import { bucketRouter } from "./routes/sameTos3.routes";

const app = express();
app.use(cors());
app.use(bodyParser.json());

ConnectToMongo(URI);
app.use(router);
app.use(bucketRouter);

app.use("/", (req: Request, res: Response) => {
  res.status(200).send("Hello world");
});

app.listen(PORT, () => {
  console.log("sever are working");
});
