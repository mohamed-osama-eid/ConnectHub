// variables
const postContainer = document.getElementById('post-container');
const baseUrl = 'https://tarmeezacademy.com/api/v1';
const postID = getWindowsParams({paramName: 'postId'});
const token = localStorage.getItem('token');
const currentUser = JSON.parse(localStorage.getItem('user'));

// functions
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
        currentUserProfileImage = setDefaultImg({defaultImage : '/assets/images/500.png' , userImg:  currentUser != null ? currentUser.profile_image : null });

        for(let comment of post.comments){
            commentsHTML += fillCommentContent({comment: comment})
        }
        insertNewPost({direction :'beforeend' , post: post , currentUser: currentUser , container:postContainer , commentsHTML : commentsHTML });
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

// concept:
// 1 - update the ui based on the credentials
// 2 - show the post and comments
// 3 - if the user is logged in  show the add comment section
// 4 - user add comment then update the post
showPost(postID);
formValidation({formId : "postForm", formFunction: handelPostRequest});