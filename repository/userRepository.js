import Datastore from 'nedb-promises';
import {v4 as uuid} from 'uuid';

const db = Datastore.create('user.db')

/*
* User's structure:
*
* {String} id
* {String} name
* {String} login
* {String} password
*
* */
class UserRepository {
    static saveUser = async ({name, login, password}) => {
        let id = uuid();
        await db.insert(
            {name, login, password, id}
        );
        return id;
    }
    static findUserByLogin = async (login) => {
        return db.findOne({login});
    }

    static findUserById = async (id) => {
        return db.findOne({id});
    }
}

export {
    UserRepository
};