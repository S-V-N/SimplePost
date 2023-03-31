import express from "express"
import {fileURLToPath} from "url";
import {dirname} from "path";
import fs from "fs";
import {PostService} from "../service/postService.js";
import {PostRepository} from "../repository/postRepository.js";

const MainRouter = express.Router();


const __filename = fileURLToPath(import.meta.url);
let __dirname = dirname(__filename);
__dirname = __dirname.slice(0, __dirname.lastIndexOf("\\"))

const urlencodedParser = express.urlencoded({extended: false});

MainRouter.get("/", async (req, res) => {
    if (!req.session.uid) {
        res.redirect("/login");
        return;
    }
    let header = await fs.readFileSync("./public/header.html");
    let footer = await fs.readFileSync("./public/footer.html");
    res.send(header + await PostService.getPosts(req.session.uid) + footer)
});

MainRouter.post("/", urlencodedParser, async (req, res) => {
    if (!req.session.uid) {
        res.redirect("/login");
        return;
    }
    if (!req.body) return res.sendStatus(400);
    let post = {
        creatorId: req.session.uid,
        shortContent: req.body.shortContent,
        content: req.body.content,
        head: req.body.head
    };
    await PostRepository.savePost(post);
    res.redirect("./");
});

MainRouter.get("/like/:postId", async (req, res) => {
    if (!req.session.uid) {
        res.redirect("/login");
        return;
    }
    let postId = req.params.postId;
    let userId = req.session.uid;
    await PostService.likePost(userId, postId);
    res.sendStatus(200);
});

export {MainRouter};

