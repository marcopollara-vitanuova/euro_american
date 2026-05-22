#!/usr/bin/env python3
from pathlib import Path
import sys

REQUIRED = [
    'AGENT.md',
    'PROJECT_CONTEXT.md',
    '.cursor/rules.md',
    'docs/sdd/01-system-design-document.md',
    'docs/sdd/02-architecture-decision-records.md',
    'docs/sdd/03-data-access-and-mcp-policy.md',
    'docs/governance/ai-policy.md',
    'checklists/pr-review-checklist.md',
]
FORBIDDEN_MARKERS = ['TODO_SECRET', 'REAL_TOKEN', 'PASSWORD=', 'PRIVATE_KEY']

def main():
    root = Path.cwd()
    errors=[]
    for rel in REQUIRED:
        p=root/rel
        if not p.exists():
            errors.append(f'missing required file: {rel}')
        elif p.stat().st_size == 0:
            errors.append(f'empty required file: {rel}')
    for p in root.rglob('*'):
        if p.is_file() and p.suffix.lower() in {'.md','.py','.txt','.yml','.yaml'}:
            try:
                txt=p.read_text(errors='ignore')
            except Exception:
                continue
            if p.name == 'harness_validate.py':
                continue
            for marker in FORBIDDEN_MARKERS:
                if marker in txt:
                    errors.append(f'forbidden marker {marker} in {p.relative_to(root)}')
    if errors:
        print('HARNESS VALIDATION FAILED')
        for e in errors:
            print(f'- {e}')
        return 1
    print('HARNESS VALIDATION PASSED')
    return 0

if __name__ == '__main__':
    sys.exit(main())
