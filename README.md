# AIAA 6102 (T01) — Artificial Intelligence Seminar II Website

A clean, academic public website for the HKUST(GZ) AIAA 6102 (T01) seminar course.

## Live Site

Deployed on Vercel:

```
https://hkust-gz-aiaa-6102.vercel.app
```

## Tech Stack

- Static HTML5
- Tailwind CSS via CDN
- Vanilla JavaScript
- GitHub + Vercel hosting

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

Vercel will update automatically within about a minute.

## Deployment to Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard) and sign in.
2. Click **Add New… → Project**.
3. Find and select the GitHub repository `GeminiLight/hkust-gz-aiaa-6102`.
4. Click **Import**.
5. Project Name should already be `hkust-gz-aiaa-6102`. Framework Preset will be detected automatically (Other / Static).
6. Click **Deploy**.
7. After deployment, the site will be live at `https://hkust-gz-aiaa-6102.vercel.app`.

From then on, every `git push origin main` will automatically redeploy the site.

## Contact

- Instructor: [Yingcong Chen](https://www.yingcong.me/) — yingcongchen@hkust-gz.edu.cn
- TA: Yan Rong — yrong854@connect.hkust-gz.edu.cn
- TA: Tianfu Wang — twang566@connect.hkust-gz.edu.cn
