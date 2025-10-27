# 🌐 ConnectHub

A simple social media-style platform built using **Vanilla JavaScript**, **HTML**, **CSS**, and **Bootstrap** — designed to practice and apply real-world **API integration** concepts.

---

## 🧠 Overview

**ConnectHub** was developed as a hands-on project to strengthen my understanding of APIs and asynchronous JavaScript.  
The main goal was to apply what I learned from the **Advanced JavaScript playlist by Tarmez Academy**, including concepts like:
- API requests with **XMLHttpRequest**, **Promises**, and **Axios**
- Understanding and managing **callback hell**
- Using **Promise chains** for cleaner async code

The API used in this project simulates a small-scale social media backend that supports:
- **User Authentication** (login, register, logout)
- **Posts** (view, create, update, delete)
- **Comments and tags**
- **User profiles**

---

## 🚀 Features

### 🏠 Home Page
- Displays all **user posts**
- Shows **comment counts**
- Allows users to **view comments** instantly with a single click

### 👤 Profile Page
- Displays **user information**: name, username, post count, and comment count  
- Shows **all user posts**
- Supports:
  - ✏️ Editing and deleting user’s own posts  
  - ➕ Adding a new post  

### 🔐 Authentication & Authorization
- **Login** using username and password  
- **Register** by entering name, username, email, and uploading a profile image  
- Authentication handled fully through the API using **JWT tokens**  
- Prevents unauthorized users from interacting with posts or comments

---

## 🧩 Tech Stack

| Category | Technology |
|-----------|-------------|
| **Frontend** | Vanilla JavaScript |
| **Styling** | CSS3, Bootstrap 5 |
| **Markup** | HTML5 |
| **Backend (API)** | External Social Media API |
| **Version Control** | Git & GitHub |

---

## 📁 Project Structure

    ConnectHub/
    ├── assets/
    │ ├── css/
    │ ├── js/
    │ ├── images/
    │ └── favicons/
    ├── index.html # Home Page
    ├── post.html # Post Details Page
    ├── profile.html # User Profile Page
    └── README.md
---

## 🧑‍💻 Development Notes

This project was a solo effort, though I received some valuable **UI/UX feedback** from friends.  
Throughout development, I tackled and solved many challenges on both **frontend** and **backend integration** sides — including token-based authentication, dynamic rendering, and working with asynchronous API calls.

---

## 🏁 Project Status

🚧 **In Progress** — currently refining UI interactions and improving code structure.

No live demo available yet.

---

## 💭 What I Learned

- Deep understanding of **API communication** (GET, POST, PUT, DELETE)
- Handling **authentication tokens** in the frontend
- Managing dynamic DOM updates efficiently
- The importance of **clear error handling** and UX feedback
- Real-world practice with **modular JS** structure

---

## 📸 Screenshots

- Home Page
      <img width="1920" height="915" alt="homePage" src="https://github.com/user-attachments/assets/88eb67de-e965-4411-a871-4ea61c215c56" />
- Profile Page
      <img width="1920" height="911" alt="profilePage" src="https://github.com/user-attachments/assets/bea9e0e9-a9c1-438c-9ab0-1577c9fa48ef" />
- Login & Register Pages
      <img width="1920" height="917" alt="loginPage" src="https://github.com/user-attachments/assets/72832243-e5cb-4874-8d95-f221c6a471ac" />
      <img width="1920" height="913" alt="registerPage" src="https://github.com/user-attachments/assets/11763e3b-8c51-48d0-846b-e674e7eff78b" />
- post Page
      <img width="1920" height="913" alt="postPage" src="https://github.com/user-attachments/assets/e4912230-ff63-44d2-8e9a-8c1b6a6b63cd" />
---

## 🤝 Acknowledgments

Special thanks to **Tarmez Academy** for the advanced JavaScript playlist — an invaluable resource that made this project possible.

---
