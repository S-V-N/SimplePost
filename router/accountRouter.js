import express from "express";
import {fileURLToPath} from "url";
import {dirname} from "path";

import {UserRepository} from "../repository/userRepository.js";

const AccountRouter = express.Router();

const __filename = fileURLToPath(import.meta.url);

let __dirname = dirname(__filename);
__dirname = __dirname.slice(0, __dirname.lastIndexOf("\\"))

const urlencodedParser = express.urlencoded({extended: false});

AccountRouter.get("/reg", async (req, res) => {
    res.sendFile(__dirname + "/public/reg.html");
});

AccountRouter.get("/login", async (req, res) => {
    res.sendFile(__dirname + "/public/login.html");
});

AccountRouter.get("/reg/:login", urlencodedParser, async (req, res) => {
    let user = await UserRepository.findUserByLogin(req.params.login);
    if (user === null) {
        res.send("true");
    } else {
        res.send("false");
    }
});

AccountRouter.post("/reg", urlencodedParser, async (req, res) => {
    if (!req.body) return res.sendStatus(400);
    await UserRepository.saveUser(req.body);
    res.redirect("/login");
});

AccountRouter.post("/login", urlencodedParser, async (req, res) => {
    if (!req.body) return res.sendStatus(400);
    let user = await UserRepository.findUserByLogin(req.body.login);
    if (user == null || user.password !== req.body.password) {
        res.sendFile(__dirname + "/public/login-error.html");
    } else {
        req.session.uid = user.id;
        res.redirect("./");
    }
});

AccountRouter.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/login");
});

export {AccountRouter};
