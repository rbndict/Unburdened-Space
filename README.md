# Unburdened Space

_A calm corner of the internet, made for the moments when your mind won't slow down._

Sometimes thoughts pile up faster than you can deal with them. Unburdened Space is a small, quiet web page built for exactly those moments. It gives you three simple things to do: a place to write down what's weighing on you and let it go, a breathing circle to follow when your chest feels tight, and a gentle quote to remind you that you're not alone in this. That's all it tries to be — no accounts, no feeds, no noise.

Everything here was designed to feel soft. Sage greens, ocean blues, warm sand tones, and a rounded typeface instead of sharp edges. There are no pure blacks or harsh contrasts anywhere on the page, because the last thing an anxious mind needs is a screen shouting at it.

## What's inside

**The Brain Dump** — A quiet textarea where you can pour out whatever is circling in your head. When you're ready, press _Release_ and watch the text blur, fade, and dissolve. It's a small ritual, but a surprisingly effective one.

**Breathe With Me** — A softly glowing circle that expands as you inhale (4 seconds), pauses while you hold (4 seconds), and shrinks as you exhale (6 seconds). You can start and pause whenever you like. There's no score, no streak, no pressure.

**A gentle thought** — A calming quote fetched from the [ZenQuotes API](https://zenquotes.io), refreshed whenever you want. If you're offline or the service is unreachable, the page quietly falls back to a small collection of quotes built right into the code, so you're never left staring at an error message.

## Privacy, honestly stated

This is the part that matters most: **your thoughts never leave your device.** The Brain Dump text lives only in the page's memory for as long as you're looking at it. It isn't stored, isn't logged, isn't sent to any server — not even to your own browser's storage. When you press Release, it is simply gone.

The page makes exactly one network request (the quote fetch), uses no cookies, no analytics, no tracking scripts, and no external icon or font files beyond Google Fonts and Bootstrap's stylesheet.

## Running it

No build steps, no dependencies to install. Just open `index.html` in any modern browser and it works.

If you'd like to serve it properly (for example, so the quote API works without any CORS quirks), you can run any static server from this folder:

```bash
python -m http.server 8000
```

then visit `http://localhost:8000`.

## The files

| File         | What it does                                              |
| ------------ | --------------------------------------------------------- |
| `index.html` | The page itself — structure, layout, and inline SVG icons |
| `styles.css` | The calming theme layered over Bootstrap 5                |
| `script.js`  | The three features — brain dump, breathing, quotes        |

## Making it yours

The color palette lives entirely in the `:root` block at the top of `styles.css`, so re-theming the whole page is a matter of changing a dozen variables. The breathing rhythm is defined in one array (`BREATH_PHASES`) in `script.js` — you can slow it down or speed it up to whatever pace feels right for you.

---

_This is a safe space. Your thoughts are processed locally on your device and are never saved or shared._
