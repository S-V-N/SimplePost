import {PostRepository} from "../repository/postRepository.js";
import {UserRepository} from "../repository/userRepository.js";

class SimplePostBuilder {
    constructor() {
    }

    build = ({name}, userId, {head, date, id, shortContent, content, like}) => {
        return `
<div class="card" id="${id}" content="${content}">
    <div class="card_head">
        <span class="head_name">${head}</span>
        <span class="head_date">${date}</span>
        <span class="head_creator">${name}</span>
    </div>
    <div class="card_content">
        <p>${shortContent}</p>
    </div>
    <span type="button" class="open">Подробнее</span>
    <div type="button"  class="like">${like.length}${like.includes(userId) ? `<i class="fa-solid fa-heart"></i>` : `<i class="fa-regular fa-heart"></i>`}</div>
</div> `;
    }
}

class PostBuilderFactory {
    static getSimplePostBuilder = () => {
        return new SimplePostBuilder();
    }
}

/*
* Controller for page of posts:
*
*
* */

class PostService {
    static postBuilder = PostBuilderFactory.getSimplePostBuilder();

    static getPosts = async (id) => {
        let posts = await PostRepository.findAll();
        let htmlPosts = ``;
        for (let post of posts) {
            let user = await UserRepository.findUserById(post.creatorId)
            htmlPosts += PostService.postBuilder.build(user, id, post);
        }
        if (htmlPosts === ``) {
            htmlPosts = `<h1>Пока постов еще не написали</h1>`;
        }
        return htmlPosts;
    }

    static likePost = async (userId, postId) => {
        let post = await PostRepository.findPostById(postId);
        if (post.like.includes(userId)) {
            post.like = post.like.filter(e => e !== userId);
        } else {
            post.like.push(userId);
        }
        await PostRepository.updatePost(post);
    }
}

export {
    PostService
};