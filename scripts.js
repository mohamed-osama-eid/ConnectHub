// variables
let postsContainer = document.getElementById('posts-container');
let passwordToggleBtns = document.querySelectorAll('.toggle-password') ;
let loginPasswordInput = document.getElementById('login-password-input');
let registerPasswordInput = document.getElementById('register-password-input');
let usernameInput = document.getElementById('username-login-input');
let loginInModal = document.getElementById('loginInModal');
let registerModal = document.getElementById('registerModal');
let loggedInDiv = document.getElementById('logged-in-div');
let loggedOutDiv = document.getElementById('logged-out-div');
let alertContainer = document.getElementById('alert-container')
let togglePasswordState = false;

const baseUrl = 'https://tarmeezacademy.com/api/v1';

// eventslisteneres
passwordToggleBtns.forEach((passwordBtn)=>{
    passwordBtn.addEventListener('click',()=>{
        const targetId = passwordBtn.dataset.target;
        console.log(targetId)
        const passwordInput = document.getElementById(targetId);
        if(togglePasswordState == false){
            togglePasswordState = true;
            passwordBtn.innerHTML = `
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                                        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                                    </svg>
                                    `
            passwordInput.type = 'text';
        }
        else{
            togglePasswordState = false;
            passwordBtn.innerHTML = `
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
                                        <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/>
                                        <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/>
                                        <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z"/>
                                    </svg>
                                    `
            passwordInput.type = 'password';
        }
    })
})

// functions
function authFlow(faildPId , passwordInputId , modalInstance , message , jsonResponse){
    document.getElementById(faildPId).style.display = 'none';
    localStorage.setItem('token' , jsonResponse.token);
    localStorage.setItem('user' , JSON.stringify({...jsonResponse.user , 'password': document.getElementById(passwordInputId).value}));
    let modal = bootstrap.Modal.getInstance(modalInstance);
    if(!modal){
        modal = new bootstrap.Modal(modalInstance);
    }
    modal.hide();
    UI();
    alertContainer.innerHTML = `
                                <div class="alert alert-success d-flex align-items-center" role="alert" id = 'login-alert'>
                                    <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Success:"><use xlink:href="#check-circle-fill"/></svg>
                                    <div>
                                        ${message}
                                    </div>
                                    <div class="d-flex justify-content-end">
                                        <button style="border:none; background-color: transparent; cursor: pointer;" onclick="hideAlert()">X</button>
                                    </div>
                                </div>
                                ` 
}

function UI(){
    const token = localStorage.getItem('token');
    if (token) // user loggin
    {
        loggedInDiv.style.setProperty('display' , 'none' ,'important');
        loggedOutDiv.style.setProperty('display' , 'flex' ,'important');
    }
    else{ // gest user
        loggedInDiv.style.setProperty('display' , 'flex' ,'important');
        loggedOutDiv.style.setProperty('display' , 'none' ,'important');
    }
}
async function getPosts(){
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    try{
        const response = await fetch(`${baseUrl}/posts?limit=2`, requestOptions);
        const posts = await response.json();
        postsContainer,innerHTML = '';
        for (post of posts.data){
            let tagsHtml = ''
            for (let tag of post.tags)
                tagsHtml += `<span class = 'tag rounded-pill'>${tag.name}</span>`
            const postContent = `
                            <div class="d-flex justify-content-center">
                                <div class="card col-10 shadow">
                                    <div class="card-header" style="background-color:#0E2148; color:#E3D095">
                                        <img class = 'rounded-circle shadow-sm border' src="${post.author.profile_image}" alt="profile image" style="width:40px;height:40px" loading="lazy">
                                        <span class="fw-bold">@${post.author.username}</span>
                                    </div>
                                    <div class="card-body">
                                        <img class="img-fluid" src="${post.image}" alt="post image" loading="lazy">
                                        <h6 class="text-secondary">${post.created_at}</h6>
                                        <h5>${post.title != null ? post.title : 'لا يوجد عنوان لهذا المنشور'}</h5>
                                        <p>
                                            ${post.body}
                                        </p>
                                        <div class = 'tags'>
                                            ${tagsHtml}
                                        </div>
                                    </div>
                                    <div class="card-footer d-flex align-items-center fs-4" style="border-top: 2px solid #0E2148; background-color: #E3D095; color: #0E2148;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-chat mx-2" viewBox="0 0 16 16">
                                            <path d="M2.678 11.894a1 1 0 0 1 .287.801 11 11 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8 8 0 0 0 8 14c3.996 0 7-2.807 7-6s-3.004-6-7-6-7 2.808-7 6c0 1.468.617 2.83 1.678 3.894m-.493 3.905a22 22 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a10 10 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105"/>
                                        </svg>
                                        <span>(${post.comments_count}) Comments</span>
                                    </div>
                                </div>
                            </div>
                        `
            postsContainer.innerHTML += postContent;
        }
    }
    catch (error){
        alert(error.message)
    }
    finally{
        console.log('all posts fetched successfully')
        document.getElementById('posts-spinner-loadding').style.display = 'none';
    }
    
}

