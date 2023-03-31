import express from "express"
import {fileURLToPath} from "url";
import {dirname} from "path";

const FileRouter = express.Router();


const __filename = fileURLToPath(import.meta.url);

let __dirname = dirname(__filename);
 __dirname = __dirname.slice(0, __dirname.lastIndexOf("\\"))

FileRouter.get("/public/style/style.css", (req, res) => {
    res.sendFile(__dirname + "/public/style/style.css");
});

FileRouter.get("/public/js/index.js", (req, res) => {
    res.sendFile(__dirname + "/public/js/index.js");
});

FileRouter.get("/public/style/style.css.map", (req, res) => {
    res.sendFile(__dirname + "/public/style/style.css.map");
});

export {FileRouter};
