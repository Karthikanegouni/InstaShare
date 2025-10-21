# Insta Share App

A responsive, fully functional **Instagram-like social media application** built using **React.js (Class Components)** with **Vite**.  
This app demonstrates **authentication**, **routing**, **state management**, **API integration**, and **responsiveness** using pure CSS and React concepts.

## Project Overview

The **Insta Share App** allows users to:

- Log in securely using valid credentials.
- View **User Stories** and **Posts** fetched from APIs.
- Like or unlike posts.
- View **My Profile** and **Other User Profiles**.
- Search posts by caption.
- Handle **authorization**, **error views**, and **loading states**.
- Experience a **responsive** design suitable for mobile, tablet, and desktop.

---

## Setup Instructions (Vite)

- ### Clone the repository

```
git clone https://github.com/Karthikanegouni/InstaShare.git
cd InstaShare
```

- ### Install Dependencies

```
npm install
```

- ### Start the Development Server

```
npm run dev
```

Your app will run at **http://localhost:5173** (default Vite port).

---

## Authentication

- Users must log in using valid credentials from the given list.
- Upon successful login, a JWT Token is stored in cookies (`jwt_token`).
- Unauthorized users trying to access protected routes are redirected to the Login page.
- Authenticated users trying to visit `/login` are redirected to `/`.

---

## Routes

| Path          | Component     | Description                       |
| ------------- | ------------- | --------------------------------- |
| `/login`      | `Login`       | Login page for users              |
| `/`           | `Home`        | Displays stories and posts feed   |
| `/my-profile` | `MyProfile`   | Displays logged-in user's profile |
| `/users/:id`  | `UserProfile` | Displays selected user’s profile  |
| `*`           | `NotFound`    | Handles invalid URLs              |

---

## APIs Used

```
Login API: POST https://apis.ccbp.in/login
User Stories API: GET https://apis.ccbp.in/insta-share/stories
Posts API: GET https://apis.ccbp.in/insta-share/posts
Like / Unlike Post API: POST https://apis.ccbp.in/insta-share/posts/{postId}/like
My Profile API: GET https://apis.ccbp.in/insta-share/my-profile
User Profile API: GET https://apis.ccbp.in/insta-share/users/{userId}
Search Posts API: GET https://apis.ccbp.in/insta-share/posts?search={query}
```

---

## Packages Used

- `react-router-dom` : Routing and navigation
- `js-cookie` : Storing JWT token securely
- `react-loader-spinner` : Loader component for API calls
- `react-slick` & `slick-carousel` : Stories slider functionality
- `react-icons` : Like, Comment, Share, and Search icons

---

## User Credentials

| Username | Password    |
| -------- | ----------- |
| rahul    | rahul@2021  |
| aakash   | sky@007     |
| deepak   | lightstar@1 |
| kapil    | moon$008    |
| saira    | princess@9  |
