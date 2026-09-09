# 2026 Fantasy Football Rankings

These are independently maintained 2026 fantasy football rankings for a half-PPR league with one quarterback, two running backs, three wide receivers, one tight end and one flex position.

## Latest rankings

The current rankings are in:

`data/current/2026_FantasyDraftRankings_Current.csv`

Every published update is also preserved in `data/snapshots/`. Snapshot files are never overwritten, which makes it possible to evaluate the rankings using only information that was available on the publication date.

## Current release

- Published: September 9, 2026
- Players ranked: 477
- Scoring: Half PPR
- ADP refreshed: September 9, 2026
- ADP sources: Yahoo, DraftKings, Underdog and NFC/NFFC
- Notable update: Brock Bowers moved from overall rank 34 to 40 after news of a meniscus procedure and an expected absence of one or two games. He remains TE2.

## Documentation

- [Methodology](docs/METHODOLOGY.md)
- [Data dictionary](docs/DATA_DICTIONARY.md)
- [Change log](CHANGELOG.md)
- [Publishing checklist](docs/PUBLISHING_CHECKLIST.md)

## Historical integrity

Each snapshot has a SHA-256 checksum in `manifest.json`. The checksum can be used to confirm that a downloaded file is identical to the originally published version.

Corrections are published as new snapshots. Historical files are not silently edited.

