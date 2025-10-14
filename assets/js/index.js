// variables
const baseUrl = "https://tarmeezacademy.com/api/v1";
let page = 1;
let loading = false;
let lastPage = 1;
let SelectedDeletedPostId = null;

window.addEventListener("scroll", () => {
    // console.log(`the area scrolling -> ${document.documentElement.clientHeight + window.scrollY}` , 
    //             `${document.documentElement.scrollHeight}`)
    if (
        (document.documentElement.clientHeight + window.scrollY + 1)>=
        (document.documentElement.scrollHeight ||
        document.documentElement.clientHeight)
    ) {
        console.log("scroll");
        console.log(`currentPage-> ${page} , loadingState-> ${loading} , lasPage-> ${lastPage}`);
        loading = true;
        getPosts();
    }
});

// functions
async function getPosts() {
    const currentUser = getCurrentUser();
    const postsContainer = document.getElementById("posts-container");
    if (loading && page > lastPage) // in case you have overcome all the post pages
        return;
    if (page == 1)
        postsContainer.innerHTML = '';
    toggleLoadingSpinner(show=true);

    const requestOptions = {
        method: "GET",
        redirect: "follow",
    };
    try {
        const response = await fetch(`${baseUrl}/posts?limit=10&page=${page}`,requestOptions);
        const posts = await response.json();
        lastPage = posts.meta.last_page;
        for (let post of posts.data) {
            console.log(post)
            insertNewPost({direction: 'toEnd' , post: post , currentUser: currentUser , container: postsContainer});
        }
    } catch (error) {
        console.error(error.message);
        showAlert({message: error.message , alertType: 'danger'});
    } finally {
        console.log("all posts fetched successfully");
        showAlert({message: 'All posts fetched successfully' , alertType: 'success'});
        loading = false;
        page++;
        toggleLoadingSpinner(show=false);
    }
}

// project concept
// 1- show all posts
// 2- check if the user is logged in or out and based on that update the ui
// 3-infinite scrolling
getPosts();
formValidation({formId : "postForm", formFunction: handelPostRequest});