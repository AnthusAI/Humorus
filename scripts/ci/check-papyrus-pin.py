#!/usr/bin/env python3
"""Fail unless every place that names the Papyrus version names the same one.

The pin lives in package.json (@anthusai/papyrus), is resolved in package-lock.json
and is repeated in infra/site.json (papyrusVersion, which the app shell and the
Amplify build read). No other file may pin papyrus-newsroom: the build installs the
Python package at the version from infra/site.json, so a second file would be a
hand-kept duplicate that nothing reads.
"""
import json
import pathlib
import re
import sys

root = pathlib.Path(__file__).resolve().parents[2]
pins = {}
pins["package.json"] = json.loads((root / "package.json").read_text())["dependencies"]["@anthusai/papyrus"]
lock = json.loads((root / "package-lock.json").read_text())
pins["package-lock.json"] = lock["packages"]["node_modules/@anthusai/papyrus"]["version"]
pins["infra/site.json"] = json.loads((root / "infra/site.json").read_text())["papyrusVersion"]

problems = [f"{name} says {version}" for name, version in pins.items() if version != pins["package.json"]]

skip = {".git", "node_modules", ".next", "cdk.out", "project"}
for path in root.rglob("*"):
    if not path.is_file() or skip & set(path.relative_to(root).parts):
        continue
    if path.name.startswith("requirements") and path.suffix == ".txt" and "papyrus-newsroom" in path.read_text():
        problems.append(f"{path.relative_to(root)} pins papyrus-newsroom; delete it, the one pin is package.json")

if problems:
    print("Papyrus pins disagree:", file=sys.stderr)
    for problem in problems:
        print(f"  {problem}", file=sys.stderr)
    sys.exit(1)
print(f"one Papyrus pin: {pins['package.json']} (package.json, package-lock.json, infra/site.json)")
