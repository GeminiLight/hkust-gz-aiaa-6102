# AIAA 6102 (T01) — Artificial Intelligence Seminar II Website

A clean, academic public website for the HKUST(GZ) AIAA 6102 (T01) seminar course.

## Live Site

After deployment:

```
https://<your-username>.github.io/AIAA_6102_Artificial_Intelligence_Seminar_II/
```

Replace `<your-username>` and the repo name as needed.

## Tech Stack

- Static HTML5
- Tailwind CSS via CDN
- Vanilla JavaScript
- GitHub Pages hosting

No build step is required.

## Local Preview

Because the site loads local assets, use a small static server:

```bash
cd /Users/geminilight/projects/campus/ai-seminar-ta
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

Alternatively, use the VS Code **Live Server** extension.

## File Structure

```
.
├── index.html              # Main page — edit this for content updates
├── css/
│   └── custom.css          # Minor style overrides
├── js/
│   └── main.js             # Theme toggle, mobile nav, avatar initials, current-week highlight
├── images/
│   ├── favicon.svg         # Site icon
│   ├── staff/
│   │   └── yingcong-chen.png   # Instructor photo
│   └── speakers/
│       └── li-jiang.png    # Speaker photos (add more here)
├── syllabus.pdf            # Replace with the official syllabus PDF
└── README.md               # Deployment and update instructions
```

## How to Update Each Week

1. Add the speaker's photo to `images/speakers/` (e.g., `wang-guangrun.png`).
2. Open `index.html`.
3. Find the corresponding week card in the `Seminar Schedule` section.
4. Replace placeholder text:
   - Speaker name, affiliation, email
   - Talk title
   - Tags
   - Abstract and bio
   - Photo path (`src="images/speakers/..."`)
   - Article / slides links
5. Save, commit, and push:

```bash
git add .
git commit -m "Add week N speaker: Speaker Name"
git push origin main
```

GitHub Pages will update automatically within about a minute.

## Current-Week Highlight

Each seminar card has a `data-date` attribute. The JavaScript automatically highlights the most recent or upcoming week with a blue left border and a "This Week" / "Up Next" badge. No manual update is needed unless the schedule changes.

## Items to Confirm / Replace Before Going Live

- [x] Course code updated to AIAA 6102
- [x] Course title updated to Artificial Intelligence Seminar II
- [x] Week 1 abstract and bio for Li Jiang
- [x] Week 1 speaker photo: `images/speakers/li-jiang.png`
- [x] Instructor photo: `images/staff/yingcong-chen.png`
- [x] Zoom link in the hero and featured panel

## Deployment to GitHub Pages

1. Create a new public repository on GitHub (e.g., `AIAA_6102_Artificial_Intelligence_Seminar_II`).
2. Push this folder to the `main` branch.
3. Go to **Settings → Pages** in the repo.
4. Source: **Deploy from a branch** → `main` → `/ (root)`.
5. Save and wait ~1 minute for the site to go live.

## Contact

- Instructor: [Yingcong Chen](https://www.yingcong.me/) — yingcongchen@hkust-gz.edu.cn
- TA: Yan Rong — yrong854@connect.hkust-gz.edu.cn
- TA: Tianfu Wang — twang566@connect.hkust-gz.edu.cn
