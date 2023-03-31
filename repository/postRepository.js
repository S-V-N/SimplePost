import Datastore from 'nedb-promises';
import {v4 as uuid} from 'uuid';

const db = Datastore.create('posts.db')

/*
* Post's structure:
*
* {String} id
* {Date} date
* {String} creatorId
* {String} head
* {String} text
*
* */
class PostRepository {
    static savePost = async ({creatorId, shortContent, content, head}) => {
        let id = uuid();

        let fullDate = new Date();
        let dayOfMonth = fullDate.getDate();
        let month = fullDate.getMonth() + 1;
        let year = fullDate.getFullYear();
        let time = fullDate.getTime();
        year = year.toString().slice(-2);
        month = month < 10 ? '0' + month : month;
        dayOfMonth = dayOfMonth < 10 ? '0' + dayOfMonth : dayOfMonth;

        let date = `${dayOfMonth}.${month}.${year}`;

        await db.insert(
            {creatorId, head, shortContent, time, content, id, date, like: []}
        );

        return id;
    }
    static findPostById = async (id) => {
        return db.findOne({id});
    }

    static updatePost = async (post) => {
        await db.update({_id: post._id}, post);
    }

    static findAll = async () => {
        return (await db.find({})).sort((a, b) => {
            return (Number)(b.time) - (Number)(a.time);
        });
    }
}

export {
    PostRepository
};