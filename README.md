---
title: Calorie Bot
emoji: 🤖
colorFrom: blue
colorTo: green
sdk: docker
pinned: false
app_port: 7860
---

# Calorie Bot & Web App

This repository contains the backend and frontend code for the Calorie Tracking Telegram Bot and Web Application.

## Architecture
- `backend/` - Telegram bot and backend processing in Python
- `frontend/` - React frontend application for the Telegram Mini App

## Setup

### Backend
1. Copy `.env.example` to `.env` and fill in your keys.
2. Install dependencies: `pip install -r requirements.txt`
3. Run the bot: `python calorie_bot.py`

### Frontend
1. Navigate to the `frontend` directory.
2. Run `npm install`
3. Run `npm run dev` to test locally or deploy to Vercel using `vercel`.
