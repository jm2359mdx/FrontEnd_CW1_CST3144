# 🌟 LearnEase – Frontend (Vue.js 3) (FrontEnd_CW1_CST3144)

This is the Vue.js frontend for LearnEase, a full-stack lesson booking application developed for CST3144. It communicates with a Node.js + Express backend hosted on Render.

## 🌐 Backend API Used

[**https://backend-cw1-cst3144-1.onrender.com**](https://backend-cw1-cst3144-1.onrender.com)

## 🌐 API Endpoints Used

- `GET /lessons` – Fetch all lessons
- `GET /search?q=` – Search lessons
- `POST /orders` – Submit new order
- `PUT /lessons/:id` – Update spaces

## 🎨 Tech Stack

- Vue.js 3 (Composition + Options API mix)
- Vite development server
- JavaScript (ES modules)
- Fetch API (no axios allowed per coursework)

## 🛠 Run the Frontend

1.  **Install**
    ```
    npm install
    ```
2.  **Run Dev Server**
    ```
    npm run dev
    ```
3.  **Build for Production**
    ```
    npm run build
    ```

Frontend opens at:
[**http://localhost:5173**](http://localhost:5173)

## 📁 Project Structure

- `FrontEnd_CW1_CST3144/`
  - `src/`
    - `assets/`
      - `lessons/` - Lesson images
    - `components/`
      - `AppHeader.vue`
      - `CartList.vue`
      - `CheckoutForm.vue`
      - `ControlsBar.vue`
      - `LessonCard.vue`
      - `LessonsGrid.vue`
    - `App.vue`
    - `main.js`
  - `index.html`
  - `package.json`
  - `vite.config.js`
  - `README.md`

## ✨ Features

### Lessons

- Lessons fetched directly from backend API
- Display subject, price, location, spaces, and image
- Responsive lesson grid

### Search

- Search-as-you-type
- Uses backend `/search` endpoint
- Supports text + numeric matching

### Sorting

- Sort by:
  - Subject
  - Location
  - Price
  - Available spaces
- With ascending/descending toggle

### Cart

- Add lessons to cart
- Prevent adding more than available spaces
- Edit quantity
- Remove items

### Checkout

- Name + phone validation
- Creates an order using POST request
- Updates lesson spaces using PUT
- Displays confirmation

## 🧾 Coursework Requirements Covered

- [x] Vue.js frontend
- [x] Search-as-you-type
- [x] Sorting functionality
- [x] Add to cart
- [x] Shopping cart display + removal
- [x] Checkout validation
- [x] POST + PUT integration
- [x] Correct usage of fetch
- [x] Matches backend spec exactly
