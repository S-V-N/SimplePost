const searchString = document.getElementById("menu_search");
const cards = document.getElementsByClassName("card");

const infoWrapper = document.getElementById("full-card_wrapper");
const info = document.getElementById("full-card");
const close = document.getElementById("full-card_wrapper_close");
const closeCreatePost = document.getElementById("new-post_wrapper_close");
const openCreatePost = document.getElementById("new-post");
const createPostWrapper = document.getElementById("new-post_wrapper");

const pushPost = document.getElementById("new-post_btn");
const headOfPost = document.getElementById("form_head");
const shortOfPost = document.getElementById("form_short-content");
const contentOfPost = document.getElementById("form_content");

const _alert = (text) => {
    let msg = document.createElement("div");
    msg.classList.add("alert");
    msg.textContent = text;
    document.body.appendChild(msg);
    setTimeout(() => {
        document.body.removeChild(msg);
    }, 5000);
};

pushPost.addEventListener("click", (e) => {
    let head = headOfPost.value;
    let short = shortOfPost.value;
    let content = contentOfPost.value;

    let showError = (element, msg) => {
        element.style = "border:5px solid #f15151;"
        _alert(msg)
        setTimeout(() => {
            element.style = "";
        }, 500);
        e.preventDefault();
    }

    if (head.trim().length === 0) {
        showError(headOfPost, "Заголовок не может быть пустым.");
    } else if (short.trim().length === 0) {
        showError(shortOfPost, "Краткое описание не может быть пустым.");
    } else if (content.trim().length === 0) {
        showError(contentOfPost, "Содержание поста не может быть пустым.");
    }

    if (head.trim().length > 20) {
        showError(headOfPost, "Максимальный размер Заголовка 20 символов");
    } else if (short.trim().length > 100) {
        showError(shortOfPost, "Максимальный размер Краткое описания 100 символов");
    }


});
openCreatePost.addEventListener("click", () => {
    createPostWrapper.classList.add("active");
});

closeCreatePost.addEventListener("click", () => {
    createPostWrapper.classList.remove("active");
    createPostWrapper.classList.add("deactive");
    setTimeout(() => {
        createPostWrapper.classList.remove("deactive");
    }, 700);
});

let addLike = (likes, id) => () => {
    fetch(`/like/${id}`)
        .then(response => {
                if (response.status !== 200) {
                    _alert("Кажется произошла ошибка :(");
                } else {
                    for (let like of likes) {
                        if (like.classList.contains("fa-regular")) {
                            like.parentElement.firstChild.textContent = parseInt(like.parentElement.textContent) + 1 + "";
                        } else {
                            like.parentElement.firstChild.textContent = parseInt(like.parentElement.textContent) - 1 + "";
                        }
                        like.classList.toggle("fa-regular");
                        like.classList.toggle("fa-solid");
                    }
                }
            },
            () => {
                _alert("Потеряно соединение с сервером :(");
            });
}
close.addEventListener("click", (e) => {
    infoWrapper.classList.remove("active");
    infoWrapper.classList.add("deactive");
    setTimeout(() => {
        infoWrapper.classList.remove("deactive");
    }, 700);
});

const cardsInfo = [];
const search = (card, patterns, oldFlag) => {
    let pattern = patterns[0];
    let flag = false;
    const {head, short} = card;

    if (head.includes(pattern) || short.includes(pattern)) {
        flag = true;
    } else {
        for (let i = 0; i < pattern.length; i++) {
            let start = pattern.slice(0, i);
            let end = pattern.slice(i + 1);

            let regexp = new RegExp(`${start}.${end}`, 'gi');

            if (head.search(regexp) !== -1 || short.search(regexp) !== -1) {
                flag = true;
            }
        }
    }
    if (patterns.length === 1) {
        return oldFlag && flag;
    } else {
        patterns.splice(0, 1);
        return oldFlag && search(card, patterns, flag);
    }
};
searchString.addEventListener("change", (e) => {
        const pattern = searchString.value;
        for (let card of cardsInfo) {
            if (search(card, pattern.split(" "), true)) {
                card.element.classList.remove("hide");
            } else {
                card.element.classList.add("hide");
            }
        }
    }
);
for (let card of cards) {

    let content = card.getAttribute("content");

    cardsInfo.push(
        {
            head: card.getElementsByClassName("head_name")[0].textContent,
            short: card.getElementsByClassName("card_content")[0].textContent,
            content,
            element: card
        }
    );

    let open = card.getElementsByClassName("open")[0];
    let like = card.getElementsByClassName("fa-heart")[0];

    open.addEventListener("click", (e) => {
        infoWrapper.classList.toggle("active");
        infoWrapper.classList.remove("deactive");

        info.innerHTML = card.innerHTML;
        info.getElementsByClassName("card_content")[0].textContent = content;
        let likeInfo = info.getElementsByClassName("fa-heart")[0];
        likeInfo.addEventListener("click", addLike([likeInfo, like], card.id));
    });

    like.addEventListener("click", addLike([like], card.id));
}

