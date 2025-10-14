//===================================================================================== variables
const CONFIG ={
    baseUrl : 'https://tarmeezacademy.com/api/v1' ,
    togglePasswordState : false ,
    safeHTMLPolicy : window.trustedTypes?.createPolicy('default', {
        createHTML: (string) => DOMPurify.sanitize(string)
    })
};

const DOMRefs = {
    loggedInDiv: document.getElementById('logged-in-div'),
    loggedOutDiv: document.getElementById('logged-out-div'),
    userNameSpan: document.getElementById('user-username'),
    userProfileImg: document.getElementById('user-profile-img'),
    addPostBtn: document.getElementById('add-new-post'),
    alertContainer: document.getElementById('alert-container'),
    usernameInput: document.getElementById('username-login-input'),
    loginPasswordInput: document.getElementById('login-password-input'),
    loginInModal: document.getElementById('loginInModal'),
    passwordToggleBtns :document.querySelectorAll(".toggle-password"),
    postsContainer : document.getElementById('posts-container')? document.getElementById('posts-container'): document.getElementById('post-container'),
    overlay : document.getElementById("overlay"),
    loadingSpinner : document.getElementById('loading'),
    profileSection : document.getElementById('profile-section')
};

// ==================================================================================== eventlistener
DOMRefs.passwordToggleBtns.forEach((passwordBtn) => {
    passwordBtn.addEventListener("click", () => {
        const targetId = passwordBtn.dataset.target;
        const passwordInput = document.getElementById(targetId);
        if (CONFIG.togglePasswordState == false) {
            CONFIG.togglePasswordState = true;
            passwordBtn.innerHTML = `
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                                                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                                                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                                            </svg>
                                            `;
            passwordInput.type = "text";
        } else {
            CONFIG.togglePasswordState = false;
            passwordBtn.innerHTML = `
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
                                                <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/>
                                                <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/>
                                                <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z"/>
                                            </svg>
                                            `;
            passwordInput.type = "password";
        }
    });
});

DOMRefs.postsContainer?.addEventListener('click' ,(e)=>{
    const deleteBtn = e.target.closest('.delete-btn');
    if(deleteBtn)
    {
        // console.log(deleteBtn)
        const id = deleteBtn.dataset.id;
        showDeleteModal(id);
        return;
    }

    const editBtn = e.target.closest('.edit-btn');
    if(editBtn)
    {
        // console.log(editBtn)
        const id = editBtn.dataset.id;
        showPostModal("edit" , id);
        return;
    }

    const dropDownBtn = e.target.closest('.dropdown-btn');
    if(dropDownBtn)
    {
        // console.log(dropDownBtn)
        const id = dropDownBtn.dataset.id;
        toggleDropDownMenu(id);
        return;
    }

    const showUserProfilePage = e.target.closest('.user-profile-data');
    if(showUserProfilePage)
    {
        // console.log(showUserProfilePage)
        const id = showUserProfilePage.dataset.id;
        goToUserProfile(id);
        return;
    }

    const postBodyClicked = e.target.closest('.post-info');
    if(postBodyClicked)
    {
        // console.log(postBodyClicked)
        const id = postBodyClicked.dataset.id;
        handelPostClicked(id);
        return;
    }
})

DOMRefs.overlay?.addEventListener("click", closeAllDropdowns);

// functions
//====================================================================================== UI
function setUpUI(){ //update the UI based on user is logged in or not
    const token = localStorage.getItem('token');
    if (token) // user login
    {
        const userObj = getCurrentUser();
        DOMRefs.loggedInDiv.style.setProperty('display' , 'none' ,'important');
        DOMRefs.loggedOutDiv.style.setProperty('display' , 'flex' ,'important');
        DOMRefs.userNameSpan.textContent = userObj.username;
        DOMRefs.userProfileImg.src = setDefaultImg({userImg: userObj.profile_image , defaultImage : './assets/images/500.png'});
        DOMRefs.profileSection.style.visibility = 'visible';
        if(DOMRefs.addPostBtn)
            DOMRefs.addPostBtn.classList.remove('d-none');
    }
    else{ // gest user
        DOMRefs.loggedInDiv.style.setProperty('display' , 'flex' ,'important');
        DOMRefs.loggedOutDiv.style.setProperty('display' , 'none' ,'important');
        DOMRefs.profileSection.style.visibility = 'hidden';
        if(DOMRefs.addPostBtn)
            DOMRefs.addPostBtn.classList.add('d-none');
    }
}

