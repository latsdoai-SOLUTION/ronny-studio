#!/bin/sh
set -e
# פריסה ראשונה: הדיסק ריק → מזריעים את כל נתוני ההתחלה
if [ -z "$(ls -A /app/data 2>/dev/null)" ]; then
  echo "Seeding /app/data from /app/seed ..."
  cp -r /app/seed/* /app/data/ 2>/dev/null || true
fi
# כל פריסה: ממזגים לידים חדשים מה-seed לדיסק (בלי למחוק קיימים/סטטוסים)
node /app/scripts/seed-merge.mjs || echo "seed-merge skipped"
exec npm run start -- -p "${PORT:-10000}"
