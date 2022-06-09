

// Init block
///////////////////////////////////////////////////////////////////////////////


let username = getUsername(); 

if (document.getElementById("username") !== null){
    document.getElementById("username").innerHTML = username;
}

if (document.getElementById("profile-link") !== null){
    document.getElementById("profile-link").setAttribute("href", `/main/profile?token=${getToken()}`);
}

if (document.getElementById("main-link") !== null){
    if (getToken() == null){
        document.getElementById("main-link").setAttribute("href", `/`);
    }
    else{
        document.getElementById("main-link").setAttribute("href", `/main?token=${getToken()}`);
    }
    
}

if (document.getElementById("recipe-back-link") !== null){
    if (cameFrom() === "best"){
        document.getElementById("recipe-back-link").setAttribute("href", `/best?token=${getToken()}`);
    }
    else if (cameFrom() === "main"){
        document.getElementById("recipe-back-link").setAttribute("href", `/main?token=${getToken()}`);
    }
    else if (cameFrom() === "liked"){
        document.getElementById("recipe-back-link").setAttribute("href", `/main/liked?token=${getToken()}`);
    }
    else if (cameFrom() === "index"){
        document.getElementById("recipe-back-link").setAttribute("href", `/`);
    }
}

if (document.getElementById("add-recipe-link") !== null){
    document.getElementById("add-recipe-link").setAttribute("href", `/main/newRecipe?token=${getToken()}`)
}

if (document.getElementById("liked-link") !== null){
    document.getElementById("liked-link").setAttribute("href", `/main/liked?token=${getToken()}`)
}

if (document.getElementById("best-link") !== null){
    document.getElementById("best-link").setAttribute("href", `/best?token=${getToken()}`);
}

if (document.getElementById("moderate-link") !== null){
    document.getElementById("moderate-link").setAttribute("href", `/main/moderate?token=${getToken()}`);
}

if (document.getElementById("users-link") !== null){
    document.getElementById("users-link").setAttribute("href", `/main/users?token=${getToken()}`);
}

if (document.getElementById("index-link") !== null){
    document.getElementById("index-link").setAttribute("href", "/")
}


///////////////////////////////////////////////////////////////////////////////


function loadOnGrid(response, container, from){
    container.innerHTML = "";
    if (response.status === "SUCCESS"){
        for (let i = 0; i < response.result.length; i++){
            let element = document.createElement("div");
            element.classList.add("recipe-card");
            element.id = `card_${i}`;
            let data = JSON.parse(response.result[i].data);
            element.innerHTML = 
            `<a href="/recipe?token=${getToken()}&recipeName=${response.result[i].name}&from=${from}">
                <img class="recipe-photo img-rounded" src="/img/${data.imageName}">
                <div class="recipe-name" id="recipe_name_${i}">${response.result[i].name}</div>
                <br>
                <div class="recipe-short-description">${data.previewText}
                </div>
            </a>
            <br>
            <div class="recipe-footer">
            <div class="recipe-views"><img src="/source/views-icon.png" width="30" style="opacipy: 0.7">${response.result[i].views}</div>
                <div class="recipe-likes-container" onclick="like(this)" id="recipe_likes_container_${i}">
                    <div class="recipe-likes-counter" id="recipe_likes_counter_${i}">${response.result[i].likes}</div>
                    ${(response.result[i].liked)
                        ? `<div class="recipe-star-switcher" id="recipe_star_switcher_${i}" active><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 13 19">
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                        </svg></div>` 
                        : `<div class="recipe-star-switcher" id="recipe_star_switcher_${i}"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-star" viewBox="0 0 13 19">
                        <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
                        </svg></div>`}
                        </div></div></div>
                `;
            container.append(element);
            appendClassNames(element.querySelectorAll("p"));
        }
    }
    else{
        let element = document.createElement("div");
        element.innerHTML = response.result;
        container.append(element);
    }
}

function loadOnTable(response, table, from){
    table.innerHTML = "";
    if (response.status == "SUCCESS"){
        let recipes = response.result;
        
        table.innerHTML += "<tr><td>Название</td><td>Ник автора</td><td>Описание</td><td>Кол-во просмотров</td><td>Кол-во лайков</td><td>Кол-во комментариев</td><td>Действия</td></tr>"
        
        for(let i = 0; i < recipes.length; i++){
            table.innerHTML += `<tr id="row_${recipes[i].id}"><td>${recipes[i].name}</td><td>${recipes[i].creatorName}</td><td>${JSON.parse(recipes[i].data).previewText}</td><td>${recipes[i].views}</td><td>${recipes[i].likes}</td><td>${recipes[i].comments}</td><td><a href="/recipe?token=${getToken()}&recipeName=${recipes[i].name}&from=${from}"><div class="btn btn-primary">Страница рецепта</div></a>${(isAdmin()) ? ('<div class="btn btn-danger" onclick="' + deleteRecipe(recipes[i].id) + '">Удалить рецепт</div>') : ""}</td></tr>`
        }
    }
    else{
        table.innerHTML = "<h2>Ошибка при загрузке результата</h2>";
    }
}

