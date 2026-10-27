# READ ME FIRST: rebuilding the MAIR Lab website, CV and weekly briefing

Written 26 October 2026. Keep this file at the top of OneDrive, and keep a personal copy (see Part 3).

## Part 1. What exists and where it lives

| Thing | Main copy | Also safe in |
|---|---|---|
| Website (themairlab.com): all code, text, data, scripts and the web-ready photos | GitHub repository `willmair/themairlab.com` | OneDrive `MAIR Lab Website/` |
| Rules for any AI assistant working on the site (`CLAUDE.md`) and the technical rebuild guide (`REBUILD.md`) | GitHub repository (kept off the public site) | OneDrive `MAIR Lab Website/` |
| CV (Word and PDF), older versions, CV rules and data | OneDrive `CV/` (start with `CV/_cv_source/CV_Maintenance_Notes.md`) | Nowhere else yet |
| Monday briefing instructions and your writing rules for AI | Laptop `~/.claude/` | OneDrive `Chief of Staff/` |
| Brand kit (logo, fonts, slide template) | OneDrive `MAIR Lab Brand/` | Nowhere else yet |
| Brand working files (logo and card builders) | OneDrive `MAIR Lab Website/brand/` | Nowhere else yet |
| Current lab headshots (originals) | OneDrive `Admin_WM+TK/Lab Headshots/` | Web versions on GitHub |
| Alumni headshots (originals) | OneDrive `01 Lab/Personnel Records (private)/_Alumni/<name>/` | Web versions on GitHub |
| Lab photos and your headshots (originals) | OneDrive `01 Lab/Photos & Headshots/` | Gallery web versions on GitHub |

The live website does not depend on OneDrive at all. It runs from GitHub. If everything else vanished,
themairlab.com would keep working.

## Part 2. Rebuilding on a new computer or with a new AI assistant

1. Get the files.
   - With OneDrive: sign in and let `MAIR Lab Website`, `CV` and `Chief of Staff` sync.
   - Without OneDrive: install the GitHub command line tool, run `gh auth login`, then
     `gh repo clone willmair/themairlab.com`. Then restore `CV`, `Chief of Staff` and the brand kit from
     your personal backup (Part 3).
2. Give the assistant its instructions. Open the website folder in Claude Code (or any coding assistant)
   and ask it to read `REBUILD.md` and `CLAUDE.md` first. Add the text of
   `Chief of Staff/Claude global instructions.md` to its global instructions.
3. Recreate the Monday briefing. Ask the assistant to create a scheduled task for Mondays at 7am using the
   text of `Chief of Staff/Weekly briefing setup.md`. It needs Outlook access for the email and calendar
   parts; the website and CV parts only need the files.
4. Check it works. Ask the assistant to preview the site locally, run the publications update, and
   publish a small test change. The site goes live about a minute after a push to GitHub.

## Part 3. If you lose Harvard (corporate) access to OneDrive and Outlook

### What would be lost, and what to copy out now

Only these are irreplaceable and exist solely in Harvard OneDrive. Together they are about 150 MB.

| Copy this | Size | Why |
|---|---|---|
| `CV/` (the whole folder) | 8 MB | Your CV, every prior version, and the rules and data that keep it accurate |
| `Chief of Staff/` | under 1 MB | Monday briefing instructions and your AI writing rules |
| `MAIR Lab Brand/` | 2 MB | Logo, fonts and slide template |
| `MAIR Lab Website/brand/` | 4 MB | Files that regenerate the logo and link-preview card |
| `01 Lab/Photos & Headshots/` | 135 MB | Original lab photos and your headshots |
| `Admin_WM+TK/Lab Headshots/` | 4 MB | Original current-member headshots |
| Alumni headshot images only (see the note below) | small | Originals of the alumni portraits |

You do not need to copy the website itself. It is all on GitHub.

Note on alumni headshots: they sit inside `Personnel Records (private)`, which also holds confidential
trainee records. Copy only the photos, not the folder. The web-ready versions are already on GitHub in
`assets/img/people/`, so the originals are a nice-to-have, not essential.

### Where to put the copies

Pick one place you own personally, outside Harvard:
- your personal Google Drive (you already have a `_Move to Google Drive (personal)` folder in OneDrive),
- or iCloud Drive,
- or a private GitHub repository (good for the CV and text files, less so for 135 MB of photos),
- and ideally also an external drive, updated every few months.

Check with Harvard policy before moving anything that is institutional rather than yours. Your CV, brand
kit, briefing setup and the lab website are yours; personnel records are not.

### Accounts that are tied to Harvard, and what to change

| Account or setting | Harvard dependency | What to do if access ends |
|---|---|---|
| Website hosting (GitHub `willmair`) | None if the GitHub account uses a personal email | Make sure GitHub has a personal email and two-factor recovery codes saved |
| Domain themairlab.com (Squarespace) | Possibly, if the Squarespace login or code email is Harvard | Confirm the Squarespace account email is personal |
| Contact form (Web3Forms) | Messages are delivered to your Harvard email | In the Web3Forms dashboard, change the recipient to a personal email |
| Google Search Console | Your Google login | Confirm it is a personal Google account |
| Claude account | If it uses your Harvard email, you could lose access | Make sure you can still sign in; your setup is recoverable from this file and GitHub either way |
| Monday briefing (email and calendar) | Reads Harvard Outlook | Point it at your new mailbox; the website and CV steps keep working |
| Site text | Says Harvard T.H. Chan School of Public Health throughout | Update the affiliation in `scripts/build.py` (footer) and page text if your position changes |

## Part 4. The one-command backup (set up 26 October 2026)

A script copies everything in the Part 3 table to **iCloud Drive > MAIR Lab Backup**, which syncs to your
Apple account, outside Harvard. Run it once a month (or after any CV update). In Terminal:

    bash "$HOME/Library/CloudStorage/OneDrive-HarvardUniversity/MAIR Lab Website/scripts/backup_to_icloud.sh"

Or ask your AI assistant: "run the iCloud backup". It takes under a minute.

What it does:
- refreshes the OneDrive copies of the Monday briefing instructions and your AI writing rules first;
- copies `CV`, `Chief of Staff`, `MAIR Lab Brand`, the whole `MAIR Lab Website` folder (including `brand/`),
  `01 Lab/Photos & Headshots` and `Admin_WM+TK/Lab Headshots`;
- copies only the headshot images from the alumni folders, never the confidential trainee records;
- only adds and updates files, never deletes from the backup, and writes the date to `backup-log.txt`.

If you reorganize OneDrive and a folder moves, the script says "Skipped (not found, maybe moved)". Ask your
assistant to update the folder list in `scripts/backup_to_icloud.sh`.

The first backup ran on 26 October 2026: 214 MB, the CV copy checked identical to the original.
