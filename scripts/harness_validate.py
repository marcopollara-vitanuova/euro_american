#!/usr/bin/env python3
from pathlib import Path
import re
import sys
from urllib.parse import unquote

REQUIRED = [
    'AGENT.md',
    'PROJECT_CONTEXT.md',
    '.cursor/rules.md',
    '.cursor/prompts.md',
    '.cursor/mcp.json',
    '.cursor/rules/harness-context.mdc',
    '.cursor/rules/harness-sdd-workflow.mdc',
    '.cursor/rules/harness-access-security.mdc',
    '.cursor/rules/harness-human-review.mdc',
    '.cursor/rules/harness-validation-dod.mdc',
    'docs/specs/SDD.md',
    'docs/sdd/02-architecture-decision-records.md',
    'docs/sdd/03-data-access-and-mcp-policy.md',
    'docs/governance/ai-policy.md',
    'docs/checklists/pr-review-checklist.md',
    'docs/checklists/readiness-checklist.md',
    'docs/setup/PROMPT_RUN_REPORT.md',
    'docs/tasks/001-readiness-checklist-task.md',
    'requirements-dev.txt',
    'package.json',
    'package-lock.json',
    'app/layout.js',
    'app/page.js',
    'app/globals.css',
]

FORBIDDEN_MARKERS = ['TODO_SECRET', 'REAL_TOKEN', 'PASSWORD=', 'PRIVATE_KEY']
SKIP_DIRS = {'.git', 'node_modules', '.next', '.pytest_cache', '__pycache__'}
TEXT_SUFFIXES = {'.md', '.py', '.txt', '.yml', '.yaml', '.json', '.js', '.css', '.mdc'}
MARKDOWN_LINK_RE = re.compile(r'(?<!!)\[[^\]]+\]\(([^)]+)\)')


def iter_files(root):
    for path in root.rglob('*'):
        if any(part in SKIP_DIRS for part in path.parts):
            continue
        if path.is_file():
            yield path


def validate_required(root, errors):
    for rel in REQUIRED:
        path = root / rel
        if not path.exists():
            errors.append(f'missing required file: {rel}')
        elif path.stat().st_size == 0:
            errors.append(f'empty required file: {rel}')


def validate_no_backup_files(root, errors):
    for path in iter_files(root):
        if path.name.endswith('.bak'):
            errors.append(f'backup file should not remain in repo: {path.relative_to(root)}')


def validate_no_forbidden_markers(root, errors):
    for path in iter_files(root):
        if path.suffix.lower() not in TEXT_SUFFIXES:
            continue
        try:
            text = path.read_text(errors='ignore')
        except Exception:
            continue
        if path.name == 'harness_validate.py':
            continue
        for marker in FORBIDDEN_MARKERS:
            if marker in text:
                errors.append(f'forbidden marker {marker} in {path.relative_to(root)}')


def is_external_link(target):
    return (
        not target
        or target.startswith('#')
        or target.startswith(('http://', 'https://', 'mailto:', 'tel:', '//'))
    )


def validate_markdown_links(root, errors):
    for path in iter_files(root):
        if path.suffix.lower() not in {'.md', '.mdc'}:
            continue
        text = path.read_text(errors='ignore')
        for raw_target in MARKDOWN_LINK_RE.findall(text):
            target = raw_target.strip().split()[0].strip('<>')
            if is_external_link(target):
                continue
            target = unquote(target.split('#', 1)[0])
            if not target:
                continue
            candidate = (path.parent / target).resolve()
            try:
                candidate.relative_to(root.resolve())
            except ValueError:
                errors.append(f'markdown link escapes repo: {path.relative_to(root)} -> {raw_target}')
                continue
            if not candidate.exists():
                errors.append(f'broken markdown link: {path.relative_to(root)} -> {raw_target}')


def validate_canonical_paths(root, errors):
    forbidden_dirs = ['checklists', 'templates']
    for rel in forbidden_dirs:
        if (root / rel).exists():
            errors.append(f'non-canonical top-level directory present: {rel}/')


def main():
    root = Path.cwd()
    errors = []
    validate_required(root, errors)
    validate_no_backup_files(root, errors)
    validate_no_forbidden_markers(root, errors)
    validate_markdown_links(root, errors)
    validate_canonical_paths(root, errors)
    if errors:
        print('HARNESS VALIDATION FAILED')
        for error in errors:
            print(f'- {error}')
        return 1
    print('HARNESS VALIDATION PASSED')
    return 0


if __name__ == '__main__':
    sys.exit(main())
