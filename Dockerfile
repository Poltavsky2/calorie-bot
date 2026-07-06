FROM python:3.11-slim

WORKDIR /app

# Копируем файл зависимостей и устанавливаем их
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копируем исходный код бота
COPY src/ ./src/

# Указываем порт 7860 (Hugging Face Spaces требует, чтобы сервер слушал именно этот порт)
EXPOSE 7860
ENV PORT=7860

# Запускаем бота
CMD ["python", "src/calorie_bot.py"]
