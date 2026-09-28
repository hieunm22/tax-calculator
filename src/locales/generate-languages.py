import csv
import json
import sys
from pathlib import Path

import openpyxl
from openpyxl.styles import Font

# languages.csv is the source of truth; every other file here is generated from it
LOCALES_DIR = Path(__file__).resolve().parent
CSV_FILE = LOCALES_DIR / "languages.csv"
XLSX_FILE = LOCALES_DIR / "languages.xlsx"
HEADER = ["Key", "English", "Vietnamese", "Japanese", "Korean", "Chinese"]
LANGUAGES = ["en", "vi", "jp", "kr", "cn"]


def fail(message):
  print(f"error: {message}", file=sys.stderr)
  sys.exit(1)


def read_rows():
  with open(CSV_FILE, encoding="utf-8-sig", newline="") as f:
    rows = list(csv.reader(f))

  if not rows or rows[0] != HEADER:
    fail(f"{CSV_FILE.name} header must be: {','.join(HEADER)}")

  seen = set()
  result = []
  for line, row in enumerate(rows[1:], start=2):
    if not any(cell.strip() for cell in row):
      continue
    if len(row) != len(HEADER):
      fail(f"line {line}: expected {len(HEADER)} columns, got {len(row)}")
    key = row[0].strip()
    if not key:
      fail(f"line {line}: key is empty")
    if key in seen:
      fail(f"line {line}: duplicate key '{key}'")
    seen.add(key)
    result.append([key] + row[1:])
  return result


def insert_nested(tree, key, value):
  parts = key.split(".")
  node = tree
  for part in parts[:-1]:
    child = node.setdefault(part, {})
    if not isinstance(child, dict):
      fail(f"key '{key}' nests under '{part}', which already holds a text")
    node = child
  if isinstance(node.get(parts[-1]), dict):
    fail(f"key '{key}' is also the parent of other keys")
  node[parts[-1]] = value


def write_json(rows):
  for index, lang in enumerate(LANGUAGES, start=1):
    tree = {}
    for row in rows:
      insert_nested(tree, row[0], row[index])
    text = json.dumps(tree, ensure_ascii=False, indent="\t")
    (LOCALES_DIR / f"{lang}.json").write_text(text + "\n", encoding="utf-8")


def write_xlsx(rows):
  wb = openpyxl.Workbook()
  ws = wb.active
  ws.title = "Sheet1"
  ws.append(HEADER)
  for row in rows:
    ws.append(row)

  for cell in ws[1]:
    cell.font = Font(bold=True)
  ws.freeze_panes = "B2"
  for column in ws.columns:
    width = max(len(str(cell.value or "")) for cell in column)
    ws.column_dimensions[column[0].column_letter].width = min(width + 2, 60)
  wb.save(XLSX_FILE)


rows = read_rows()
write_json(rows)
write_xlsx(rows)
print(f"generated {len(LANGUAGES)} json files and {XLSX_FILE.name} from {len(rows)} keys")
