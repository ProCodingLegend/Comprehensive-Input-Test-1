# Source status

Target repo: https://github.com/ProCodingLegend/Comprehensive-Input-Test-1

This repository was created empty and seeded from this chat.

The Grok Build preview workspace is **not mounted** in the agent sandbox, so a byte-for-byte dump of every Vite/auth/route file from the running .grok.me app cannot be performed from here.

What is on `main` now:
- README.md
- src/lib/course.ts (18 units × 64 lessons per language)

The last complete course-list UI (18 hardcoded unit arrays, Full curriculum v3) is also on:
https://github.com/ProCodingLegend/star-leaf-slate-apple/blob/main/src/routes/lab.tsx

To finish the mirror on your machine:

```bash
git clone https://github.com/ProCodingLegend/star-leaf-slate-apple.git _full
git clone https://github.com/ProCodingLegend/Comprehensive-Input-Test-1.git dest
rsync -a --exclude .git --exclude node_modules --exclude .vercel _full/ dest/
cd dest
git add -A
git commit -m "Mirror full CI Language Lab app"
git push origin main
```
