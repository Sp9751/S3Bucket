import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const Secret = process.env.Secret;
const PORT = process.env.PORT;
const URI = process.env.DBURI;

export { Secret, PORT, URI };
