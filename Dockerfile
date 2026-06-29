# רוני סטודיו — image לפריסה ב-Render (Node + Python + ffmpeg למנוע ההפקה)
FROM node:20-bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 python3-pip ffmpeg fonts-dejavu fonts-liberation \
    && rm -rf /var/lib/apt/lists/*
RUN pip3 install --no-cache-dir --break-system-packages pillow python-bidi

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# שמירת עותק seed — הדיסק הקבוע יותקן על /app/data ויתחיל ריק
RUN cp -r /app/data /app/seed
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENV NODE_ENV=production
ENV RONNY_AVATAR=/app/engine/profile.jpg
EXPOSE 10000
ENTRYPOINT ["/entrypoint.sh"]
