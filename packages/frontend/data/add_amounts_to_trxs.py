import csv
from pathlib import Path

DATA_DIR = Path(__file__).parent
EVENTS = DATA_DIR / "PrivacyFlowEvent.csv"
TRXS = DATA_DIR / "PrivacyFlowTrxs.csv"
OUT = DATA_DIR / "PrivacyFlowTrxs_with_amounts.csv"

# Step 1: build {(tx_hash, project): (amount_raw, token)} from events.
# Same tx hash can appear in multiple events for different project-tokens,
# so we key on (tx_hash, project) to disambiguate.
# Events: project at col 2, tx hash at col 7, amount at col 10, token at col 11.
tx_map: dict[tuple[str, str], tuple[str, str]] = {}
with EVENTS.open(newline="") as f:
    reader = csv.reader(f)
    for row in reader:
        if len(row) < 13:
            continue
        project = row[2]
        tx_hash = row[7]
        amount_raw = row[10]
        token = row[11]
        tx_map.setdefault((tx_hash, project), (amount_raw, token))

print(f"Loaded {len(tx_map)} unique (tx_hash, project) pairs from events.")

# Step 2: stream through trxs.csv and append amount + token.
# Trxs: project at col 2, tx hash at col 4.
matched = 0
missing = 0
with TRXS.open(newline="") as fin, OUT.open("w", newline="") as fout:
    reader = csv.reader(fin)
    writer = csv.writer(fout)
    for row in reader:
        if len(row) < 5:
            writer.writerow(row)
            continue
        project = row[2]
        tx_hash = row[4]
        key = (tx_hash, project)
        if key in tx_map:
            amount_raw, token = tx_map[key]
            matched += 1
        else:
            amount_raw, token = "", ""
            missing += 1
        writer.writerow(row + [amount_raw, token])

print(f"Matched: {matched}, Missing: {missing}")
print(f"Wrote: {OUT}")