function showAlert({message , alertType}){ // show alerts to user
    DOMRefs.alertContainer.innerHTML = `
                                <div class="alert alert-${alertType} d-flex align-items-center" role="alert" id = 'login-alert'>
                                    <div>
                                        ${message}
                                    </div>
                                    <div class="d-flex justify-content-end">
                                        <button style="border:none; background-color: transparent; cursor: pointer;" id = 'close-alert-btn'>X</button>
                                    </div>
                                </div>
                                ` 
}

function hideAlert(){ //hide alerts
    DOMRefs.alertContainer.addEventListener('click',(e)=>{
        const closeBtn = e.target.closest('#close-alert-btn');
        if(closeBtn){
            DOMRefs.alertContainer.innerHTML = ''
        }
    })
    setTimeout(()=>{
        DOMRefs.alertContainer.innerHTML = '';
    },5000)
}

function btnsWaiting({buttonId , spinnerId , showSpinner}){
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

function hideModal({modalInstance}){
    let modal = bootstrap.Modal.getInstance(modalInstance);
    if(!modal){
        modal = new bootstrap.Modal(modalInstance);
    }
    modal.hide();
}

function showCurrentUserProfile(){
    const currentUser = getCurrentUser() ;
    window.location.href = `profilePage.html?userId=${currentUser.id}`;
}

function formValidation({formId , formFunction}){
    const form = document.getElementById(formId);
    form.addEventListener("submit", async (event) => {
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault(); // prevent default form submit
            await formFunction();      // call your API
        }
        form.classList.add("was-validated"); // add Bootstrap styles
    });
}

function getWindowsParams({paramName}){
    let params = new URLSearchParams(document.location.search);
    return params.get(paramName);
}

function toggleLoadingSpinner(show=true){
    if(show)
        DOMRefs.loadingSpinner.style.setProperty('display' , 'flex' , 'important');
    else
        DOMRefs.loadingSpinner.style.setProperty('display' , 'none' , 'important');

}
//===================================================================================== post modal function handel 
function setDefaultImg({userImg , defaultImage}){
    return Object.keys(userImg).length === 0 ? defaultImage : userImg;
}

