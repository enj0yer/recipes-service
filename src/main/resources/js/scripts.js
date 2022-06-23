

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

if (document.getElementById("ingredients-search-link") !== null){
    document.getElementById("ingredients-search-link").setAttribute("href", "/ingredientsSearch?token=" + getToken());
}

if (document.getElementById("add-recipe-link") !== null){
    document.getElementById("add-recipe-link").setAttribute("href", `/main/newRecipe?token=${getToken()}`)
}

if (document.getElementById("service-name") !== null){
    document.getElementById("service-name").setAttribute("href", `/main?token=${getToken()}`);
}

if (document.getElementById("liked-link") !== null){
    document.getElementById("liked-link").setAttribute("href", `/main/liked?token=${getToken()}`)
}

if (document.getElementById("best-link") !== null){
    document.getElementById("best-link").setAttribute("href", `/best?token=${getToken()}`);
}

if (document.getElementById("moderate-link") !== null){
    document.getElementById("moderate-link").setAttribute("href", `/moderate?token=${getToken()}`);
}

if (document.getElementById("users-link") !== null){
    document.getElementById("users-link").setAttribute("href", `/userList?token=${getToken()}`);
}

if (document.getElementById("index-link") !== null){
    document.getElementById("index-link").setAttribute("href", "/")
}


///////////////////////////////////////////////////////////////////////////////

/**
 * Load a result of response on grid container
 * @param {Object} response 
 * @param {HTMLElement} container 
 * @param {String} from 
 */
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
                <div class="recipe-likes-container" ${(getToken() === null) ? "" : 'onclick="like(this)"'} id="recipe_likes_container_${i}">
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

/**
 * Load a result of response on table container
 * @param {Object} response 
 * @param {HTMLElement} table 
 * @param {String} from 
 */
function loadOnTable(response, table, from="main", renderAdminBtn=true){
    table.innerHTML = "";
    if (response.status == "SUCCESS"){
        let recipes = response.result;
        
        table.innerHTML += "<tr><td>Название</td><td>Ник автора</td><td>Описание</td><td>Кол-во просмотров</td><td>Кол-во лайков</td><td>Кол-во комментариев</td><td>Действия</td></tr>"
        
        for(let i = 0; i < recipes.length; i++){
            table.innerHTML += `<tr id="row_${recipes[i].id}"><td>${recipes[i].name}</td><td><a href="/user?token=${getToken()}&username=${recipes[i].creatorName}">${recipes[i].creatorName}</a></td><td>${JSON.parse(recipes[i].data).previewText}</td><td>${recipes[i].views}</td><td>${recipes[i].likes}</td><td>${recipes[i].comments}</td><td><a href="/recipe?token=${getToken()}&recipeName=${recipes[i].name}&from=${from}"><div class="btn btn-primary">Страница рецепта</div></a>${(isAdmin() && renderAdminBtn) ? (`<div class="btn btn-danger" onclick=" deleteRecipeById(${recipes[i].id}, 'best')">Удалить рецепт</div>`) : ""}</td></tr>`
        }
    }
    else{
        table.innerHTML = "<h2>Ошибка при загрузке результата</h2>";
    }
}


/**
 * Load a result of response on grid container for moderation
 * @param {Object} response 
 * @param {HTMLElement} table 
 */
function loadOnTableForModeration(response, table){
    table.innerHTML = "";
    if (response.status === "SUCCESS"){
        let recipes = response.result;

        table.innerHTML += "<tr><td>Название</td><td>Ник автора</td><td>Описание</td><td>Кол-во просмотров</td><td>Кол-во лайков</td><td>Кол-во комментариев</td><td>Действия</td></tr>";

        for (let i = 0; i < recipes.length; i++){
            table.innerHTML += `<tr id="row_${recipes[i].id}"><td>${recipes[i].name}</td><td><a href="/user?token=${getToken()}&username=${recipes[i].creatorName}">${recipes[i].creatorName}</a></td><td>${JSON.parse(recipes[i].data).previewText}</td><td>${recipes[i].views}</td><td>${recipes[i].likes}</td><td>${recipes[i].comments}</td><td><div class="btn btn-primary" style="cursor: pointer;" onclick="commitRecipeById(${recipes[i].id})">Подтвердить рецепт</div><a href="/updateRecipe?token=${getToken()}&recipeName=${recipes[i].name}"><div class="btn btn-warning">Редактировать</div></a><div class="btn btn-danger" style="cursor: pointer;" onclick="deleteRecipeById(${recipes[i].id})">Удалить рецепт</div></td></tr>`
        }
    }
}

