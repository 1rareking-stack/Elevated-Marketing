# Elevated Ad Studio

Elevated is a polished, local-first creative workspace prototype for turning campaign briefs into editable ad concepts. It includes a responsive public website and a functional studio experience that runs without external credentials.

## What works

- Responsive marketing landing page with product narrative, social proof, workflow, results, and conversion sections
- Desktop and mobile navigation with accessible controls
- Studio overview with projects, asset counts, and demo performance indicators
- Two-step campaign brief flow with required-field validation
- Deterministic, in-browser concept generation (three structured variants per project)
- Project editor with live headline and body-copy updates, format and angle controls, concept switching, approvals, copy, and JSON export
- Projects and brand settings persisted to browser `localStorage`
- Editable brand name, voice guidance, color and typography direction
- Creative insights dashboard populated from local project concepts and clearly labeled demo performance data
- Responsive studio shell, mobile sidebar, and mobile editor layout

## Stack

- React 19
- TypeScript 6
- Vite 8
- Tailwind CSS 4 (design token/tooling layer)
- React Router 7
- Lucide icons
- ESLint 10

## Local setup

Requires Node.js 22+ and npm 10+.

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. No environment variables, external accounts, or paid services are required.

## Checks

```bash
npm run lint
npm run build
# or both
npm run check
```

## Current limitations

- Concept generation is deterministic demo logic, not an AI provider integration.
- Projects and brand settings are browser-local; there is no authentication, database, or team sync.
- Performance metrics are illustrative and do not connect to ad platforms.
- Export currently produces structured JSON, not rendered PNG, video, or platform-specific ad packages.
- Search, messages, project filters, and the studio preview control are presentational foundations.

## Suggested next steps

1. Add authentication, workspace membership, and durable project storage.
2. Connect a server-side model gateway for concept generation with structured outputs and moderation.
3. Add an asset upload pipeline, image generation, and a render/export service.
4. Integrate ad-platform performance ingestion and replace demo metrics.
5. Add component and end-to-end regression tests before production release.