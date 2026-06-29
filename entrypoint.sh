#!/bin/sh
set -e
# אם הדיסק הקבוע ריק (פריסה ראשונה) — מזריעים את נתוני ההתחלה
if [ -z "$(ls -A /app/data 2>/dev/null)" ]; then
  echo "Seeding /app/data from /app/seed ..."
  cp -r /app/seed/* /app/data/ 2>/dev/null || true
fi
exec npm run start -- -p "${PORT:-10000}"
