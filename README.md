<div align="center">

# 🎮 Razerware

### **Your Gaming Arsenal.**

*Your next gaming setup, picked with the help of an AI that actually knows hardware.*

![Status](https://img.shields.io/badge/status-in%20development-orange)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?logo=bootstrap&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini%20AI-8E75B2?logo=googlegemini&logoColor=white)

</div>

---

## 🕹️ What is Razerware?

**Razerware** is a full stack e-commerce platform for computers and components, with a strong focus on **gaming**. It's inspired by stores like PcComponentes, with a twist: an **AI assistant powered by Google Gemini** that helps you choose the right hardware.

Tell it what you need your PC for (gaming at 1440p, streaming, video editing, a tight budget...) and the assistant will recommend **real products from the catalog**, explaining why each one fits you.

> ⚠️ This is a personal portfolio project. No real sales or payments are processed.

## ✨ Features

- 🛒 Catalog of PCs, laptops and components with filters and search
- 📄 Product pages with detailed specifications
- 🧺 Shopping cart and order management
- 🔐 User registration and login
- 🤖 **AI assistant (Gemini)** that recommends hardware based on your needs and budget

## 🧠 The AI assistant

The assistant never makes up products. Here's how it works:

1. The user describes what they need.
2. The backend queries the catalog and sends it to Gemini along with the request.
3. Gemini returns a structured recommendation with the products and a reason for each.
4. The frontend renders cards for the real products together with the explanation.

The Gemini API key lives only on the server, never in the client.

## 🧰 Tech stack

| Layer | Technology |
|---|---|
| Frontend | Angular, TypeScript, Bootstrap |
| Backend | Python, Django, Django REST Framework |
| Database | PostgreSQL |
| AI | Google Gemini API |
| Environment | GitHub Codespaces + Dev Containers |
| Deployment | Vercel · Render |

## 📸 Screenshots

*Coming soon.*

---

<div align="center">

Made with 💜 and way too many hours of gaming by **[YOUR NAME](https://github.com/YOUR_USERNAME)**

</div>