function insertNewPost({direction , post , currentUser , container , writeCommentHTML = null , commentsHTML = null }){
    let dropDownMenuContent = ``;
    let tagsHtml = "";
    let currentUserImg = setDefaultImg({userImg: currentUser.profile_image , defaultImage : '/assets/images/500.png'});

    for (let tag of post.tags)
        tagsHtml += `<span class = 'tag'>${tag.name}</span>`;
    
    if (currentUser && post.author.id == currentUser.id)
                dropDownMenuContent = `
                                        <div class="dropdown-container">
                                            <button class="dropdown-btn" aria-label="Menu" data-id = '${post.id}'>
                                                <svg id = 'horizontal-dots' xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                                                    <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                                                </svg>
                                            </button>
                                            <div class = 'dropdown-menu' id="dropdown-menu-${post.id}" >
                                                <ul>
                                                    <li data-id = '${post.id}' class = 'd-flex align-items-center gap-2 text-dark edit-btn'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                                                        </svg>
                                                        Edit
                                                    </li>
                                                    <li data-id = '${post.id}' class = 'text-danger d-flex align-items-center gap-2 delete-btn'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                                        </svg>
                                                        Delete
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        `;
    
    let postAuthorImage = setDefaultImg({userImg : post.author.profile_image , defaultImage : '/assets/images/500.png'});
    let content = `
                    <div class="d-flex justify-content-center" id = '${post.id}'>
                        <div class="card col-10 shadow post-card p-4" style="   background-color: var(--main-bg-secondary-color); 
                                                                                color: var(--color-primary-text)">
                            <div class="card-body">
                                <!-- author information -->
                                <div class="author-info-container">

                                    <span class = 'user-profile-data' style='cursor:pointer;' data-id = '${post.author.id}'>
                                        <!-- author image -->
                                        <div class="image-container" >
                                            <img src="${postAuthorImage}" alt="">
                                        </div>
                                        <!--# author image #-->
                                    
                                        <!-- author name and username -->
                                        <div class="user-info">
                                            <p class="author-username">@${post.author.username}</p>
                                            <b class="author-name">${post.author.name}</b>
                                            <span class="post-creation-time">. ${post.created_at}</span>
                                        </div>
                                        <!--# author name and username #-->
                                    </span>
                                    
                                    <!-- dropdown menu -->
                                    ${dropDownMenuContent}
                                    <!--# dropdown menu #-->
                                </div>
                                <!--# author information #-->

                                <!-- post info -->
                                <div class="post-info my-3" data-id = '${post.id}' style='cursor:pointer;'>
                                    <!-- post title -->
                                    <p style="
                                        font-size: 40px;
                                        font-weight: 800;
                                        " id = 'post-title-${post.id}'>
                                        ${post.title}
                                    </p>
                                    <!--# post title #-->

                                    <!-- post body -->
                                    <p id = 'post-body-${post.id}'>
                                        ${post.body}
                                    </p>
                                    <!--# post body #-->

                                    <!-- post image -->
                                    <div class="post-img">
                                        <img  src="${setDefaultImg({userImg:post.image , defaultImage : '/assets/images/empty_post_img.jpg'})}" alt="">
                                    </div>
                                    <!--# post image #-->

                                    <div class="comments-number d-flex align-items-center mt-2">
                                        <button type="button" class="btn bg-transparent border-0 comments-btn">
                                            <span class="icon-wrapper position-relative ">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor"
                                                    class="bi bi-chat-dots text-white " viewBox="0 0 16 16">
                                                    <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
                                                    <path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9 9 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.4 10.4 0 0 1-.524 2.318l-.003.011a11 11 0 0 1-.244.637c-.079.186.074.394.273.362a22 22 0 0 0 .693-.125m.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6-3.004 6-7 6a8 8 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a11 11 0 0 0 .398-2"/>
                                                </svg>
                                                <span class="badge rounded-pill position-absolute top-0 start-100 translate-middle post-comments-number">
                                                    ${post.comments_count}
                                                </span>
                                            </span>
                                        </button>

                                        <!-- post tags -->
                                        <div class = 'tags' style="margin-left: auto;">
                                            ${tagsHtml}
                                        </div>                                                                              
                                        <!--# post tags #-->
                                    </div>

                                </div>
                                <!--# post info #-->

                                ${  writeCommentHTML?
                                    '<hr>'+ writeCommentHTML:
                                    ''
                                }
                                <div id = 'users-comments'>
                                    ${commentsHTML ?
                                        commentsHTML:
                                        ''
                                    }
                                </div>
                                
                            </div>
                        </div>
                    </div>
                    `;
                    
    
    let sanitizedContent = sanitizeHTMLContent(content)
    if (direction == 'toBegin')
        container.insertAdjacentHTML('afterbegin', sanitizedContent);
    else // beforeEnd
        container.insertAdjacentHTML('beforeend', sanitizedContent);
}

