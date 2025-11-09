 # 🤖 SpectateAI — Context-Aware Chatbot AI

SpectateAI is a real-time, context-aware AI chatbot built with **Node.js**, **Google Gemini**, **Transformers.js (ONNX)**, and **Pinecone**.  
It remembers previous interactions using vector embeddings, enabling intelligent and human-like conversations.

---

## 🌟 Overview

SpectateAI is designed to act as an intelligent chatbot that:
- Understands conversations with context.
- Stores past messages in a vector database.
- Uses embeddings to recall relevant past information.
- Generates accurate and human-like replies using Gemini.

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-------------|
| **Language** | Node.js |
| **Backend Framework** | Express.js |
| **Real-Time Communication** | Socket.IO |
| **AI Model** | Google Gemini |
| **Embeddings** | Transformers.js + ONNX (`all-MiniLM-L6-v2`) |
| **Vector Database** | Pinecone |
| **Database** | MongoDB |
| **Authentication** | JWT (Cookies-based) |

---

## 📂 Folder Structure (line by line)

models/  
└── LLM/  
node_modules/  
src/  
controllers/  
auth.controller.js  
chart.controller.js  
db.js  
middleware/  
auth.middleware.js  
models/  
chart.model.js  
message.model.js  
user.model.js  
routes/  
auth.route.js  
chart.route.js  
services/  
ai.service.js  
vector.service.js  
sockets/  
socket.server.js  
app.js  
server.js  
.env  
.gitignore  
package.json  
package-lock.json

---

## 🔑 Environment Variables

All sensitive configurations are stored in `.env`:

- **PORT** → Server port (e.g. `8000`)
- **MONGODB_URI** → MongoDB connection string
- **GEMINI_API_KEY** → Google Gemini API key
- **PINECONE_API_KEY** → Pinecone API key
- **PINECONE_INDEX_NAME** → Pinecone index name
- **JWT_SECRET** → Secret key for token authentication

---

## 🧠 How SpectateAI Works

1. **User sends a message** through Socket.IO.  
2. The message is converted into a **vector embedding** using `Transformers.js` (ONNX model).  
3. The embedding is **stored** in **Pinecone** for long-term memory.  
4. Before generating a response, SpectateAI **queries Pinecone** to find related messages.  
5. The **context + user query** are sent to **Gemini**.  
6. Gemini generates a **context-aware response**.  
7. The AI’s response is also **stored back** into Pinecone for future reference.

This continuous learning loop helps SpectateAI remember past interactions and build personalized responses.

---

## 🧩 Core Features

✅ Real-time AI chat using Socket.IO  
✅ Contextual understanding powered by Pinecone memory  
✅ Gemini-based intelligent responses  
✅ Secure JWT authentication  
✅ ONNX embeddings with Transformers.js  
✅ Scalable modular architecture  
✅ MongoDB data persistence  

---

## 🚀 Setup Guide

1. Clone the repository  
2. Install dependencies (`npm install`)  
3. Create `.env` with required keys and URLs  
4. Start the server (`npm start`)  
5. Visit `http://localhost:8000`

---

## 📊 Key Components

- **AI Service** — Gemini responses + Transformers.js embeddings  
- **Vector Service** — Pinecone storage and search  
- **Socket Server** — Real-time message handling and AI responses  
- **Models** — MongoDB schemas for users, messages, chats  
- **Middleware** — Authentication and validation

---

## 🧩 Embedding Model (ONNX)

**Base Model:** `sentence-transformers/all-MiniLM-L6-v2`  
**Library:** `@huggingface/transformers`  
**Format:** ONNX (optimized for JavaScript)  
**License:** Apache-2.0

---

## 💬 Example Use Cases

- AI Tutor that remembers previous lessons  
- Customer support chatbot with memory  
- Personal assistant that adapts over time  
- Knowledge management bot with context retrieval  

---

## 🏗 Future Enhancements

- User-specific vector memory separation  
- Integration with LangChain for advanced retrieval  
- Context summarization for long chats  
- Multi-model support (e.g., Gemini + Claude hybrid)  
- Web dashboard for analytics and memory insights  

---

## 📜 License

**MIT © 2025 Abdul Muqeet (mqt)**

> SpectateAI — Making AI Conversations Smarter with Memory 🧠