async function loginUser() {
    //while waitting to be logged in disable the login button to prevent multible requests
    btnsWaiting('login-form-btn' , 'login-spinner-loadding', true);
    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json"); 

    const raw = JSON.stringify({
        username: usernameInput.value,
        password: loginPasswordInput.value
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };
    try{
        const response = await fetch(`${baseUrl}/login`, requestOptions);
        const json = await response.json();
        if (json.token)
        {
            console.log('user login successfully')
            authFlow('lgoin-faild' , 'login-password-input' , loginInModal , 'User logged in successfully' , json);
            btnsWaiting('login-form-btn' , 'login-spinner-loadding', false);
        }
        else
        {
            btnsWaiting('login-form-btn' , 'login-spinner-loadding', false);
            document.getElementById('lgoin-faild').style.display = 'block';
            document.getElementById('lgoin-faild').innerHTML = json.message;
        }
    }
    catch (error){
        alert(error.message);
    }
}

async function registerUser(){
    btnsWaiting('register-form-btn' , 'register-spinner-loadding', true);
    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");

    // const imageValue = document.getElementById('upload-profile-img').value;
    // const imageSplit = imageValue.split("\\");
    // const imageName = imageSplit[imageSplit.length-1];

    const raw = JSON.stringify({
        username: document.getElementById('username-register-input').value,
        password: document.getElementById('register-password-input').value,
        name: document.getElementById('register-name-input').value,
        email: document.getElementById('email-register-input').value,
        // image: imageName,
    });
        
        const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    try{
        const response = await fetch(`${baseUrl}/register`, requestOptions);
        const json = await response.json();
        console.log(json)
        if(json.token){
            console.log('user register successfully');
            authFlow('register-faild' , 'register-password-input' , registerModal , 'User logged in successfully' , json);
            btnsWaiting('register-form-btn' , 'register-spinner-loadding', false);
        }else{
            btnsWaiting('register-form-btn' , 'register-spinner-loadding', false);
            document.getElementById('register-faild').style.display = 'block';
            document.getElementById('register-faild').innerHTML = json.message;
        }
    }
    catch (error){  
        alert(error.message);
    }
}

async function logOutUser(){
    btnsWaiting('logout-btn' , 'logot-spinner-loadding' , true);
    const userInfo = JSON.parse(localStorage.getItem('user'));
    // logout user request
    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json"); 

    const raw = JSON.stringify({
        username: userInfo.username,
        password: userInfo.password
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };
    try{
        const response = await fetch(`${baseUrl}/logout`, requestOptions);
        const json = await response.json();
        
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        
        UI();
        alertContainer.innerHTML = `
                                    <div class="alert alert-danger d-flex align-items-center" role="alert" id = 'logout-alert'>
                                        <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill"/></svg>
                                        <div>
                                        User loggd out successfully
                                        </div>
                                        <div class="d-flex justify-content-end">
                                            <button style="border:none; background-color: transparent; cursor: pointer;" onclick="hideAlert()">X</button>
                                        </div>
                                    </div>
                                ` 
        btnsWaiting('logout-btn' , 'logot-spinner-loadding' , false);

    }
    catch (error){
        alert(error.message);
    }
}

// Bootstrap validation
(() => {
    "use strict";

    const lofinForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    lofinForm.addEventListener("submit", async (event) => {
        if (!lofinForm.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault(); // prevent default form submit
            await loginUser();      // call your API
        }
        lofinForm.classList.add("was-validated"); // add Bootstrap styles
    });

    registerForm.addEventListener("submit", async (event) => {
        if (!registerForm.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault(); // prevent default form submit
            await registerUser();      // call your API
        }
        registerForm.classList.add("was-validated"); // add Bootstrap styles
    });
})();

function hideAlert(){
    alertContainer.innerHTML = ''
}

function btnsWaiting(buttonId , spinnerId , showSpinner){
    const button = document.getElementById(buttonId);
    const spinner = document.getElementById(spinnerId);
    if (showSpinner == true){
        button.disabled = true;
        spinner.style.setProperty('display' , 'block' , 'important');
    }else{
        button.disabled = false;
        spinner.style.setProperty('display' , 'none' , 'important');
    }
}

// project concept
// 1- show all posts
// 2- check if the user is looged in or out and bassed on that update the ui
getPosts();
UI();