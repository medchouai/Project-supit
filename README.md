# Algebra University - SUPIT Project 2025/26

A modern, responsive website for Algebra University College, built following the official SUPIT project requirements. This project features a multi-page architecture, user authentication, and a dynamic curriculum management system.

## 🚀 Features

- **Responsive Design**: A fluid layout that works seamlessly on desktop, tablet, and mobile devices.
- **Dynamic Navigation**: Interactive navbar with a hamburger menu for mobile view.
- **User Authentication**: Secure Login and Registration system using JWT (JSON Web Tokens) to manage user sessions.
- **Curriculum Management**:
  - **Autocomplete Search**: Real-time course suggestions as you type.
  - **Interactive Table**: Add and remove courses from your list dynamically.
  - **Live Statistics**: Automatic calculation of total ECTS points and weekly study hours.
- **News & Articles**: A curated news section featuring image lightboxes for high-quality viewing.
- **Contact System**: A functional contact form with Google Maps integration for campus location.

## 🛠️ Technology Stack

- **HTML5**: Semantic structure for all pages.
- **CSS3 (Vanilla)**: Modern, custom-built styles with CSS variables and flexbox/grid layouts.
- **JavaScript (Vanilla)**: Modular, client-side logic utilizing the Fetch API for asynchronous communication.
- **JWT**: Secure token-based authentication.
- **External API**: Integration with a central API for user management and course data.

## 📁 Project Structure

```text
Project-supit/
├── index.html          # Home page
├── pages/              # Main sub-pages (About, News, Curriculum, Contact, Login)
│   ├── articles/       # Individual news articles
│   └── ...
├── css/                # Modular stylesheets (styles.css, layout-specific CSS)
├── js/                 # Modular JavaScript (auth.js, curriculum.js, navbar.js, etc.)
├── img/                # High-quality image assets
├── video/              # Video assets for backgrounds and sections
└── README.md           # Project documentation
```

## 🚥 Getting Started

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-repo/Project-supit.git
    ```
2.  **Open locally**:
    Simply open `index.html` in any modern web browser. No server setup is required for the frontend.
3.  **Login**:
    To access the Curriculum page, use the Registration form to create an account or use valid credentials via the Login page.

## 📝 Standards

This project follows modern web standards, emphasizing clean code, accessibility, and performance. All styles are custom-written to ensure a unique and premium user experience.