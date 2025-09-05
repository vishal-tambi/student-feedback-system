
# 🎓 Student Feedback System

> 🚀 A modern MERN-stack application that lets students share feedback & ratings while giving admins powerful analytics and course management tools.


---

## 📌 Quick Links

* [✨ Overview](#-overview)
* [⚡ Features](#-features)
* [🛠 Tech Stack](#-tech-stack)
* [📸 Screenshots](#-screenshots)
* [🚀 Installation](#-installation)
* [🎯 Usage](#-usage)
* [📚 API Docs](#-api-documentation)
* [📂 Project Structure](#-project-structure)
* [🤝 Contributing](#-contributing)
* [📄 License](#-license)

---

## ✨ Overview

The **Student Feedback System** streamlines how educational institutions collect and analyze feedback.
Students can rate & review courses 📑, while admins enjoy an analytics-packed dashboard 📊.

👉 Perfect for **universities, online courses, or training programs** looking for a simple yet powerful feedback solution.

---

## ⚡ Features

### 🎓 For Students

✔️ Browse courses with live ratings
✔️ Submit detailed feedback (1–5 ⭐)
✔️ Manage your own reviews (edit/delete)
✔️ Personalized dashboard

### 👨‍💼 For Admins

✔️ Add, edit, or delete courses
✔️ View analytics with **charts & insights**
✔️ Track course rankings & performance
✔️ Manage students & engagement

### 🛠 Technical Highlights

* 🔐 **JWT Authentication** (secure login & roles)
* 📊 **Chart.js Analytics** (real-time data viz)
* 📱 **Responsive Design** (Tailwind CSS, mobile-first)
* ⚡ **Vite-Powered** fast builds
* ✅ Input validation & error handling

---

## 🛠 Tech Stack

**Frontend**
🔹 React 18 • Vite • TailwindCSS • Chart.js • React Router • Axios

**Backend**
🔹 Node.js • Express.js • MongoDB • Mongoose • JWT • bcryptjs

---

## 📸 Screenshots

| Student Dashboard | Analytics View | Admin Panel |
| ----------------- | -------------- | ----------- |
| <img src="https://github.com/user-attachments/assets/232674a5-2e85-427f-9bd1-868b4d8a8991" alt="Student Dashboard" width="400"/> | <img src="https://github.com/user-attachments/assets/f4796607-dd7f-4386-abf7-641b0ccf5b92" alt="Analytics View" width="400"/> | <img src="https://github.com/user-attachments/assets/86b1016a-e2dc-49fe-a596-dffd1f7dbd39" alt="Admin Panel" width="400"/> |

---

## 🚀 Installation

<details>
<summary>📦 Setup Guide</summary>

### Prerequisites

* Node.js (v14+)
* MongoDB (local or Atlas)
* npm / yarn

### Backend Setup

```bash
git clone https://github.com/yourusername/student-feedback-system.git
cd student-feedback-system/backend
npm install
cp .env.example .env
npm run dev
```

### Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

➡️ **App runs at**:

* Frontend → `http://localhost:3000`
* Backend API → `http://localhost:5000`

</details>  

---

## 🎯 Usage

🔑 Demo Accounts (after seeding data):

* **Admin:** `admin@demo.com` / `password`
* **Student:** `student@demo.com` / `password`

Steps:
1️⃣ Login / Register
2️⃣ Browse courses & add feedback
3️⃣ Explore analytics
4️⃣ Admins → Manage courses & view stats

---

## 📚 API Documentation

| Method | Endpoint             | Description     | Auth      |
| ------ | -------------------- | --------------- | --------- |
| POST   | `/api/auth/register` | Register user   | ❌         |
| POST   | `/api/auth/login`    | Login           | ❌         |
| GET    | `/api/courses`       | Get all courses | ❌         |
| POST   | `/api/courses`       | Add course      | ✅ Admin   |
| POST   | `/api/feedback`      | Add feedback    | ✅ Student |

👉 [See full API docs](docs/API.md)

---

## 📂 Project Structure

```bash
student-feedback-system/
│── backend/       # Express, MongoDB, JWT
│── frontend/      # React, Vite, Tailwind
└── docs/          # Documentation
```

---

## 🤝 Contributing

Contributions welcome 🎉

1. Fork it 🍴
2. Create a branch 🌱 (`feature/YourFeature`)
3. Commit 📝 (`git commit -m "Add amazing feature"`)
4. PR 🔥

---

## 📄 License

📌 MIT — free to use & modify.

---

## 👨‍💻 Author

**Your Name**
🌐 [GitHub](https://github.com/vishal-tambi) • 💼 [LinkedIn]((https://www.linkedin.com/in/vishal-tambi-b180b724b)) • 📧 [tambivishal3@gmail.com](mailto:tambivishal3@gmail.com)

---

## ⭐ Support

If this project helped you:
⭐ Star it on GitHub → it means a lot!
