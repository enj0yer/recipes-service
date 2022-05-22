

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
    document.getElementById("main-link").setAttribute("href", `/main?token=${getToken()}`);
}

if (document.getElementById("add-recipe-link") !== null){
    document.getElementById("add-recipe-link").setAttribute("href", `/main/newRecipe?token=${getToken()}`)
}

if (document.getElementById("liked-link") !== null){
    document.getElementById("liked-link").setAttribute("href", `/main/liked?token=${getToken()}`)
}

if (document.getElementById("best-link") !== null){
    document.getElementById("best-link").setAttribute("href", `/main/best?token=${getToken()}`);
}

if (document.getElementById("moderate-link") !== null){
    document.getElementById("moderate-link").setAttribute("href", `/main/moderate?token=${getToken()}`);
}

if (document.getElementById("users-link") !== null){
    document.getElementById("users-link").setAttribute("href", `/main/users?token=${getToken()}`);
}




///////////////////////////////////////////////////////////////////////////////

let form = document.getElementById("search-form");

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
            container.innerHTML = "";
            if (response.status === "SUCCESS"){
                for (let i = 0; i < response.result.length; i++){
                    let element = document.createElement("div");
                    element.classList.add("recipe-card");
                    element.id = `card_${i}`;
                    let data = JSON.parse(response.result[i].data);
                    element.innerHTML = 
                    `<a href="#">
                        <img class="recipe-photo img-rounded" src="/img/${data.imageName}">
                        <div class="recipe-name" id="recipe_name_${i}">${response.result[i].name}</div>
                        <br>
                        <div class="recipe-short-description">${data.previewText}
                        </div>
                        ${data.recipe}
                        ${data.description}
                    </a>
                    <br>
                    <div class="recipe-likes-container" onclick="like(this)" id="recipe_likes_container_${i}">
                        <div class="recipe-likes-counter" id="recipe_likes_counter_${i}">${response.result[i].likes}</div>
                        ${(response.result[i].liked)
                            ? `<div class="recipe-star-switcher" id="recipe_star_switcher_${i}" active><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 13 19">
                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                            </svg></div>` 
                            : `<div class="recipe-star-switcher" id="recipe_star_switcher_${i}"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-star" viewBox="0 0 13 19">
                            <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
                            </svg></div>`}</div></div>
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
        },
        error: function(e) {
            console.log(e);
        }
    })
    }
});


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

    let container = document.getElementById("content-table");
    container.innerHTML = "";

    $.ajax({
        type: "post",
        url: "/best",
        data: "sort=" + sortBy,
        success: function (response){
            if (response.status == "SUCCESS"){
                let recipes = JSON.parse(response.result);
                
                container.innerHTML += "<tr><td>Название</td><td>Ник автора</td><td>Описание</td><td>Кол-во просмотров</td><td>Кол-во лайков</td><td>Кол-во комментариев</td><td>Действия</td></tr>"
                
                for(let i = 0; i < recipes.length; i++){
                    container.innerHTML += `<tr id="row_${recipes[i].id}"><td>${recipes[i].name}</td><td>${recipes[i].creatorName}</td><td>${JSON.parse(recipes[i].data).description}</td><td>${recipes[i].views}</td><td>${recipes[i].likes}</td><td>Кол-во комментариев</td><td><a href="/main/recipe?name=${recipes[i].name}"><div class="btn btn-primary"></div></a>${(isAdmin()) ? '<div class="btn btn-danger" onclick="' + deleteRecipe(recipes[i].id) + '">Удалить рецепт</div>' : ""}</td></tr>`
                }
            }
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
