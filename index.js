import { URL } from "url";
import express from "express";

const dirname = new URL(".", import.meta.url).pathname;

const app = express();
app.use(express.static(dirname));

app.listen(3000);