async function handelPostRequest() { // responsible for the creation and updating the post 
    const hiddenInputValue = document.getElementById('isNew').value;
    const isNew = hiddenInputValue == null || hiddenInputValue == ''; // create new post
    const token = localStorage.getItem("token");
    const modalInstance = document.getElementById("postModal");
    const postTitle = document.getElementById("post-title-input").value;
    const postBody = document.getElementById("post-body-input").value;
    const postImage = document.getElementById("post-image-input").files[0];
    const currentUser = getCurrentUser();

    let fullURL = ``
    let requestOptions = {
            headers: {
                'Accept': "application/json",
                'Authorization': `Bearer ${token}`,
            },
        };
    let message = ''

    btnsWaiting({
            buttonId: "post-form-btn",
            spinnerId: "form-post-spinner-loading",
            showSpinner: true,
        });
    // create new post or edit an existing post
    if (isNew){ // create
        let formData = new FormData();
        formData.append("title", postTitle);
        formData.append("body", postBody);
        if (postImage) formData.append("image", postImage);

        requestOptions.method = 'POST';
        requestOptions.body = formData ;

        fullURL = `${baseUrl}/posts`;
        message = 'Post has been created Successfully';
    }
    else{ //edit
        body = JSON.stringify({
            'body': postBody ,
            'title' :postTitle 
        })
        requestOptions.method = 'PUT';
        requestOptions.body = body ;
        requestOptions.headers['Content-Type'] = 'application/json';
        fullURL = `${baseUrl}/posts/${hiddenInputValue}`;
        message = 'Post has been edited Successfully';
    }

    try {
        const response = await fetch(fullURL, requestOptions);
        const json = await response.json(); // get raw text first

        hideModal({ modalInstance });
        showAlert({
            message: message,
            alertType: "success",
        });
        if(isNew)
            insertNewPost({direction: 'toBegin' ,post: json.data ,currentUser: currentUser ,container: DOMRefs.postsContainer}); // only if the post is new
        else // edit 
            setNewPostData(json.data)
    } catch (error) {
        console.log(error.message);
        showAlert({ message: error.message, alertType: "danger" });
    } finally {
        btnsWaiting({
            buttonId: "post-form-btn",
            spinnerId: "form-post-spinner-loading",
            showSpinner: false,
        });
        hideAlert();
        closeAllDropdowns();
    }
}

function removeChildNode(parent , childId){
    // const parent = document.getElementById(parentId);
    const child = document.getElementById(childId);
    const removedNode = parent.removeChild(child);
}

async function deletePost() {
    toggleLoadingSpinner(show=true);
    const token = localStorage.getItem('token');
    const requestOptions = {
        headers :{
            'Authorization' : `Bearer ${token}`,
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
        },
        method : 'DELETE'
    }
    try {
        const response = await fetch(`${baseUrl}/posts/${SelectedDeletedPostId}`, requestOptions);
        const json = await response.json();
        
        if(json.data){
            showAlert({message: 'Post has been deleted successfully' , alertType: 'success'});
            let modal = bootstrap.Modal.getInstance(document.getElementById('deletePostModal'));
            if(!modal){
                modal = new bootstrap.Modal(document.getElementById('deletePostModal'));
            }
            modal.hide();
            removeChildNode(DOMRefs.postsContainer, SelectedDeletedPostId)
        }
    }
    catch (error){
        console.error(error.message);
        showAlert({message: error.message , alertType:'danger'});
    }
    finally{
        hideAlert();
        toggleLoadingSpinner(show=false);
        closeAllDropdowns();
    }
}

function setNewPostData(newPostData){
    //get the required fields to be updated
    const postTitle = document.getElementById(`post-title-${newPostData.id}`);
    // const postImg = document.getElementById(`post-img-${newPostData.id}`);
    const postBody = document.getElementById(`post-body-${newPostData.id}`);

    // set the new data
    postTitle.textContent = newPostData.title;
    postBody.textContent = newPostData.body;
    // postImg.src = newPostData.image;
}

function sanitizeHTMLContent(content){
    return CONFIG.safeHTMLPolicy 
        ? CONFIG.safeHTMLPolicy.createHTML(content)
        : DOMRefs.sanitize(content); // some browser don't support the trustedTypes so just sanitize the content
}

function handelPostClicked(postId) { // when user click on a post body ----> view it
    window.location.href = `postPage.html?postId=${postId}`;
}

function closeAllDropdowns() { // destroy all the opened menus
    const allDropdowns = document.querySelectorAll(".dropdown-menu");
    for (var i = 0; i < allDropdowns.length; i++) {
        allDropdowns[i].classList.remove("active");
    }
    document.getElementById("overlay").classList.remove("active");
}

