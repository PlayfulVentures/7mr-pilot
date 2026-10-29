#!/usr/bin/env bash
# Holt die Landingpage 1:1 von 7minutereset.de nach public/ und prüft jede Datei
# per SHA-1 gegen das Production-Deployment dpl_Gjfj3PEP9N4VrwDs6zsZhEuWS7es (29.10.2026).
# Vercel speichert als Datei-ID den SHA-1 des Inhalts, deshalb ist "Hash gleich" = "Byte gleich".
# Aufruf aus dem Repo-Root: bash scripts/import-landing.sh
set -euo pipefail
BASE="${BASE:-https://7minutereset.de}"
cd "$(dirname "$0")/.."
mkdir -p public
fail=0
# Datei | SHA-1 laut Deployment | URL-Pfad (cleanUrls: .html wird ohne Endung ausgeliefert)
while IFS='|' read -r file sha path; do
  [ -z "$file" ] && continue
  curl -fsSL "$BASE$path" -o "public/$file"
  got=$(sha1sum "public/$file" | cut -d' ' -f1)
  if [ "$sha" = "-" ]; then echo "ok (Build-Ergebnis, kein Hash) $file"
  elif [ "$got" = "$sha" ]; then echo "ok  $file"
  else echo "ABWEICHUNG $file: $got statt $sha"; fail=1; fi
done <<'EOF'
index.html|b2e1ddae0b4cbeffa99421c873414656d90cae8a|/
agb.html|c7fb23208639dc5ebb581a0c197330a8bbebea20|/agb
danke.html|4239b5b830fa24c9bfa0022205a8c0f0e206081a|/danke
datenschutz.html|e266074cd7bef2701130a6f3282f4bafcb1585ad|/datenschutz
impressum.html|4940f94beef81a242b2f57949c8b0aef79046aa5|/impressum
widerruf.html|89c09a77bb210db50e67258d37f90e6b1a5c9860|/widerruf
consent.js|9f21018a17ad39e2385927da16dd37746a06c41c|/consent.js
llms.txt|cd6c35c666eb56e38be2267ff11d5df02a8b96de|/llms.txt
robots.txt|877f7f00649200e2997436de612b9be3fddc5941|/robots.txt
sitemap.xml|643757a4389ab9039348c147096433651c669ef7|/sitemap.xml
icon.svg|3b7da13fc5346aa808fda9ba62a4f9bb33568cd5|/icon.svg
wa-glyph.svg|cf6214af44f03ae0ef5c40b7755f8e686d0a9121|/wa-glyph.svg
favicon.ico|49d33f47945a1303eba4b50602df2bee6dac38d7|/favicon.ico
apple-touch-icon.png|525bf83672502baf081efd7f6d6ba8cdfc644983|/apple-touch-icon.png
david.jpg|18e707840ae9fbdda4dd70e528a7af3941abcb54|/david.jpg
og.jpg|-|/og.jpg
EOF
exit $fail
