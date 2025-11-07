# Smart Resume + Portfolio Builder

> **Create. Customize. Download.**  
> Your dream job starts with a smarter resume.

A modern, interactive, and beautifully designed **Resume + Portfolio Builder** built with **React.js, HTML5, CSS3, and JavaScript (ES6+)**.  
This web app allows users to **create, preview, and download** stunning resumes — with live customization, multiple templates, and an integrated portfolio section.

Run the website: https://kausalyanp.github.io/Resume-Builder-Website/

---

## 🚀 Features

### 🧠 **Resume Builder**
- 📝 Live form editing with instant preview  
- 🎨 Multiple professionally designed templates (Classic, Modern, Creative)  
- 🎨 Custom color and font selectors  
- 📸 Profile photo upload and crop  
- 💾 Auto-save progress (LocalStorage)  
- 📄 Download resume as PDF (via `html2canvas` + `jsPDF`)  
- 🔁 Reset and start over anytime  

### 💼 **Portfolio Builder**
- 🧱 Add portfolio projects with title, description, image, and links  
- 🧩 Card-based layout with smooth hover effects  
- 🔗 Optional integration with resume download  
- 🗂️ Manage (add/edit/delete) your projects easily  

### ⚙️ **Additional Features**
- 🌗 Dark / Light mode toggle  
- ✨ Framer Motion animations for smooth transitions  
- 🔤 Multiple font styles and custom themes  
- 📱 Fully responsive (desktop, tablet, mobile)  
- 💬 Minimal, elegant, and easy-to-use UI  

---

## 🖼️ Screenshots

| Resume Builder | Portfolio Builder | PDF Export |
|----------------|------------------|-------------|
| <img width="1758" height="938" alt="image" src="https://github.com/user-attachments/assets/033bd75e-5cd0-4acf-8b1b-acfcfc6909f1" /> | <img width="1746" height="926" alt="image" src="https://github.com/user-attachments/assets/f186f3a0-a8d5-4c89-bf27-9c3569477e7b" /> | <img width="1722" height="853" alt="image" src="https://github.com/user-attachments/assets/4218c606-15a9-45f6-a98d-0672aa76bffe" /> 

> 📸 *Screenshots are for illustration — update with your actual project images.*

---

## 🏗️ Tech Stack

| Category | Technologies |
|-----------|--------------|
| **Frontend** | React.js (Hooks + Context API), HTML5, CSS3 (Flexbox & Grid) |
| **State Management** | Context API / Redux (optional) |
| **Styling** | Advanced CSS, CSS Variables, Framer Motion |
| **PDF Export** | html2canvas, jsPDF |
| **Storage** | LocalStorage |
| **Icons** | Lucide React / FontAwesome |
| **Deployment** | Vercel / Netlify |

---

## 🧩 Project Structure
src/
├── components/

│ ├── ResumeForm.jsx

│ ├── ResumePreview.jsx

│ ├── TemplateSelector.jsx

│ ├── PortfolioForm.jsx

│ ├── PortfolioPreview.jsx

│ ├── Sidebar.jsx

│ ├── Navbar.jsx

│ └── PDFExportButton.jsx

├── pages/

│ ├── Home.jsx

│ ├── ResumeBuilder.jsx

│ ├── PortfolioBuilder.jsx

│ ├── Preview.jsx

│ └── Settings.jsx

├── styles/

│ ├── global.css

│ ├── variables.css

│ └── templates.css

├── utils/

│ └── pdfGenerator.js

├── App.js

└── index.js


---

## 🪄 How It Works

1. **Fill out your details** – name, experience, skills, and projects.  
2. **Customize your design** – choose your color, font, and template.  
3. **Preview in real time** – see your resume and portfolio update instantly.  
4. **Download as PDF** – get a clean, professional resume ready for job applications.  

---

## 🧠 Learning Outcomes

By building this project, you’ll master:
- React component architecture & reusable design  
- Real-time data binding and state synchronization  
- PDF generation from web layouts  
- Advanced responsive CSS & animations  
- Clean UI/UX design and accessibility principles  

---

## 🌈 UI Design Highlights

- Glassmorphism-based interface  
- Pastel gradients with soft shadows  
- Smooth motion effects (Framer Motion)  
- Fully accessible color contrast and font readability  
- Intuitive layout inspired by Notion & Canva  

---

## ⚡ Setup Instructions

### 🧰 Prerequisites
- Node.js (v18+)
- npm or yarn

### 💻 Installation
```bash
# Clone this repository
git clone https://github.com/kausalyanp/smart-resume-builder.git

# Navigate to project folder
cd smart-resume-builder

# Install dependencies
npm install

# Start the development server
npm start
```
### 🛠️ Build for Production
```
npm run build
```
### 📦 Dependencies
```
"dependencies": {
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "framer-motion": "^11.0.0",
  "jspdf": "^2.5.2",
  "html2canvas": "^1.4.1",
  "lucide-react": "^0.300.0"
}
```
---
### 🧑‍🎨 Author

Kausalya N P

Frontend Developer | Creative Technologist | Aspiring Entrepreneur

---
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
