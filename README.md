# 7mr-pilot

Landingpage (7minutereset.de) und Session-Player für den 14-Tage-Pilot ab 23.11.2026.

- `public/`: Landingpage, statisch, ohne Build. Kommt 1:1 aus dem Production-Deployment `dpl_Gjfj3PEP9N4VrwDs6zsZhEuWS7es`.
- `docs/player-ernte.md`: was der neue Player vom alten übernimmt.
- Player: folgt.

## Deploy

Vercel-Projekt `7mr-pilot`. Production nur mit Founder-OK.

## Landing importieren

`bash scripts/import-landing.sh` holt alle Dateien von 7minutereset.de und prüft jede per SHA-1 gegen das Deployment. Alternativ macht das der Workflow `Landing importieren`.

Das OG-Bild liegt als fertiges `og.jpg` in `public/`. Die SVG-Vorlage und das Build-Skript dafür sind nur im alten Deployment vorhanden und hier nicht übernommen. Damit braucht die Seite keinen Build mehr.
