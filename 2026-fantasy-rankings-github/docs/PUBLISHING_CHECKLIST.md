# Browser-only GitHub publishing checklist

No command line is required.

## First publication

1. Sign in to GitHub.
2. Select the plus sign in the upper-right corner and choose **New repository**.
3. Enter `2026-fantasy-rankings` as the repository name.
4. Add the description: `Versioned 2026 half-PPR fantasy football rankings and evaluation data.`
5. Choose **Public** if the rankings should be available to everyone.
6. Leave the automatic README, `.gitignore` and license options unchecked because this package already contains a README.
7. Select **Create repository**.
8. On the new repository page, choose **uploading an existing file**.
9. Unzip the publishing package on your computer, then drag all of its contents—not the enclosing folder—onto the upload page.
10. Enter the message `Publish September 9 rankings` and select **Commit changes**.

## Create the first fixed release

1. Open the repository's **Releases** section.
2. Select **Draft a new release**.
3. Create the tag `2026-09-09`.
4. Use the title `September 9, 2026 rankings`.
5. In the description, summarize the Bowers injury adjustment and the ADP refresh.
6. Attach `data/snapshots/2026-09-09_bowers-injury-update.csv`.
7. Publish the release.
8. In repository settings, enable release immutability if the option is available. Prepare future releases as drafts before publishing because their files cannot be replaced after an immutable release is published.

## Future ranking updates

1. Never edit an existing file inside `data/snapshots/`.
2. Download or prepare the new rankings using the same column structure.
3. Give the snapshot a date-first name such as `2026-09-15_week-1-update.csv`.
4. Replace the file in `data/current/` with the new current version.
5. Add an entry to `CHANGELOG.md` listing the old rank, new rank and reason for each material change.
6. Upload the new snapshot, updated current file and change log together.
7. Create a new release for important checkpoints such as final preseason, Week 4, midseason and final results.

## Optional public rankings page

After the data repository is working, GitHub Pages can be added as a second step. Keep the CSV snapshots as the source of truth; the webpage should read from or link to those files rather than maintaining a separate set of rankings.

