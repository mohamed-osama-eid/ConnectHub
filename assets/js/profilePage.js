const userCardBodyInfo = document.getElementById('user-card-body-info');
const userPostsTitle = document.getElementById('user-post-title');
const userPostsContainer = document.getElementById('post-container');
const baseUrl = "https://tarmeezacademy.com/api/v1";

// functions
async function getUserPosts(userId) {
    const requestOptions = {
        method : 'get' ,
        header : {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
        }
    }
    try{
        let response = await fetch(`${baseUrl}/users/${userId}/posts`,requestOptions);
        let userPosts = await response.json();
        return userPosts.data ;
    }
    catch (error){
        return error.message
    }
}

async function showUserProfileInfo() {
    const userId = getWindowsParams({paramName: 'userId'});
    const requestOptions = {
        method : 'get' ,
        header : {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
        }
    }
    try{

        // let response = await fetch(`${baseUrl}/users/${userId}`,requestOptions);
        let userInfo = await getUserInfo({id: userId});
        let userPosts = await getUserPosts(userId);
        let dropDownMenuContent = ``;
        // userPostsContainer.innerHTML = ``;
        const currentUser = await getCurrentUser();
        const userImage = setDefaultImg({userImg: userInfo.profile_image , defaultImage : '/assets/images/500.png'})
        userCardBodyInfo.innerHTML = `
                                        <div class="card-body">
                                            <!-- post number , image , comments numbers  -->
                                            <div class="d-flex justify-content-evenly align-items-center mb-2">

                                                <!-- posts numbers -->
                                                <div class="d-flex flex-column">
                                                    <span style="  font-size: 40px; 
                                                                font-weight: 600; 
                                                                margin: 0;
                                                                text-align: center;"
                                                                >
                                                                ${userInfo.posts_count}
                                                    </span>
                                                    <span style="  color: var(--btn-bg-secondary-color); 
                                                                margin: 0;
                                                                font-size: 20px;"
                                                                >
                                                                posts
                                                    </span>
                                                </div>
                                                <!--# posts numbers #-->

                                                <div class="d-flex flex-column align-items-center">
                                                    <div class="image-container" style="width: 200px; height: 200px;">
                                                        <img src="${userImage}" alt="" style="width: 190px; height: 190px;">
                                                    </div>

                                                    <!-- name , username -->
                                                    <div style="text-align: center; font-family: 'Avenir'; margin-top: 10px;">
                                                        <p style="font-size: 30px; margin: 0; font-weight: 800;">${userInfo.name}</p>
                                                        <p style="font-size: 18px; margin: 0; font-weight: 100; color: var(--btn-bg-secondary-color);">@${userInfo.username}</p>
                                                    </div>
                                                </div>

                                                <!-- comments numbers -->
                                                <div class="d-flex flex-column">
                                                    <span style="  font-size: 40px; 
                                                                font-weight: 600; 
                                                                margin: 0;
                                                                text-align: center;"
                                                                >
                                                                ${userInfo.comments_count}
                                                    </span>
                                                    <span style="  color: var(--btn-bg-secondary-color); 
                                                                margin: 0;
                                                                font-size: 20px;"
                                                                >
                                                                comments
                                                    </span>
                                                </div>
                                                <!--# comments numbers #-->

                                                <!--# post number , image , comments numbers  #-->
                                            </div>
                                        </div>
                                    `
        
        userPostsTitle.innerHTML = `@${userInfo.username}'s Posts`;

        if(userPosts.length === 0){
            document.getElementById('no-posts-title').innerHTML = 'لا يوجد منشورات حالية لهذا المستخدم';
            document.getElementById('no-posts-title').style.setProperty('display','block' , 'important');
        }

        for (let post of userPosts){
            insertNewPost({direction :'beforeend' , post :post , currentUser: currentUser , container: userPostsContainer})
        }
        
        showAlert({message : "All user's posts loaded successfully" , alertType: 'success'});
    }
    catch (error){
        console.error(error.message);
        showAlert({message : error.message , alertType: 'danger'});
    }
    finally{
        hideAlert();
        toggleLoadingSpinner(show=false)
    }
}

showUserProfileInfo();
formValidation({formId : "postForm", formFunction: handelPostRequest});
