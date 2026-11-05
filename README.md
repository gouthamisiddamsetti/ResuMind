# ResuMind

ResuMind is a browser-based resume analyzer and job-match optimizer. It helps you review resume content, compare it with a job description, and explore ways to improve your ATS readiness.

## Features

- Resume analysis and job-description matching
- Example resume presets for software engineering, data, students, and an unoptimized sample
- Interactive recommendations and analysis views
- Exportable analysis report
- Optional Gemini AI deep analysis using an API key you provide
- Dark interface designed for desktop and mobile browsers

## Run locally

This project is a standalone HTML application. No build step or package installation is required.

1. Download or clone this repository.
2. Open `index.html` in a modern browser.

To serve it over localhost, run this from the repository directory:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000>.

The page loads Tailwind CSS, Font Awesome, and the PDF export library from public CDNs, so those features require an internet connection.

## Optional Gemini AI analysis

The AI analysis feature is optional. Add your own Gemini API key through the app's AI settings when you want to use it. The page stores the key in your browser's local storage and sends it to the Google Gemini API when you request AI analysis. Do not use this feature on a shared or untrusted browser, and do not commit API keys to this repository.

## Privacy

Resume content is analyzed in the browser by the built-in analyzer. If you choose Gemini AI analysis, the relevant resume and job-description content is sent to Google's Gemini API. Review the provider's privacy terms before submitting personal information.

## Notes

- This is a career-support tool, not a guarantee of ATS ranking, interview selection, or employment.
- Review generated suggestions and ensure your resume remains accurate and truthful.
