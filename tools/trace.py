#!/usr/bin/env python3
"""Traceability check: requirements <-> tasks <-> registers. Standard library only.

Fails (exit 1) when:
  * a requirement defined in the dev spec is satisfied by no task;
  * a task's **Satisfies:** line cites an ID the spec does not define;
  * a task has no **Satisfies:** line (use "—" / "none" / "tooling" / "infra" for tooling tasks);
  * a task cites an OQ-nnn / D-nnn missing from open-questions.md / decisions.md;
  * a `gated` task names no OQ;
  * docs/uat/UAT.md exists and an AC-n has no heading there.

Conventions it reads (see the project-bootstrap skill):
  * spec defines an ID in bold:   **FR-2.1.4** ...   **AC-7** ...   **BR-012** ...   **NFR-3** ...
  * task header line:             **Satisfies:** FR-2.1.4, AC-7 · **Depends on:** ...
  * one ID per citation; ranges (FR-2.1.4–2.1.6) are not expanded — list each ID.

Usage:
  python3 tools/trace.py                    # check, print gaps
  python3 tools/trace.py --write            # also write docs/fsd/traceability.md
  python3 tools/trace.py --spec docs/X.md   # explicit spec path
"""

from __future__ import annotations

import argparse
import re
import sys
from collections import defaultdict
from pathlib import Path

# Edit PREFIXES if the project uses other requirement kinds (e.g. "UR", "SEC").
PREFIXES = ("FR", "NFR", "AC", "BR")
ID = r"(?:%s)-\d+(?:\.\d+)*" % "|".join(PREFIXES)
DEFINED = re.compile(r"\*\*(%s)\*\*" % ID)
CITED = re.compile(r"\b(%s)\b" % ID)
SATISFIES = re.compile(r"\*\*Satisfies:\*\*\s*(.*?)(?:\s+·\s+\*\*|$)", re.MULTILINE)
STATUS = re.compile(r"\*\*Status:\*\*\s*([a-z]+)", re.IGNORECASE)
OQ = re.compile(r"\bOQ-(\d+)\b")
DEC = re.compile(r"\bD-(\d+)\b")
TOOLING = {"—", "-", "none", "tooling", "infra", "n/a"}
STATES = ("backlog", "active", "done")


def find_spec(root: Path, explicit: str | None) -> Path:
    if explicit:
        return root / explicit
    found = sorted((root / "docs").glob("*dev-spec*.md"))
    if len(found) != 1:
        sys.exit(f"trace: expected one docs/*dev-spec*.md, found {len(found)}; pass --spec")
    return found[0]


def register_ids(path: Path, prefix: str) -> set[str] | None:
    """IDs a register defines: first table cell (`| 001 |` or `| OQ-001 |`) or a heading (`## OQ-001 …`)."""
    if not path.exists():
        return None
    text = path.read_text(encoding="utf-8")
    row = re.compile(r"^\|\s*(?:%s-)?(\d+)\s*\|" % prefix, re.MULTILINE)
    head = re.compile(r"^#+\s+%s-(\d+)\b" % prefix, re.MULTILINE)
    return {n.lstrip("0") or "0" for n in row.findall(text) + head.findall(text)}


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--root", default=".")
    ap.add_argument("--spec")
    ap.add_argument("--write", action="store_true", help="write docs/fsd/traceability.md")
    args = ap.parse_args()

    root = Path(args.root).resolve()
    spec = find_spec(root, args.spec)
    defined = list(dict.fromkeys(DEFINED.findall(spec.read_text(encoding="utf-8"))))
    defined_set = set(defined)

    oqs = register_ids(root / "docs/fsd/open-questions.md", "OQ")
    decs = register_ids(root / "docs/fsd/decisions.md", "D")

    covered: dict[str, list[str]] = defaultdict(list)
    errors: list[str] = []

    for state in STATES:
        for task in sorted((root / "docs/tasks" / state).glob("T-*.md")):
            text = task.read_text(encoding="utf-8")
            name = task.stem.split("-", 2)
            tid = f"{name[0]}-{name[1]}" if len(name) > 1 else task.stem
            sat = SATISFIES.search(text)
            if not sat:
                errors.append(f"{task.relative_to(root)}: no **Satisfies:** line")
            else:
                value = sat.group(1).strip()
                ids = CITED.findall(value)
                if not ids and value.lower() not in TOOLING:
                    errors.append(f"{task.relative_to(root)}: **Satisfies:** '{value}' cites no ID")
                for rid in ids:
                    if rid not in defined_set:
                        errors.append(f"{task.relative_to(root)}: cites {rid}, not defined in {spec.name}")
                    covered[rid].append(f"{tid} ({state})")

            status = STATUS.search(text)
            if state == "backlog" and status and status.group(1).lower() == "gated" and not OQ.search(text):
                errors.append(f"{task.relative_to(root)}: status gated but no OQ-nnn named")
            if oqs is not None:
                for n in {m.lstrip("0") or "0" for m in OQ.findall(text)} - oqs:
                    errors.append(f"{task.relative_to(root)}: OQ-{n} not in open-questions.md")
            if decs is not None:
                for n in {m.lstrip("0") or "0" for m in DEC.findall(text)} - decs:
                    errors.append(f"{task.relative_to(root)}: D-{n} not in decisions.md")

    uncovered = [rid for rid in defined if rid not in covered]
    errors += [f"{rid}: satisfied by no task" for rid in uncovered]

    uat = root / "docs/uat/UAT.md"
    if uat.exists():
        headings = set(re.findall(r"^#+\s+(AC-\d+)\b", uat.read_text(encoding="utf-8"), re.MULTILINE))
        errors += [f"{rid}: no section in docs/uat/UAT.md" for rid in defined
                   if rid.startswith("AC-") and rid not in headings]

    if args.write:
        out = root / "docs/fsd/traceability.md"
        out.parent.mkdir(parents=True, exist_ok=True)
        rows = "\n".join(f"| {rid} | {', '.join(covered.get(rid, [])) or '**none**'} |" for rid in defined)
        out.write_text(
            "# Traceability\n\nGenerated by `tools/trace.py --write`; do not edit by hand.\n\n"
            f"| Requirement | Tasks |\n|---|---|\n{rows}\n",
            encoding="utf-8",
        )

    print(f"trace: {len(defined)} requirements in {spec.name}, {len(defined) - len(uncovered)} covered")
    for e in errors:
        print(f"  ✗ {e}")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
