# Property-Listing-Platform🌍

property-listing-platform is a full-stack web application inspired by Airbnb where users can explore listings, create their own listings, and share reviews.
The project is built using **Node.js, Express, MongoDB, and EJS** following the **MVC architecture**.

---

## 🚀 Features

* 🔐 **User Authentication**

  * Signup / Login / Logout
  * Secure password hashing with Passport

* 🏡 **Listings Management**

  * Create new listings
  * Edit listings
  * Delete listings
  * Only listing owners can edit or delete

* ⭐ **Review System**

  * Add reviews to listings
  * Star rating system
  * Delete reviews (only by review author)

* 🎨 **UI Improvements**

  * Responsive layout using Bootstrap
  * Airbnb-style review cards
  * Clickable star rating input

* 🛡 **Authorization**

  * Only authenticated users can create reviews or listings
  * Only owners can edit/delete their content

---

## 🛠 Tech Stack

**Backend**

* Node.js
* Express.js
* MongoDB
* Mongoose

**Frontend**

* EJS
* Bootstrap
* CSS
* Font Awesome

**Authentication**

* Passport.js
* passport-local
* passport-local-mongoose

**Other Tools**

* Joi (validation)
* Method-override
* Express-session
* Connect-flash

---

## 📁 Project Structure

```
MajorProject
│
├── controllers
│   ├── listings.js
│   ├── reviews.js
│   └── users.js
│
├── models
│   ├── listing.js
│   ├── reviews.js
│   └── user.js
│
├── routes
│   ├── listingRoutes.js
│   ├── reviewRoutes.js
│   └── userRoutes.js
│
├── views
│   ├── listings
│   ├── users
│   └── layouts
│
├── public
│   ├── css
│   └── js
│
├── middleware.js
├── utils
│   ├── ExpressError.js
│   └── wrapAsync.js
│
└── index.js

---

## ⚙️ Installation

Clone the repository:

git clone https://github.com/DevSaurabhY/property-listing-platform.git

Navigate into the project:

cd property-listing-platform

Install dependencies:

npm install

Start the server:

node index.js

Open in browser:

http://localhost:8080

## 🔮 Future Improvements

* Image upload with **Cloudinary**
* Maps integration with **Mapbox**
* Search functionality
* Pagination
* Average rating system

---

## 👨‍💻 Author

Developed by Saurabh Yadav

GitHub: https://github.com/DevSaurabhY

---