function fillPostModal(post = null){ // fill the post model based on edit or create
    // fields to update
    const postTitle = document.getElementById('postModalLabel');
    const postTitleInput = document.getElementById('post-title-input');
    const postBodyInput = document.getElementById('post-body-input');
    const postImgInput = document.getElementById('post-image-input');
    const postFormBtn = document.getElementById('btn-text');
    const isNew = document.getElementById('isNew');
    
    if(post)
    {
        //update the fields
        postTitle.innerHTML = 'Edit post';
        postTitleInput.value = post.data.title;
        postBodyInput.value = post.data.body;
        // for now hide the image field
        postImgInput.style.display = 'none';
        postFormBtn.innerHTML = 'Edit';
        isNew.value = post.data.id;
    }
    else {
        //update the fields
        postTitle.innerHTML = 'Create new post';
        postTitleInput.value = '';
        postBodyInput.value = '';
        postImgInput.style.display = 'block';
        postFormBtn.innerHTML = 'Create';
        isNew.value = '';
    }
}

function toggleDropDownMenu(postId) { // show and hide the dropDownMenu
    const dropdownMenuSelected = document.getElementById(
        `dropdown-menu-${postId}`
    );
    const overlay = document.getElementById("overlay");
    const isShowing = dropdownMenuSelected.classList.contains("active");
    const allDropDownMenus = document.querySelectorAll(".dropdown-menu");

    for (let i = 0; i < allDropDownMenus.length; i++) {
        allDropDownMenus[i].classList.remove("active");
    }

    if (!isShowing) {
        dropdownMenuSelected.classList.add("active");
        overlay.classList.add("active");
    } else {
        dropdownMenuSelected.classList.remove("active");
    }
}

function toggleLoginUserOp(show){
    const dropDownBtn =  document.querySelectorAll('.dropdown-container');
    if(show){ // user was login and logout // hide
        dropDownBtn.forEach(btn=>{
            btn.style.setProperty('display' , 'inline-block' , 'important');
        })
    }
    else{
        dropDownBtn.forEach(btn=>{
            btn.style.setProperty('display' , 'none' , 'important');
        })
    }
}

function showDeleteModal(postId) { // show the delete model 
    const myModal = new bootstrap.Modal(document.getElementById('deletePostModal'));  // get post modal
    SelectedDeletedPostId = postId;
    myModal.show();
}

async function showPostModal(btnName , postId = null ){ // show the post model 
    const myModal = new bootstrap.Modal(document.getElementById('postModal'));  // get post modal
    if (btnName === 'edit'){
        // get post data to fill the post model 
        const requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        let response =  await fetch(`${baseUrl}/posts/${postId}`,requestOptions);
        let post = await response.json();
        fillPostModal(post)
    }
    else{
        fillPostModal();
    }
    //show the updated modal
    myModal.show();
}
//======================================================================================== user process functions
function getCurrentUser() { 
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) return user;
    return null;
}

async function logOutUser(){
    btnsWaiting({buttonId: 'logout-btn' , 
                spinnerId: 'logout-spinner-loading' , 
                showSpinner: true});
    const userInfo = getCurrentUser();
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
        const response = await fetch(`${CONFIG.baseUrl}/logout`, requestOptions);
        const json = await response.json();
        
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        
        showAlert({message : 'User logged out successfully' , alertType: 'success'});
    }
    catch (error){
        alert(error.message);
        showAlert({message : error.message , alertType: 'danger'});
    }
    finally{
        setUpUI();
        hideAlert();
        btnsWaiting({buttonId: 'logout-btn' , 
                    spinnerId: 'logout-spinner-loading' , 
                    showSpinner: false});
        toggleLoginUserOp(false);
    }
}

function authFlow({  failedPId , 
                            passwordInputId , 
                            modalInstance , 
                            message , 
                            jsonResponse , 
                            alertType ,
                        }){
    document.getElementById(failedPId).style.display = 'none';
    localStorage.setItem('token' , jsonResponse.token);
    localStorage.setItem('user' , JSON.stringify({...jsonResponse.user , 'password': document.getElementById(passwordInputId).value}));
    hideModal({modalInstance});
    setUpUI();
    showAlert({message , alertType});
    hideAlert();
}