function loadProfileLikedRecipes(){

    let table = document.getElementById("content-table");
    let sortBy = document.getElementById("sortBy").value;

    $.ajax({
        type: "post",
        url: "/loadLiked",
        data: "sortBy=" + sortBy + "&username=" + getProfileUsername(),

        success: function (response) {
            loadOnTable(response, table, renderAdminBtn=false);
        },
        error: function (e){
            console.log(e);
        }
    });
}

function loadAdded(){
    let sortBy = document.getElementById("sortBy").value;
    let table = document.getElementById("content-table-2");

    $.ajax({
        type: "post",
        url: "/loadAdded",
        data: "sortBy=" + sortBy + "&username=" + getProfileUsername(),

        success: function (response){
            loadOnTable(response, table, renderAdminBtn=false);
        },
        error: function (e){
            console.log(e);
        }
    });
}


let form = document.getElementById("search-form");

if (form !== null){
    form.addEventListener("submit", (ev) => {
        ev.preventDefault();
        let searchString = document.getElementById("search-field").value.trim();
        if (searchString.length > 0){
            $.ajax({
                type: "post",
                url: "/main",
                data: "username=" + username + "&" + "search=" + searchString,
                success: function(response){
                    let container = document.getElementById("content-container");
                    loadOnGrid(response, container, "main");
                },
                error: function(e) {
                    console.log(e);
                }
            });
        }
    });
}


//////////////////////////////////////////////////////////////////////////



/**
 * Load best recipes on container with sortBy
 */
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

/**
 * 
 * @param {String} recipe_name 
 * @param {String} counter_id 
 */
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

/**
 * 
 * @param {String} recipe_name 
 * @param {String} counter_id 
 */
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

/**
 * Load recipes, liked by current user
 */
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

/**
 * Switch like condition
 * @param {HTMLElement} el 
 */
