#!/bin/bash
# Copy everything that lives only in Harvard OneDrive to iCloud Drive > MAIR Lab Backup.
#
# Usage:  bash scripts/backup_to_icloud.sh
#
# Safe to run any time: it only adds and updates files in the backup, never deletes them, and never
# copies the confidential trainee records (only the alumni headshot images). See BACKUP.md.
set -euo pipefail

ONEDRIVE="$HOME/Library/CloudStorage/OneDrive-HarvardUniversity"
DEST="$HOME/Library/Mobile Documents/com~apple~CloudDocs/MAIR Lab Backup"

if [ ! -d "$ONEDRIVE" ]; then echo "OneDrive folder not found: $ONEDRIVE"; exit 1; fi
if [ ! -d "$(dirname "$DEST")" ]; then echo "iCloud Drive not found. Turn on iCloud Drive in System Settings."; exit 1; fi
mkdir -p "$DEST"

# 1. Refresh the OneDrive copies of the laptop-only setup (briefing instructions, writing rules).
mkdir -p "$ONEDRIVE/Chief of Staff"
[ -f "$HOME/.claude/scheduled-tasks/weekly-chief-of-staff/SKILL.md" ] && \
  cp "$HOME/.claude/scheduled-tasks/weekly-chief-of-staff/SKILL.md" "$ONEDRIVE/Chief of Staff/Weekly briefing setup.md"
[ -f "$HOME/.claude/CLAUDE.md" ] && cp "$HOME/.claude/CLAUDE.md" "$ONEDRIVE/Chief of Staff/Claude global instructions.md"

# 2. Whole folders: OneDrive path, then name inside the backup.
FOLDERS=(
  "CV|CV"
  "Chief of Staff|Chief of Staff"
  "MAIR Lab Brand|MAIR Lab Brand"
  "MAIR Lab Website|MAIR Lab Website"
  "01 Lab/Photos & Headshots|Photos & Headshots"
  "Admin_WM+TK/Lab Headshots|Current lab headshots"
)
for pair in "${FOLDERS[@]}"; do
  src="$ONEDRIVE/${pair%%|*}"; name="${pair##*|}"
  if [ -d "$src" ]; then
    echo "Copying $name ..."
    rsync -a --exclude ".DS_Store" --exclude "__pycache__" "$src/" "$DEST/$name/"
  else
    echo "Skipped (not found, maybe moved): ${pair%%|*}"
  fi
done

# 3. Alumni headshots only: image files directly inside each person's folder, not their records.
ALUMNI="$ONEDRIVE/01 Lab/Personnel Records (private)/_Alumni"
if [ -d "$ALUMNI" ]; then
  echo "Copying alumni headshots (images only) ..."
  rsync -a --include "*/" --include "/*/*.jpg" --include "/*/*.jpeg" --include "/*/*.JPG" \
    --include "/*/*.png" --include "/*/*.PNG" --exclude "*" --prune-empty-dirs \
    "$ALUMNI/" "$DEST/Alumni headshots/"
else
  echo "Skipped (not found, maybe moved): alumni headshots"
fi

# 4. A note of when this ran.
echo "$(date '+%Y-%m-%d %H:%M')  backup completed" >> "$DEST/backup-log.txt"
du -sh "$DEST" | awk '{print "Backup size: " $1}'
echo "Done: $DEST"