async function loginUser() {
    //while waiting to be logged in disable the login button to prevent multiple requests
    btnsWaiting({buttonId:'login-form-btn' , 
                spinnerId: 'login-spinner-loading', 
                showSpinner: true});
    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json"); 

    const raw = JSON.stringify({
        username: DOMRefs.usernameInput.value,
        password: DOMRefs.loginPasswordInput.value
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };
    try{
        const response = await fetch(`${CONFIG.baseUrl}/login`, requestOptions);
        const json = await response.json();
        if (json.token)
        {
            authFlow({  failedPId: 'login-failed' , 
                        passwordInputId: 'login-password-input' , 
                        modalInstance: DOMRefs.loginInModal , 
                        message: 'User logged in successfully' , 
                        jsonResponse: json , 
                        alertType: 'success',
                        alertContainer: DOMRefs.alertContainer});
        }
        else
        {
            document.getElementById('login-failed').style.display = 'block';
            document.getElementById('login-failed').textContent = json.message;
        }
    }
    catch (error){
        alert(error.message);
        showAlert({message: error.message , alertType: 'danger'});
    }
    finally{
        btnsWaiting({buttonId:'login-form-btn' , 
                spinnerId: 'login-spinner-loading', 
                showSpinner: false});
        hideAlert();
        toggleLoginUserOp(show = true);
    }
}

async function registerUser(){
    btnsWaiting({buttonId:'register-form-btn' , 
                spinnerId: 'register-spinner-loading', 
                showSpinner: true});

    const imageFile = document.getElementById('upload-profile-img').files[0];

    let formData = new FormData();
    formData.append("username", document.getElementById('username-register-input').value);
    formData.append("password", document.getElementById('password-register-input').value);
    formData.append("name", document.getElementById('name-register-input').value);
    formData.append("email", document.getElementById('email-register-input').value);
    if (imageFile) {
        formData.append("image", imageFile);
    }
    else{ // upload a default image when user doesn't upload one
        const defaultImageUrl = '/assets/images/500.png';
        const response = await fetch(defaultImageUrl);
        const blob = await response.blob();
        formData.append("image", blob ,'default.png'); 
    }
        

    const requestOptions = {
        method: "POST",
        headers: {
            'Accept' : 'application/json'
        },
        body: formData,
        redirect: "follow"
    };

    try{
        const response = await fetch(`${CONFIG.baseUrl}/register`, requestOptions);
        const json = await response.json(); // get raw text first

        if(json.token){
            authFlow({  failedPId: 'register-failed' , 
                        passwordInputId: 'password-register-input' , 
                        modalInstance: registerModal , 
                        message: 'User logged in successfully' ,
                        jsonResponse: json , 
                        alertType: 'success' ,
                        alertContainer: DOMRefs.alertContainer});
        }else{
            console.log(json)
            document.getElementById('register-failed').style.display = 'block';
            document.getElementById('register-failed').textContent = json.message;
        }
    }
    catch (error){  
        console.log(error.message);
        showAlert({message: error.message , alertType: 'danger'});
    }
    finally{
        btnsWaiting({buttonId:'register-form-btn' , 
                    spinnerId: 'register-spinner-loading', 
                    showSpinner: false});
        hideAlert();
        toggleLoginUserOp(show = true);
    }
}

async function getUserInfo({id}){
    const requestOptions = {
        method : 'get' ,
        header : {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
        }
    }
    let response = await fetch(`${CONFIG.baseUrl}/users/${id}`,requestOptions);
    let json = await response.json();
    return json.data;
}

function goToUserProfile(id){
    window.location.href = `profilePage.html?userId=${id}`;
}

hideAlert();
setUpUI();
formValidation({formId: "loginForm" , formFunction: loginUser});
formValidation({formId: "registerForm" ,formFunction : registerUser});