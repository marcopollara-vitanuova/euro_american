---
name: harness-sdd
description: reusable guidance for generating and reviewing harness engineering documents for cursor or coding agents, including agent instructions, sdd, architecture decisions, cursor rules, prompt libraries, checklists, access policies, and human-in-the-loop controls. use when creating or auditing repository-first ai agent harnesses, spec-driven development workflows, or governance packs for safe agentic software delivery.
---

# Harness SDD

## Workflow
1. Read repository context: PROJECT_CONTEXT, AGENT.md, SDD, ADR, rules, checklists.
2. Identify missing constraints, access risks, data risks and unclear ownership.
3. Produce or update the SDD before implementation.
4. Record critical decisions as ADRs.
5. Generate Cursor prompts that force discovery, plan, implementation, review and entropy cleanup phases.
6. Require human approval for credentials, external access, personal data, production changes and new providers.

## Output standard
Always produce:
- executive summary;
- assumptions;
- open points;
- SDD changes;
- ADR changes;
- rules/checklist changes;
- next prompt to run in Cursor.

## Quality bar
Reject or block work when:
- the task asks for production access without approved ADR;
- data classification is missing;
- tests or quality gates are absent;
- the agent would need credentials or secrets;
- documentation is not updated with the implementation.

## Reference
Use `references/sdd-output-template.md` when drafting a new SDD or reviewing an existing one.
