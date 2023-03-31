import express from "express"
import session from "express-session"
import {FileRouter} from "./router/fileRouter.js";
import {AccountRouter} from "./router/accountRouter.js";
import {MainRouter} from "./router/mainRouter.js";
import makeStore from 'nedb-promises-session-store';

const app = express();

app.set('trust proxy', 1);

app.use(session({
    secret: '11bf5t37-e0b8-42e0-8dcf-dc8c4aqfc090',
    resave: true,
    store: makeStore({
        connect: session,
        filename: 'store.db'
    }),
    saveUninitialized: true,
    cookie: {secure: false, maxAge: 1000 * 60 * 60 * 24 * 30}
}));

app.use(MainRouter);
app.use(AccountRouter);
app.use(FileRouter);
app.listen(3000, () => {
    console.log("Start!");
});
