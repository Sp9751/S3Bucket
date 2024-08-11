import mongoose from "mongoose";

const ConnectToMongo = (Uri: string) => {
  mongoose.connect(Uri);
  mongoose.connection.once("open", () => {
    console.log("connect to DataBase");
  });
  mongoose.connection.on("error", () => {
    console.log("something is wrong to connect with database");
    process.exit();
  });
};

export default ConnectToMongo;
