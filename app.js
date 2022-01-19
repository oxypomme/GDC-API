import express from "express";
import cors from "cors";
import { dirname } from "path";
import { fileURLToPath } from "url";
import apiRoutes from "./routes/api/index.js";
import graphRoutes from "./routes/graph/index.js";

export const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api", apiRoutes);
app.use("/graph", graphRoutes);

app.listen(8080, () => {
	console.log("Server ready");
});

app.use("/", express.static(__dirname + "/doc"));

export default app;
