function addHTMLError(element_id, error_string, input_field=null){
    if (document.getElementById("global-error") !== null){
        document.getElementById("global-error").remove();
    }

    if (input_field !== null) input_field.style.backgroundColor = "#ffc1c1";

    if (document.getElementById(element_id) !== null) {
        document.getElementById(element_id).innerHTML = error_string;
        return;
    }

    let element = document.createElement("div");
    // element.tagName = "div";
    element.classList.add("alert", "alert-danger", "custom-error");
    element.id = element_id;
    element.innerHTML = error_string;

    error_container.append(element);

}

function deleteHTMLError(element_id, input_field){

    input_field.style.backgroundColor = "#e9ecef";
    let element = document.getElementById(element_id);
    if (element !== null){
        document.getElementById(element_id).remove();
    }
}

function deleteAllHTMLErrors(){
    document.querySelectorAll("#error-container>.custom-error").forEach(el => el.remove());
}

function checkEmptyFields(){
    let fields = document.querySelectorAll("#form>input");

    for (let field of fields){
        if (field.value === "") return true;
    }
    return false;
}

let USERNAME = "^[A-Za-z][A-Za-z0-9_-]{2,19}$";
let EMAIL = "^[A-Za-z][A-Za-z0-9_]{2,50}[@][A-Za-z]{1,20}[.][A-Za-z]{1,10}$";
let PHONENUMBER = "^[+][0-9]{11}$";
let PASSWORD = "^[A-Za-z0-9_-]{8,64}$";

let error_container = document.getElementById("error-container");
let username_input = document.getElementById("username");
let email_input = document.getElementById("email");
let phone_number_input = document.getElementById("phoneNumber");
let password_input = document.getElementById("password");
let age_input = document.getElementById("age");
let password_reply_input = document.getElementById("password_reply");
let submit_button = document.getElementById("submit");


username_input.addEventListener("input", (ev) => {
    if (ev.target.value.match(USERNAME) !== null || ev.target.value === "") {
        deleteHTMLError("username-error", ev.target);
    }
    else {
        addHTMLError("username-error", `Неверный формат имени пользователя ${ev.target.value}. Имя пользователя может начинаться только на A-Z или a-z, " +
            "допустимые символы A-Z a-z 0-9 _ -, длина 3-20 символов`, ev.target);
    }
});

email_input.addEventListener("input", (ev) => {
    if (ev.target.value.match(EMAIL) !== null || ev.target.value === "") {
        deleteHTMLError("email-error", ev.target);
    }
    else {
        addHTMLError("email-error", `Неверный формат Email ${ev.target.value}`, ev.target);
    }
});

phone_number_input.addEventListener("input", (ev) => {
    if (ev.target.value.match(PHONENUMBER) !== null || ev.target.value === "") {
        deleteHTMLError("phone-number-error", ev.target);
    }
    else {
        addHTMLError("phone-number-error", `Неверный формат номера телефона ${ev.target.value}`, ev.target);
    }
});

password_input.addEventListener("input", (ev) => {
    if (ev.target.value.match(PASSWORD) !== null || ev.target.value === "") {
        deleteHTMLError("password-error", ev.target);
    }
    else {
        addHTMLError("password-error", `Неверный формат пароля ${ev.target.value}. Пароль должен содержать от 8 до 64 символов и содержать только A-Z a-z 0-9 _ -`, ev.target);
    }
});

age_input.addEventListener("input", (ev) =>{
    if ((Number(ev.target.value) <= 100 && Number(ev.target.value) >= 18) || ev.target.value === "" || ev.target.value === "-") {
        deleteHTMLError("age-error", ev.target);
    }
    else {
        addHTMLError("age-error", `Возраст ${ev.target.value} должен быть от 18 до 100`, ev.target);
    }
});

password_reply_input.addEventListener("input", (ev) => {
    if (ev.target.value === password_input.value || ev.target.value === "") {
        deleteHTMLError("password-reply-error", ev.target);
    }
    else {
        addHTMLError("password-reply-error", "Пароли не совпадают", ev.target);
    }
});

submit_button.addEventListener("click", (ev) => {
    let errors = document.querySelectorAll("#username-error, #email-error, #phone-number-error, #password-error, #age-error, #password-reply-error");
    if (errors.length !== 0 || checkEmptyFields()){
        addHTMLError("global-error", "Присутствуют ошибки формы или не все элементы заполнены");
        ev.preventDefault()
    }
    else document.getElementById("form").submit();
});