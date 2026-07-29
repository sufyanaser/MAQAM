# MAQAM Lab

تطبيق سطح مكتب لتحليل المقامات العربية، عرض درجات السلم وأرباع التون، وتقديم إعدادات مساعدة للعمل داخل Cubase.

## التشغيل أثناء التطوير

```bash
npm install
npm run dev:desktop
```

## التحقق

```bash
npm run check
npm run build
```

## إنشاء نسخة Windows

من جهاز Windows:

```bash
npm ci
npm run desktop:win
```

ينتج ملف التثبيت داخل مجلد `release`.

يمكن أيضاً تشغيل Workflow باسم **Build Windows Desktop** من تبويب Actions في GitHub. بعد نجاحه، تُحمّل نسخة EXE من قسم Artifacts.

## البنية

- `App.tsx` و`components/`: واجهة React.
- `electron/`: نافذة سطح المكتب وإعدادات الأمان.
- `dist/`: ناتج Vite، ويعمل دون اتصال بالإنترنت.
- `release/`: حزم سطح المكتب الناتجة محلياً.
