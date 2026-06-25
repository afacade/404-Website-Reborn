# 404 [Come Find Me] — Asset Manifest

Every image / video the site loads is referenced by a **named local path**
under `/assets/`. To replace a placeholder with your own media, drop a file
with the exact filename below into the matching folder. Anything you don't
provide renders as a dark diagonal-pattern block (handled in `css/style.css`)
so layouts stay legible during asset hand-off.

> File extensions are suggestions — if you save as `.png` or `.webp` instead
> of `.jpg`, update the `background-image: url('…')` reference in the
> corresponding HTML file to match. The same goes for `.mp4` / `.webm` if you
> want to swap any still for a looping video (see the *Video swap* note at the
> bottom).

---

## /assets/home  · used by `index.html`

The homepage (Performance Agency layout) features a **single featured
case study** in the middle of the page. The hero, services grid, and
process steps are typography-only — no images required.

| File | Section | Featured | Recommended size | Aspect |
|---|---|---|---|---|
| `home-featured-case-halcyon-records.jpg` | Featured case card (mid-page) | Halcyon Records — flagship artist launch | 1400×1000 | 4:3 |

The featured-case image sits in the left half of a split card; the right
half holds the client name, title, body copy, and three metric callouts
(2.4M streams, +218% follower growth, 14 press features). Choose imagery
that reads well at small-to-medium size and complements the dark UI.

### Brainstorm variants (`index-v2a.html`, `index-v2c.html`)

The archived brainstorm files use a **five-lane** layout instead. If you
want to preview them, drop the following images into `/assets/home/` —
they're shared between v2a and v2c.

| File | Lane | Featured | Size |
|---|---|---|---|
| `home-lane-01-videography-nick-emmanwori-nfl.jpg` | Videography & Edit | Nick Emmanwori — NFL reel | 1400×900 |
| `home-lane-02-brand-sujin-graphic-works.jpg` | Brand & Graphic | Sujin Studio — selected works | 1400×900 |
| `home-lane-03-web-sgf-sourcing-platform.jpg` | Websites & Commerce | Leslie / SGF Sourcing | 1400×900 |
| `home-lane-04-seo-indexable-imagery-library.jpg` | SEO & Technical | Imagery library | 1400×900 |
| `home-lane-05-photo-studio-photoshoots.jpg` | Photography & Ads | Studio photoshoots | 1400×900 |

---

## /assets/work  · used by `work.html`

The Work page (built on the **Portfolio C — Editorial Index** layout) has a
single hero/featured visual. The rest of the page is the typeset register
list — no other images required.

| File | Section | Featured | Recommended size | Aspect |
|---|---|---|---|---|
| `work-featured-nick-emmanwori-nfl-edit.jpg` | Featured commission card | Nick Emmanwori — NFL Combine & Draft Edit Reel | 2200×940 | 21:9 |

---

## /assets/about  · used by `about.html`

The About page has two editorial visuals plus seven team portraits (3
founding + 4 expanded). All portraits are framed in 4:3.

### Hero & feature

| File | Section | Recommended size | Aspect |
|---|---|---|---|
| `about-hero.jpg` | Page hero background (top of page) | 1600×900 | 16:9 |
| `about-feature-team-group.jpg` | Mid-page feature image (under the story) | 1200×675 | 16:9 |

### Founding team (3)

| File | Person | Role | Size | Aspect |
|---|---|---|---|---|
| `team-01-nam.jpg` | Nam | Website Developer / UX Designer | 600×450 | 4:3 |
| `team-02-david.jpg` | David | Videographer / Photographer | 600×450 | 4:3 |
| `team-03-noah.jpg` | Noah | Lawyer / Legal Advisor | 600×450 | 4:3 |

### Expanded team (4)

| File | Person | Role | Size | Aspect |
|---|---|---|---|---|
| `team-04-andrew.jpg` | Andrew | Illustrator / UX Designer | 600×450 | 4:3 |
| `team-05-cris.jpg` | Cris | Videographer / Photographer | 600×450 | 4:3 |
| `team-06-sujin.jpg` | Sujin | Website Developer / UX Designer | 600×450 | 4:3 |
| `team-07-romy.jpg` | Romy | Videographer / Photographer | 600×450 | 4:3 |

---

## /assets/services  · used by `services.html`

| File | Section | Suggested subject | Recommended size | Aspect |
|---|---|---|---|---|
| `services-hero.jpg` | Page hero background | wide brand/process shot | 1600×900 | 16:9 |
| `services-preview-01-videography.jpg` | Preview row, left tile | videography still / set photo | 800×600 | 4:3 |
| `services-preview-02-brand-graphic.jpg` | Preview row, center tile | brand / graphic work | 800×600 | 4:3 |
| `services-preview-03-web-photo.jpg` | Preview row, right tile | website screenshot or photo | 800×600 | 4:3 |

---

## /assets/contact

`contact.html` currently uses no imagery. If you want to add a hero or
sidebar image later, drop it here and wire it into `contact.html`.

---

## How to find every asset reference in the codebase

Each `background-image: url('assets/...')` in the HTML is preceded by a
`<!-- REPLACE: ... -->` comment naming the file, the section, and the
recommended dimensions. Search the project for `REPLACE:` to jump between
every replaceable asset:

```sh
grep -rn "REPLACE:" --include="*.html" .
```

---

## Video swap (optional)

Any still image above can be promoted to a looping video. To swap, replace
the `<div class="...">` element that owns the background-image with:

```html
<video class="…same class…" autoplay muted loop playsinline
       src="assets/<folder>/<filename>.mp4"
       poster="assets/<folder>/<filename>.jpg"></video>
```

…and add this to `css/style.css` so the video covers the frame the same way
the background-image did:

```css
.v2a-lane__work video,
.pc-featured__img video {
  width: 100%; height: 100%; object-fit: cover;
}
```

Common candidates for video swap:
- `home-lane-01-videography-nick-emmanwori-nfl.jpg` → highlight reel loop
- `work-featured-nick-emmanwori-nfl-edit.jpg` → 6–10s broll loop
- `about-hero.jpg` → ambient studio loop
