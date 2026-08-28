# Free Board (deal-4-you)

Бесплатная доска объявлений на GitHub Pages + GitHub Issues вместо backend/БД.

Объявления публикуются вручную владельцем проекта через GitHub Issue —
без регистрации, форм и модерационной панели. Подробности идеи и архитектуры:
[docs/free-classifieds-github-pages-summary.md](docs/free-classifieds-github-pages-summary.md).

Приложение также доступно как Telegram Mini App: [@deal_4u_bot](https://t.me/deal_4u_bot).

## Как это работает

```
GitHub Issue (title/body/labels/фото)
        │  workflow: issues opened/edited/closed/reopened
        ▼
.github/workflows/generate-listings.yml
        │  npm run generate:listings (scripts/generate-listings.ts, @octokit/rest)
        ▼
public/data/listings.json   ← коммитится в репозиторий Action'ом
        ▼
React SPA (Vite) читает listings.json и парсит поля на клиенте
```

- `scripts/generate-listings.ts` — выгружает все **открытые** issues репозитория,
  скачивает вложенные фото (markdown `![alt](url)` и HTML `<img src="...">` — GitHub вставляет
  то или другое в зависимости от способа загрузки), ресайзит/сжимает через `sharp` (до 1600px,
  JPEG q82/mozjpeg, авто-поворот по EXIF) и кладёт в `public/images/<номер issue>-image-NN.<ext>`,
  переписывая ссылки в `body` на локальные имена файлов (идемпотентно — уже скачанные не трогает).
  Пишет результат в `public/data/listings.json`.
- `src/services/listingsService.ts` — на клиенте разбирает `body` по секциям
  `## Description`, `## Price`, `## Contact`, `## Images`/`Photos`/`Фото`, и достаёт
  город/категорию/статус из labels вида `city:berlin`, `category:electronics`, `status:active`.
- `src/App.tsx` + `src/router.ts` — самописный роутинг по реальным путям (`history.pushState`,
  без React Router): `/` и `/listing/:number` → `HomePage` (второй открывает объявление в
  модалке и обновляет `document.title`), `/donate` → `DonatePage`, всё остальное → `NotFoundPage`.
  `public/404.html` + скрипт в `index.html` — стандартный трюк
  [spa-github-pages](https://github.com/rafgraph/spa-github-pages) для GitHub Pages: прямой
  заход на `/listing/152` (без единой точки входа на сервере) редиректит через `404.html`
  обратно в `index.html` с восстановлением пути.
- `scripts/prerender-listings.ts` (запускается как `postbuild` после `vite build`) — генерирует
  статический `dist/listing/<number>/index.html` на каждое объявление: реальный title/description/
  OG-теги/canonical + JSON-LD (`schema.org/Product`) + видимый HTML-блок с текстом объявления
  (`#prerendered`). Нужен для краулеров, которые **не выполняют JS** (GPTBot, ClaudeBot, CCBot и
  большинство AI-ботов) — им иначе достаётся пустой `<div id="root"></div>`. При гидратации
  React (`src/main.tsx`) удаляет `#prerendered` и рендерит обычный интерактивный UI поверх.
  Главная страница (список объявлений) прероста не имеет — это следующий шаг, если понадобится.
- `public/llms.txt` / `public/llms-full.txt` (генерируются в `generate-listings.ts`, конвенция
  [llmstxt.org](https://llmstxt.org)) — краткий индекс со ссылками и полный текстовый дамп всех
  активных объявлений соответственно, для AI-агентов, которым проще прочитать один текстовый
  файл, чем ходить по HTML-страницам.

## Формат объявления (GitHub Issue)

Labels: `city:<город>`, `category:<категория>`, `status:<active|sold|expired>`
(см. [docs/statuses.md](docs/statuses.md) за актуальным списком значений).

Body (markdown-секции, распознаются `getSection()` по заголовку `##`):

```markdown
## Description
Свободный текст описания.

## Price
€650

## Contact
Telegram: @username
Phone: +49...

## Images
![alt](https://.../photo1.jpg)
https://.../photo2.jpg
```

`ContactLinks` дополнительно умеет распознавать Telegram/Viber/телефон из
секции Contact и рендерить кликабельные кнопки.

## Разработка

```bash
npm install
npm run dev              # Vite dev server
npm run build             # production build → dist/
npm run generate:listings # локальная генерация listings.json (нужны GITHUB_TOKEN, GITHUB_REPOSITORY)
```

`vite.config.ts` использует `base: "/deal-4-you/"` — сборка рассчитана на публикацию
в GitHub Pages по пути `/deal-4-you/`.

## Документация

- [docs/free-classifieds-github-pages-summary.md](docs/free-classifieds-github-pages-summary.md) — архитектурная идея и стратегия (MVP → рост).
- [docs/statuses.md](docs/statuses.md) — справочник значений labels (город/категория/статус).