let form = document.getElementById("search-form");

if (form !== null){
    form.addEventListener("submit", (ev) => {
        ev.preventDefault();
        let searchString = document.getElementById("search-field").value.trim();
        if (searchString.length > 0){
            $.ajax({
            type: "POST",
            url: "/main",
            data: "username=" + username + "&" + "search=" + searchString,
            success: function(response){
                let container = document.getElementById("content-container");
                loadOnGrid(response, container, "main");
            },
            error: function(e) {
                console.log(e);
            }
        })
        }
    });
}


//////////////////////////////////////////////////////////////////////////


function deleteRecipe(id){
    $.ajax({
        type: "post",
        url: "/deleteRecipe",
        data: "id=" + id,
        success: function (response){
            if (response.status == "SUCCESS"){
                document.getElementById(`row_${id}`).remove();
            }
        },
        error: function (e){
            console.log(e);
        }
    });
}


function loadBest(){
    let sortBy = document.getElementById("sortBy").value;
    $.ajax({
        type: "post",
        url: "/best",
        data: "sortBy=" + sortBy,
        success: function (response){
            let table = document.getElementById("content-table");
            loadOnTable(response, table, "best");
        },
        error: function (e){
            console.log(e);
        }
    });
}

function incrementLike(recipe_name, counter_id){
    $.ajax({
        type: "post",
        url: "/likeInc",
        data: "name=" + recipe_name + "&" + "username=" + username,
        success: function(response){
            if (response.status === "SUCCESS"){
                document.getElementById(counter_id).innerHTML = Number(document.getElementById(counter_id).innerHTML) + 1;
            }
        },
        error: function(e){
            console.log(e);
        }
    })
}

function decrementLike(recipe_name, counter_id){
    $.ajax({
        type: "post",
        url: "/likeDec",
        data: "name=" + recipe_name + "&" + "username=" + username,
        success: function(response){
            if (response.status === "SUCCESS"){
                document.getElementById(counter_id).innerHTML = Number(document.getElementById(counter_id).innerHTML) - 1;
            }
        },
        error: function(e){
            console.log(e);
        } 
    })
}

function loadLiked(){
    let sortBy = document.getElementById("sortBy").value;

    let username = getUsername();
    $.ajax({
        type: "post",
        url: "/loadLiked",
        data: "sortBy=" + sortBy + "&username=" + username,
        success: function (response){
            let container = document.getElementById("content-container");
            loadOnGrid(response, container, "liked");
        },
        error: function (e){
            console.log(e);
        }
    });

}

function like(el){
    let parsed_id = Number(el.id.split("_")[3]);

    let star = document.getElementById(`recipe_star_switcher_${parsed_id}`);

    if (star.hasAttribute("active")) {
        star.removeAttribute("active");
        star.innerHTML = "";

        star.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-star" viewBox="0 0 13 19">
            <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
            </svg>`;
        let recipe_name = document.getElementById(`recipe_name_${parsed_id}`).innerHTML;
        decrementLike(recipe_name, `recipe_likes_counter_${parsed_id}`);
    }
    else{
        star.setAttribute("active", "");
        star.innerHTML = "";
        star.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 13 19">
            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
            </svg>`;
        let recipe_name = document.getElementById(`recipe_name_${parsed_id}`).innerHTML;
        incrementLike(recipe_name, `recipe_likes_counter_${parsed_id}`);
    }
}

function appendClassNames(elements){
    const attributes = ["recipe-text-header", "recipe-text", "recipe-steps-header", "recipe-steps"];

    attributes.forEach(el => {
        for (let element of elements){
            if (element.hasAttribute(el)){
                element.classList.add(el);
            }
        }
    });
}