function like(el){
    if (getToken() === null){
        window.location.href = "/login";
    }
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

/**
 * 
 * @param {HTMLElement[]} elements 
 */
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

/**
 * Add tag input on newRecipe page
 */
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

/**
 * Delete tag input on newRecipe page
 * @param {HTMLElement} element 
 */
function deleteTagInput(element){
    let id = element.id.split('_')[1];
    document.getElementById(`tag-block_${id}`).remove();
}

/**
 * Add ingredient input on newRecipe page
 */
function addIngInput(full=true){
    let container = document.getElementById("ings-container");

    if (container.innerHTML === ""){
        container.innerHTML = `<div id="ing-block_0" class="ing-block">
                                   <div class="input-group mb-3">
                                        <div class="input-group-prepend"><span class="input-group-text">Ингредиент</span></div>
                                        <input type="text" class="ing-name form-control" placeholder="Название" id="ing-block-text_0">${(full) ? `<input type="text" id="ing-block-amount_0" class="ing-amount form-control" placeholder="Кол-во">` : ""}
                                        <div class="input-group-append">
                                        <input type="button" value="X" class="btn btn-danger" style="margin: 0;" id="ing-block-del_0" onclick="deleteIngInput(this)"></div>
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
                                <input type="text" class="ing-name form-control" placeholder="Название" id="ing-block-text_${free_id}">${(full) ? `<input type="text" id="ing-block-amount_${free_id}" class="ing-amount form-control" placeholder="Кол-во">` : ""}
                                <div class="input-group-append">
                                <input type="button" class="btn btn-danger" style="margin: 0;" value="X" id="ing-block-del_${free_id}" onclick="deleteIngInput(this)"></div>
                            </div>`
        container.append(element);
    }
}

/**
 * Delete ingredient input on newRecipe page
 * @param {HTMLElement} element 
 */
function deleteIngInput(element){
    let id = element.id.split('_')[1];
    document.getElementById(`ing-block_${id}`).remove();
}

function checkPhotoState(){
    let pinnedPhoto = document.getElementById("new-recipe-image").files[0];

    let oldPhoto = document.getElementById("old-image");

    if (oldPhoto === null && pinnedPhoto !== undefined) return false;

    if (oldPhoto !== null && oldPhoto.hasAttribute("src")) return false;

    return true;
}

/**
 * 
 * @returns
 */
function generateRecipeDataForm(){

    let name = document.getElementById("new-recipe-name").value.trim();

    let short_desc = document.getElementById("short-description").value.trim();

    let tags_fields = document.querySelectorAll(".tag-field");
    let tags = Array.from(tags_fields).map(el => el.value.trim());

    let ings_names_fields = document.querySelectorAll(".ing-name");
    let ings_names = Array.from(ings_names_fields).map(el => el.value.trim().toLowerCase());

    let ings_amounts_fields = document.querySelectorAll(".ing-amount");
    let ings_amounts = Array.from(ings_amounts_fields).map(el => el.value.trim());

    let description = document.getElementById("description").value.trim();

    let photo = document.getElementById("new-recipe-image").files[0];

    if (tags_fields.length === 0 || ings_names_fields.length === 0 || ings_amounts_fields.length === 0){
        createToast("Рецепт должен содержать теги и ингредиенты", "red");
    }

    if (name === "" || short_desc === "" || description === "" || checkPhotoState() || tags.includes("") || ings_names.includes("") || ings_amounts.includes("")){
        createToast("Необходимо заполнить все поля", "red");
        return;
    }


    if (photo !== undefined){
        if (photo.size >= 1000000){
            createToast("Файл слишком большой", "red");
            return;
        }

        if (!(photo.type.split("/")[1] === "jpeg" || photo.type.split("/")[1] === "png")){
            createToast("Разрешены файлы формата jpg и png", "red");
            return;
        }
    }
   
    
    

    let ings = new Map();

    for (let i = 0; i < ings_names.length; i++){
        ings.set(ings_names[i], ings_amounts[i]);
    }

    let form = new FormData();

    let userName = "";

    if (document.getElementById("creator-name") !== null){
        userName = document.getElementById("creator-name").value;
    }

    let oldRecipeName = null;

    try{
        oldRecipeName = getRecipeName();
    } 
    catch (e){

    }

    form.append("name", name);
    form.append("shortDescription", short_desc);
    form.append("tags", JSON.stringify(tags));
    form.append("ingredients", JSON.stringify(Object.fromEntries(ings)));
    form.append("description", description);
    form.append("recipeImage", (photo !== undefined) ? photo : (new File([], "plug")));
    form.append("creatorName", (userName === "") ? getUsername() : userName);
    form.append("updatePhoto", (photo === undefined) ? false : true);
    form.append("recipeOldName", oldRecipeName);

    for (let el of form.entries()){
        console.log(el[0] + " - " + el[1]);
    }

    return form;
}

/**
 * Generate new form, which represented data and sent it to server
 */
function createRecipe(){
    let form = generateRecipeDataForm();
    if (form === undefined){
        return;
    }

    $.ajax({
        type: "post",
        url: "/createRecipe",
        contentType: false,
        processData: false,
        cache: false,
        data: form,

        success: function (response){
            if (response.status === "SUCCESS"){
                createToast("Рецепт успешно создан и отправлен на модерацию. Если он будет одобрен, то он появится на сайте.", "green", 4000);
            }
            else{
                createToast(response.result, "red");
            }
        },
        error: function (e){
            console.log(e)
        }
    });
}

/**
 * Confirm recipe data and mark it ready for usage
 * @param {Number} id 
 * @param {String} block_prefix 
 */
function commitRecipeById(id){
    $.ajax({
        type: "post",
        url: "/commitRecipeById",
        data: "recipeId=" + id,
        
        success: function (response){
            if (response.status === "SUCCESS"){
                createToast("Рецепт подтвержден. Теперь он будет отображаться в поиске.", "green");
                setTimeout(() => window.location.href = "/moderate?token=" + getToken(), 2000);
            }
            else{
                createToast(response.result, "red");
            }
        },
        error: function (e){
            console.log(e);
        }
    });
}

function commitRecipeByName(recipeName){
    $.ajax({
        type: "post",
        url: "/commitRecipeByName",
        data: "recipeName=" + recipeName,

        success: function (response){
            if (response.status === "SUCCESS"){
                createToast("Рецепт подтвержден. Теперь он будет отображаться в поиске.", "green");
                setTimeout(() => window.location.href = "/moderate?token=" + getToken(), 2000);   
            }
            else{
                createToast(response.result, "red");
            }
        },
        error: function (e){
            console.log(e);
        }
    });
}

function saveRecipeUpdates(){
    
    let form = generateRecipeDataForm();
    if (form === undefined){
        return;
    }

    $.ajax({
        type: "post",
        url: "/saveRecipeUpdates",
        contentType: false,
        processData: false,
        cache: false,
        data: form,

        success: function (response){
            if (response.status === "SUCCESS"){
                createToast("Данные рецепта успешно обновлены.", "green");
                setTimeout(() => window.location.href = "/moderate?token=" + getToken(), 2000);
                
            }
            else{
                createToast(response.result, "red");
            }
        },
        error: function (e){
            console.log(e);
        }
        
    });
}

/**
 * Delete recipe with id
 * @param {Number} recipeId 
 */
 function deleteRecipeById(recipeId, to="moderate"){
    $.ajax({
        type: "post",
        url: "/deleteRecipeById",
        data: "recipeId=" + recipeId,
        success: function (response){
            if (response.status == "SUCCESS"){
                createToast("Рецепт успешно удален", "green");
                setTimeout(() => window.location.href = `/${to}?token=` + getToken(), 2000);
            }
            else{
                createToast(response.result, "red");
            }
        },
        error: function (e){
            console.log(e);
        }
    });
}

function deleteRecipeByName(recipeName){
    $.ajax({
        type: "post",
        url: "/deleteRecipeByName",
        data: "recipeName=" + recipeName,

        success: function (response){
            if (response.status == "SUCCESS"){
                createToast("Рецепт успешно удален", "green");
                setTimeout(() => window.location.href = "/moderate?token=" + getToken(), 2000);
            }
            else{
                createToast(response.result, "red");
            }
        },
        error: function (e){
            console.log(e);
        }
    });
}

/**
 * Create an notification in top left corner of screen
 * @param {String} message 
 * @param {String} color 
 * @param {Number} delay 
 */
function createToast(message, color="yellow", delay=2000) {
    let toast = document.createElement("div");

    let number = document.querySelectorAll(".toast-alert").length;

    toast.className = "toast-alert";
    toast.id = "toast_" + number;
    toast.style = `width: max-content; height: max-content; font-size: 15pt; position: fixed; top: 30px; left: 30px; z-index: 1050; background-color: ${color}; padding: 20px; opacity: 0.7`;
    toast.innerHTML = message;
    document.querySelector("body").append(toast);
    setTimeout(() => {
        document.getElementById(toast.id).remove();
    }, delay);
}

function banUser(username=""){
    if (username === ""){
        username = getProfileUsername();
    }

    $.ajax({
        type: "post",
        url: "/banUser",
        data: "username=" + username,

        success: function (response) {
            if (response.status === "SUCCESS"){
                createToast("Пользователь успешно забанен", "yellow");
                setTimeout(() => location.reload(), 2000);
            }
            else{
                createToast("Ошибка бана пользователя", "red");
            }
        },
        error: function (e){
            console.log(e);
        }
    });
}

function unbanUser(username=""){
    if (username === ""){
        username = getProfileUsername();
    }

    $.ajax({
        type: "post",
        url: "/unbanUser",
        data: "username=" + username,

        success: function (response) {
            if (response.status === "SUCCESS"){
                createToast("Пользователь успешно разбанен");
                setTimeout(() => location.reload(), 2000);
            }
            else{
                createToast("Ошибка разбана пользователя", "red");
            }
        }
    });
}

function loadUsers(){
    let container = document.getElementById("content-table");

    let sortBy = document.getElementById("sortBy").value;

    let filters = new Map();
    filters.set("username", document.getElementById("username-filter").value.trim());

    filters.set("email", document.getElementById("email-filter").value.trim());

    let jsonFilters = JSON.stringify(Object.fromEntries(filters));

    $.ajax({
        type: "post",
        url: "/loadUsers",
        data: "sortBy=" + sortBy + "&filters=" + jsonFilters,

        success : function (response){
            if (response.status === "SUCCESS"){
                container.innerHTML = "";

                let users = response.result;

                container.innerHTML += `<tr>
                                            <td>Имя пользователя</td>
                                            <td>Почтовый ящик</td>
                                            <td>Номер телефона</td>
                                            <td>Пол</td>
                                            <td>Возраст</td>
                                            <td>Действия</td>
                                        </tr>`
                
                for (let i = 0; i < users.length; i++){
                    container.innerHTML += `<tr>
                                                <td><a href="/user?token=${getToken()}&username=${users[i].username}">${users[i].username}</a></td>
                                                <td>${users[i].email}</td>
                                                <td>${users[i].phoneNumber}</td>
                                                <td>${users[i].gender}</td>
                                                <td>${users[i].age}</td>
                                                <td>
                                                    <a href="/user?token=${getToken()}&username=${users[i].username}"><div
                                                    class="btn btn-primary">Страница пользователя</div></a>
                                                    ${(users[i].banned) ? `<div style="cursor: pointer;" class="btn btn-outline-warning" onclick="unbanUser('${users[i].username}')">Разбанить</div>` : `<div style="cursor: pointer;" class="btn btn-warning" onclick="banUser('${users[i].username}')">Забанить</div>`}
                                                </td>
                                            </tr>`
                }
            }
        },
        error: function (e){
            console.log(e);
        }
    });
}

function searchByIngredients(){
    let inputs = document.querySelectorAll(".ing-name");
    let container = document.getElementById("content-container");
    let ingredients = Array.from(inputs).map(el => el.value.trim().toLowerCase());

    $.ajax({
        type: "post",
        url: "/searchByIngredients",
        data: "ingredients=" + JSON.stringify(ingredients) + "&username=" + getUsername(),

        success: function (response) {
            loadOnGrid(response, container);
        },
        error: function (e){
            console.log(e);
        }
    });
}

function deleteComment(id){
    $.ajax({
        type: "post",
        url: "/deleteComment",
        data: "commentId=" + id,

        success: function (response) {
            if (response.status === "SUCCESS"){
                createToast("Комментарий удален", "green", 1000);
                document.getElementById(`comment_${id}`).remove();
            }
            else{
                createToast(response.result, "red");
            }
        },
        error: function (e) {
            console.log(e);
        }
    });
}

function loadComments(){
    let container = document.getElementById("comments-container");

    $.ajax({
        type: "post",
        url: "/loadComments",
        data: "recipeName=" + getRecipeName(),

        success: function (response){
            container.innerHTML = "";

            if (response.status === "SUCCESS"){
                let comments = response.result;

                for (let i = 0; i < comments.length; i++){
                    container.innerHTML += `
                                            <div class="comment-block" id="comment_${comments[i].id}">
                                                <div class="comment-header">
                                                    <div class="comment-id">№${comments[i].id}</div>
                                                    <a href="/user?token=${getToken()}&username=${comments[i].userName}"><div class="comment-username">${comments[i].userName}</div></a>
                                                    ${(isAdmin()) ? `<div class="btn btn-danger" onclick="deleteComment(${comments[i].id})">Удалить комментарий</div>` : ""}
                                                </div>
                                                <div class="comment-text" id="comment_text_${comments[i].id}">${comments[i].text}</div>
                                            </div>
                                            `;
                }
            }
            else{
                container.innerHTML = "Не удалось загрузить комментарии";
            }


        },
        error: function (e){
            console.log(e);
        }
    });
}
function addComment(){
    let text = document.getElementById("new-comment-text").value.trim();

    if (text === ""){
        createToast("Комментарий не может быть пустым", "red", 1000);
        return;
    }

    $.ajax({
        type: "post",
        url: "/addComment",
        data: "commentText=" + text + "&username=" + getUsername() + "&recipeName=" + getRecipeName(),

        success: function (response) {
            if (response.status === "SUCCESS"){
                loadComments();
            }
            else{
                createToast(response.result, "red", 1000);
            }
        }
    });
}