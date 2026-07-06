FROM python:3.11-slim

# Создаем пользователя с ID 1000 (требование Hugging Face Spaces)
RUN useradd -m -u 1000 user
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

WORKDIR $HOME/app

# Копируем и устанавливаем зависимости
COPY --chown=user requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копируем код
COPY --chown=user src/ ./src/

EXPOSE 7860
ENV PORT=7860

CMD ["python", "src/calorie_bot.py"]
