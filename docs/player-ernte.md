# Player-Ernte: was der Pilot-Player vom alten übernimmt

Quelle: `PlayfulVentures/7minuteReset` @ `b9999a1` (28.10.2026), `apps/webapp/src/components/session/`.
Regel für den Pilot: drin ist nur, was Tag 1 am 23.11. braucht.

## Übernehmen

| Was | Woher | Warum |
|---|---|---|
| Segmente `intro` / `exercise` / `outro` mit `title`, `cue`, `equipment`, `pauseAfterSec`, `video` | `lib/session/types.ts` (`ResolvedSegment`) | wird das Format der `session.json` |
| Session gilt am Ende der letzten Übung als erledigt, danach direkt das Outro ohne Pause | `player/playback-utils.ts` (`clipEnd`) | wer das Outro abbricht, hat trotzdem geschafft |
| Fortschrittsbalken: ein Segment je Clip, Intro und Outro schmal; der Zähler zählt nur Übungen | `player/exercise-count.ts` | bewährt, Founder-Entscheid 05.10. |
| Pausenkarte „Als Nächstes · N von M“, Titel, Hinweis, Ausrüstung, Knopf „Weiter in N Sek · oder jetzt starten“ mit Füllung | `player/RestBridge.tsx` | das ist die Karte aus dem Video |
| Steuerung blendet nach 3 s Wiedergabe aus, bleibt bei Pause sichtbar | `useChromeVisibility.ts` | ruhiges Bild beim Mitmachen |
| Bildschirm bleibt an (Wake Lock), Pause wenn der Tab verschwindet | `useWakeLock.ts`, `useSessionPlayback.ts` | sonst geht das Handy mitten in der Übung aus |
| Fehler mit „Erneut versuchen“; abgelehntes `play()` → „Wiedergabe blockiert. Bitte erneut tippen.“ | `useSessionPlayback.ts` | iOS lehnt `play()` ohne Tipp ab |
| Messen: nie Telefonnummer oder Name im Event, Messen blockiert nie die Seite, ein Schlüssel gegen Doppelzählung | `lib/analytics/` | gilt unverändert |
| Clip-Format: H.264/AAC, MP4 mit `faststart`, Poster-JPG | `services/video-transcode/` | iPhone liefert HEVC, das muss umgewandelt werden |

## Anders machen (Lücken im alten Player)

1. **Kein Vorladen.** Ein `<video>` mit `preload="metadata"`, pro Übung neue Quelle plus `load()`. Neu: Der nächste Clip lädt, während die Pausenkarte läuft.
2. **Die Pause hängt das Video aus, danach startet nichts von selbst.** Die Pause ist ein eigener Screen ohne `<video>`. Nach dem Countdown steht `setPlaying(false)`, also muss man jede Übung antippen, fünfmal pro Session. Neu: Das Video bleibt im Bild, die Pausenkarte liegt darüber, danach geht es automatisch weiter. Annahme [unverified, auf dem iPhone testen]: Ein Video-Element, das einmal per Tipp gestartet wurde, darf danach ohne Tipp weiterspielen.
3. **Keine Töne.** Neu: Holz-Töne über Web Audio, beim ersten Tipp freigeschaltet.
4. **Keine Untertitel.** Neu: eine VTT-Datei pro Clip, als eigenes Overlay gezeichnet, damit es auf iOS und Android gleich aussieht.
5. **Keine Haltezeit.** Neu: der 60-Sekunden-Ring nur dort, wo `hold` in der JSON steht (echte Haltezeit).
6. **Zeit-Ersatz.** Ohne Video läuft 45 Sekunden ein Timer und tut so, als liefe die Übung. Neu: weglassen, Fehler zeigen.

## Später (nicht im Pilot)

Schwierigkeitsstufen und Signale „zu leicht/zu schwer“, Erklärvideos (S9), Info- und Schmerz-Sheet (S3), Übungsliste (S4), Beenden-Dialog (S5), Spulen per Doppeltipp, Zeitregler, Fortsetzen nach Neuladen, Ambient-Hintergrund für Desktop, Login und signierte URLs, Trainer-Vorschau, Fertig-Kugel und Konfetti.

## Events im Pilot

`session_geoeffnet`, `uebung_gestartet {i}`, `uebung_beendet {i}`, `session_beendet {dauer_sek}`. Ein Abbruch wird abgeleitet: die letzte gestartete Übung ohne „beendet“. Ziel ist eine Supabase-Tabelle, in die der Browser nur schreiben kann.

## Offen für David

- **Gesundheitshinweis vor Tag 1** (alter S10): Für den Pilot Pflicht? Vorschlag: ein Textscreen vor der ersten Session, Wortlaut aus `new/7mr-compliance-guardrails.md`.
- **Persönlicher Link:** Der Token ordnet nur die Messung zu und öffnet nichts. Ein weitergeleiteter Link zählt also falsch, gibt aber keinen Zugang, weil es kein Konto gibt. Damit greift das Risiko aus ADR-063 hier nicht.