function addTagInput(){
    let container = document.getElementById("tags-container");

    if (container.innerHTML === ""){
        container.innerHTML = `<div id="tag-block_0">
                                   <div class="input-group mb-3">
                                   <input type="text" placeholder="Тег рецепта"  class="tag-field form-control" id="tag-block-text_0">
                                   <div class="input-group-append">
                                   <input type="button" style="margin: 0;" value="X" class="btn btn-danger" id="tag-block-del_0" onclick="deleteTagInput(this)"></div></div>
                               </div>`
    }
    else{
        let child_array = Array.from(container.children);
        let children_id = child_array.map((el) => Number(el.id.split("_")[1]));
        let free_id = -1
        for (let id = 0; id < 100; id++){
            if (children_id.includes(id) === false){
                free_id = id;
                break;
            }
        }
        if (free_id == -1){
            createToast("Превышен лимит на кол-во тегов", "red");
            return;
        }
        let element = document.createElement("div");
        element.id = `tag-block_${free_id}`;
        element.innerHTML = `<div class="input-group mb-3"><input type="text" placeholder="Тег рецепта" class="tag-field form-control" id="tag-block-text_${free_id}">
        <div class="input-group-append"><input type="button" class="btn btn-danger" value="X" style="margin: 0;" id="tag-block-del_${free_id}" onclick="deleteTagInput(this)"></div></div>`
        container.append(element);
    }
}

function deleteTagInput(element){
    let id = element.id.split('_')[1];
    document.getElementById(`tag-block_${id}`).remove();
}

function addIngInput(){
    let container = document.getElementById("ings-container");

    if (container.innerHTML === ""){
        container.innerHTML = `<div id="ing-block_0" class="ing-block">
                                   <div class="input-group mb-3">
                                        <div class="input-group-prepend"><span class="input-group-text">Ингредиент</span></div>
                                        <input type="text" class="ing-name form-control" placeholder="Название" id="ing-block-text_0">
                                        <input type="text" class="ing-amount form-control" placeholder="Кол-во">
                                        <input type="button" value="X" class="btn btn-danger" style="margin: 0;" id="ing-block-del_0" onclick="deleteIngInput(this)">
                                    </div>
                               </div>`
    }
    else{
        let child_array = Array.from(container.children);
        let children_id = child_array.map((el) => Number(el.id.split("_")[1]));
        let free_id = -1
        for (let id = 0; id < 100; id++){
            if (children_id.includes(id) === false){
                free_id = id;
                break;
            }
        }
        if (free_id == -1){
            createToast("Превышен лимит на кол-во тегов", "red");
            return;
        }
        let element = document.createElement("div");
        element.className = "ing-block";
        element.id = `ing-block_${free_id}`;
        element.innerHTML = `<div class="input-group mb-3">
        <div class="input-group-prepend"><span class="input-group-text">Ингредиент</span></div>
        <input type="text" class="ing-name form-control" placeholder="Название" id="ing-block-text_${free_id}">
        <input type="text" class="ing-amount form-control" placeholder="Кол-во">
        <input type="button" class="btn btn-danger" style="margin: 0;" value="X" id="ing-block-del_${free_id}" onclick="deleteIngInput(this)">
        </div>`
        container.append(element);
    }
}

function deleteIngInput(element){
    let id = element.id.split('_')[1];
    document.getElementById(`ing-block_${id}`).remove();
}

function createRecipe(){
    let name = document.getElementById("new-recipe-name").value;

    let short_desc = document.getElementById("short-description").value;

    let tags_fields = document.querySelectorAll(".tag-field");
    let tags = Array.from(tags_fields).map(el => el.value);

    let ings_names_fields = document.querySelectorAll(".ing-name");
    let ings_names = Array.from(ings_names_fields).map(el => el.value);

    let ings_amounts_fields = document.querySelectorAll(".ing-amount");
    let ings_amounts = Array.from(ings_amounts_fields).map(el => el.value);

    let description = document.getElementById("description").value;

    let photo = document.getElementById("new-recipe-image").files[0];

    if (name === "" || short_desc === "" || description === "" || photo.value !== undefined || tags.includes("") || ings_names.includes("") || ings_amounts.includes("")){
        createToast("Необходимо заполнить все поля", "red");
        return;
    }

    let ings = new Map();

    for (let i = 0; i < ings_names.length; i++){
        ings.set(ings_names[i], ings_amounts[i]);
    }

    console.log(name, tags, ings, description, photo);
}

function createToast(message, color="yellow") {
    let toast = document.createElement("div");

    let number = document.querySelectorAll(".toast").length;

    toast.className = "alert";
    toast.id = "toast_" + number;
    toast.style = `width: max-content; height: max-content; font-size: 15pt; position: fixed; top: 30px; left: 30px; z-index: 1050; background-color: ${color}; padding: 20px; opacity: 0.7`;
    toast.innerHTML = message;
    document.querySelector("body").append(toast);
    setTimeout(() => {
        document.getElementById(toast.id).remove();
    }, 2000);
}