// variables
const postContainer = document.getElementById('post-container');
const baseUrl = 'https://tarmeezacademy.com/api/v1';
const postID = getWindowsParams({paramName: 'postId'});
const token = localStorage.getItem('token');
const currentUser = JSON.parse(localStorage.getItem('user'));

// eventsListener
postContainer.addEventListener('click',(e)=>{
    let closestBrn = e.target.closest('#new-comment-btn');
    if (closestBrn)
    {
        const loggedInUserComment = document.getElementById('logged-in-user-comment').value;
        if(loggedInUserComment)
            addNewComment(loggedInUserComment);
        else{
            showAlert({ message:'Please enter comment to add' , 
                        alertType: 'danger'});
            hideAlert();
        }
            
    }
});

// functions
async function addNewComment(comment) {
    const token = localStorage.getItem('token');
    if(token){
        toggleLoadingSpinner(show=true);
        const raw = JSON.stringify({
            body: comment,
        });

        const requestOptions = {
            method: "POST",
            body : raw , 
            headers : {
                'Authorization' : `Bearer ${token}`,
                "Accept": "application/json" ,
                "Content-Type": "application/json"
            }
        }

        try{
            const response = await fetch(`${baseUrl}/posts/${postID}/comments`, requestOptions);
            const json = await response.json(); // get raw text first

            if(json.data)
            {
                console.log(json)
                showAlert({message:"Comment was add successfully" , alertType: 'success'});
                document.getElementById('users-comments').insertAdjacentHTML('afterbegin', fillCommentContent(json.data));
            }
            else{
                showAlert({message:json.message , alertType: 'danger'});
            }
        }
        catch (error){
            console.error(error.message);
            showAlert({message: error.message , alertType: 'danger'});
        }
        finally{
            toggleLoadingSpinner(show=false);
        }
    }
    else{
        showAlert({message: 'You have to login first.!' , alertType: 'danger'});
    }
    hideAlert();
}

async function showPost(postID) {
    toggleLoadingSpinner(show=true);
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    try{
        // fetch the post
        let response =  await fetch(`${baseUrl}/posts/${postID}`,requestOptions);
        let post = (await response.json()).data;
        let writeCommentHTML ='';
        let commentsHTML = '';
        currentUserProfileImage = setDefaultImg({userImg: currentUser.profile_image , defaultImage : '/assets/images/500.png'});

        writeCommentHTML = `  
                            <!-- current User comment -->
                                <div id = 'write-comment'>
                                    <div class="p-2 d-flex align-items-center gap-2" style="font-size: 1rem;">
                                        <div class="d-flex align-items-center">
                                            <!-- current User img -->
                                            <span class="image-container">
                                                <img    src="${currentUserProfileImage}" 
                                                        alt="">
                                            </span>
                                            <!--# current user image #-->
                                        </div>

                                        <!-- current User Comment -->
                                        <div class="new-comment d-flex position-relative w-100">
                                            <input  type="text" id="logged-in-user-comment"
                                                    name="logged-in-user-comment" placeholder="write a comment"
                                                    class="" style="width: 100%; padding:10px; color: var(--color-primary-text);">

                                            <button id = 'new-comment-btn' class="position-absolute top-0 end-0">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-send" viewBox="0 0 16 16">
                                                    <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z"/>
                                                </svg>
                                            </button>
                                        </div>
                                        <!--# current user Comment #-->
                                    </div>
                                </div>
                            <!--# current User comment #-->
                                `;
        
        for(let comment of post.comments){
            commentsHTML += fillCommentContent(comment)
        }
        insertNewPost({direction :'beforeend' , post: post , currentUser: currentUser , container:postContainer , writeCommentHTML :writeCommentHTML , commentsHTML : commentsHTML });
    }
    catch (error){
        console.error(error.message)
        showAlert({message: error.message , alertType: 'danger'});
    }
    finally{
        hideAlert();
        toggleLoadingSpinner(show=false);
    }
}

function fillCommentContent(comment){
    const userCommentImg = setDefaultImg({userImg: comment.author.profile_image , defaultImage : '/assets/images/500.png'});
    let content = `
                    <!-- other users comments -->
                        <div class="p-2 d-flex align-items-start gap-2 comment" style="font-size: 1rem;">
                            
                            <!-- other user profile image -->
                            <div class="d-flex align-items-center gap-2">
                                <span class="image-container">
                                    <img    src="${userCommentImg}" 
                                            alt="" >
                                </span>
                            </div>
                            <!--# other user profile image #-->

                            <!-- other user comment -->
                            <div class="h-100" style="  width: 100%; 
                                                        padding:10px; 
                                                        background-color: var(--main-bg-primary-color); 
                                                        color: var(--color-primary-text) ;
                                                        border-radius: 10px;">
                                <!-- username -->
                                <p class="mb-2 fw-bold" style="color: var(--btn-bg-secondary-color);">@${comment.author.username}</p>
                                <!-- comment body -->
                                <p class="m-0 fw-light">${comment.body}</p>
                            </div>
                            <!--# other user comment #-->

                        </div>
                    <!--# other users comments #-->
                    `;
    return sanitizeHTMLContent(content) 
}

// concept:
// 1 - update the ui based on the credentials
// 2 - show the post and comments
// 3 - if the user is logged in  show the add comment section
// 4 - user add comment then update the post
showPost(postID);
formValidation({formId : "postForm", formFunction: handelPostRequest});