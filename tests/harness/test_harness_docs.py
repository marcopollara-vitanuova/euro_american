from pathlib import Path


def test_required_harness_docs_exist():
    root = Path(__file__).resolve().parents[2]
    required = [
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
        'docs/governance/ai-policy.md',
        'docs/checklists/pr-review-checklist.md',
        'docs/checklists/readiness-checklist.md',
        'docs/setup/PROMPT_RUN_REPORT.md',
        'docs/tasks/001-readiness-checklist-task.md',
        'requirements-dev.txt',
        'package.json',
        'app/layout.js',
        'app/page.js',
        'app/globals.css',
    ]
    for rel in required:
        assert (root / rel).exists(), rel
