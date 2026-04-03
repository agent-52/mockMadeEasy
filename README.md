# AI Mock Interview Platform

An AI-powered platform that simulates real technical interviews with voice interaction, evaluates responses, and provides detailed feedback with performance analytics.

## 🚀 Demo
- Live: https://mock-made-easy.vercel.app/
- Video: upcoming

## 📸 Screenshots
<img width="1919" height="905" alt="Screenshot 2026-04-03 141842" src="https://github.com/user-attachments/assets/4e177559-db1c-4bcf-ab8f-45d17ebd226a" />
<img width="1919" height="964" alt="Screenshot 2026-04-03 142034" src="https://github.com/user-attachments/assets/193937b9-a532-4985-a122-04b57e3d33de" />
<img width="1919" height="948" alt="image" src="https://github.com/user-attachments/assets/b2bd7e68-2aa7-48fb-998c-7f750fcd801a" />
<img width="1919" height="909" alt="image" src="https://github.com/user-attachments/assets/0d805b31-a85d-459d-8fc5-78d459037a83" />

## ❓ Problem
Most candidates struggle with interviews due to lack of realistic practice and structured feedback. Existing platforms are either static or lack real-time evaluation.

## 💡 Solution

This platform simulates real interview environments using AI:
- Voice-based interaction (like real interviews)
- Dynamic question flow
- AI evaluation with detailed feedback
- Performance tracking dashboard

## ✨ Features

- 🎤 AI voice interviewer (TTS + STT)
- 🧠 AI-based answer evaluation
- 📊 Performance analytics dashboard
- 🧩 Dynamic question generation

## 🛠 Tech Stack

Frontend:
- React

Backend:
- Express

Database:
- PostgreSQL
- Prisma ORM

AI & Voice:
- Groq api
- Deepgram (Speech-to-Text)
- TTS Service

## 🏗 Architecture

- Client sends audio → Backend
- Backend processes via STT (Deepgram)
- Text sent to AI evaluation service
- AI returns structured feedback
- Stored in PostgreSQL
- Dashboard visualizes performance

## 🧪 Run Locally

```bash
git clone https://github.com/your-repo
cd project

npm install
npm run dev
```
## 🚧 Roadmap

- CV-based interview generation
- Coding question evaluation
- Real-time follow-up questions
- Self-hosted Whisper integration

## ⚖️ Tradeoffs

- Used external STT (Deepgram) for MVP instead of Whisper due to latency constraints

## 👤 Author

Abhay Bhadauriya  
GitHub: https://github.com/agent-52
