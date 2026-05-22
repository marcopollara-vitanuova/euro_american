from pathlib import Path


def test_required_harness_docs_exist():
    root = Path(__file__).resolve().parents[2]
    required = [
        'AGENT.md',
        'PROJECT_CONTEXT.md',
        '.cursor/rules.md',
        'docs/sdd/01-system-design-document.md',
        'docs/governance/ai-policy.md',
    ]
    for rel in required:
        assert (root / rel).exists(), rel
