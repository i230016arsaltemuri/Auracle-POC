# Prompt for IDE Coding Agent — Rebuild Auracle Prototype Around the Final Regression User Story

You are working inside an existing React/Vite high-fidelity frontend prototype for **Auracle**.

Your task is to **modify the actual implementation**, not merely write a plan or change labels. Preserve useful parts of the prototype, but redesign the product flow, information architecture, navigation, mock domain model, screen hierarchy, interactions and demo journey so they faithfully represent the updated Auracle product.

This is a frontend prototype task. Do not build the full backend, AST engine, pytest runner, ML pipeline or LLM service unless such systems already exist. Simulate them with coherent, backend-ready mock states and interactions.

---

## 1. Product source of truth

Auracle is:

> **A change-aware regression intelligence system that converts a source-code change into an explainable regression test plan by identifying affected code, mapping existing tests, detecting missing test needs, proposing new or updated tests where possible, selecting and prioritizing relevant tests, executing them through existing test runners, and reporting the remaining regression evidence or uncertainty.**

The product must visibly communicate this chain:

```text
CODE CHANGE
→ WHAT CHANGED?
→ WHAT IS AFFECTED?
→ WHAT EXISTING TEST EVIDENCE EXISTS?
→ WHAT CHANGED CODE IS NOT ADEQUATELY EXERCISED?
→ IS THERE A TEST NEED?
→ CAN A CANDIDATE TEST BE GENERATED OR DOES A HUMAN NEED TO CLARIFY EXPECTED BEHAVIOR?
→ WHICH TESTS SHOULD RUN?
→ IN WHAT ORDER?
→ EXECUTE
→ WHAT ACTUALLY HAPPENED?
→ WHAT REMAINS UNRESOLVED?
```

The main user-facing output is an **explainable Regression Test Plan**, not merely a list of tests and not merely a PASS/FAIL gate.

---

## 2. Core user story

Design the entire prototype around this user story:

### Know What to Test After a Code Change

**As a software developer,**
I want Auracle to understand what changed in my code, determine which existing tests are actually relevant to that change, identify when the change introduces behavior that is not adequately tested, and guide or generate the missing tests using known behavioral requirements,
**so that I can validate a change with a focused, explainable regression test plan without blindly running the entire test suite or trusting an opaque AI decision.**

A person clicking through the prototype must understand:

1. what the developer changed;
2. what Auracle detected;
3. what may be affected;
4. which tests already provide evidence;
5. what changed code is not exercised;
6. why a Test Need exists;
7. what behavioral evidence exists for a missing test;
8. whether Auracle can generate a candidate test;
9. which tests are selected;
10. why they are selected;
11. how they are prioritized;
12. why that order is used;
13. what happened during execution;
14. what remains unresolved.

---

## 3. Critical UX distinction: the journey begins in the IDE

Do **not** use the dashboard as the natural beginning of the main product story.

The developer's problem starts in the **IDE**, when code is changed.

The primary demo journey must therefore be:

```text
IDE
→ developer changes code
→ commit / push
→ GitHub PR / CI
→ Auracle detects unresolved regression work
→ developer opens Auracle Change Report
→ developer understands change, impact, existing evidence and Test Need
→ Auracle proposes candidate test or requests clarification
→ developer returns to IDE to review/accept the candidate
→ regression plan executes
→ GitHub receives final Auracle status
```

The dashboard is a secondary workspace for reviewing repositories, changes and history. It is not the origin of the main user story.

Preserve the immersive fake IDE and fake GitHub screens. They are among the strongest parts of the current prototype.

---

## 4. What to preserve from the current prototype

Preserve and evolve:

- fake VS Code / IDE experience;
- fake GitHub PR experience;
- fullscreen IDE/GitHub routes;
- current dark developer-tool aesthetic;
- coherent single demo repository and PR;
- source-code viewer;
- changed-code coverage visualization;
- dependency/impact graph;
- deep PR report concept;
- evidence explanations;
- history/shadow-mode as a secondary evaluation feature;
- local AI/privacy settings;
- React/Vite architecture unless refactoring is necessary.

Do not rewrite the whole application from scratch without need.

---

## 5. What the current product story must stop emphasizing

The current prototype over-emphasizes:

- predictive test selection as the core product;
- CI runtime savings as the primary value;
- confidence sliders;
- percentage/time-budget optimization;
- generic HIGH/LOW risk;
- Quality Gate as the main product output;
- Test Health as a major product domain;
- AI Copilot as a major standalone product area.

These become secondary.

The new hierarchy is:

1. Change understanding
2. Impact analysis
3. Existing test evidence
4. Changed-code coverage
5. Test Need detection
6. Candidate test generation / human clarification
7. Test selection
8. Test prioritization
9. Execution
10. Post-run evidence
11. Historical ML enhancement
12. AI explanation

---

## 6. Truth rules the UI must respect

### Coverage

Coverage may say:

> “This changed branch was executed by these tests.”

Coverage must not imply:

> “This behavior is correct.”

Coverage proves execution, not semantic correctness.

### AI

AI may:

- explain;
- summarize;
- generate a candidate test;
- produce a skeleton;
- use explicit behavior sources.

AI must not appear to invent:

- requirements;
- expected behavior;
- execution results;
- coverage;
- regression completion.

### Unknown expected behavior

If Auracle knows a test is needed but cannot establish the correct expected behavior, show:

```text
Human clarification required
```

This is a valid result, not an error.

### ML

ML is an optional historical enhancement.

Cold start must show:

```text
Historical model unavailable
Using deterministic impact + coverage rules
```

A mature repository may show:

```text
Historical ranking enabled
Used only as a ranking/tie-break enhancement
```

### Selection and prioritization

These are separate UI concepts.

```text
Selection = Which tests should run?
Prioritization = In what order should selected tests run?
```

Never combine them into one vague ranking screen.

---

## 7. Canonical demo scenario

Keep the existing coherent demo repository if practical:

```text
acme/payments-api
PR #184 — Add guarded retry to refund processing
```

The developer modifies:

```text
PaymentService.refund()
```

The change introduces a retry-exhaustion branch.

Existing tests:

```text
test_refund_success
test_refund_failure
test_payment_api
```

They exercise most of the changed function but do not execute the new retry-exhaustion branch.

Auracle should discover:

```text
Changed symbol:
PaymentService.refund()

Direct/transitive impact:
PaymentRepository
RefundValidator
refund API endpoint

Existing relevant tests:
test_refund_success
test_refund_failure
test_payment_api

Missing evidence:
retry-exhaustion branch not observed in existing relevant test execution

Test Need:
TN-204 — additional regression test required for retry exhaustion
```

A behavior source such as the PR description should say something concrete like:

```text
If all retry attempts fail, RefundRetryExhausted must be raised.
```

Auracle then proposes:

```text
test_refund_raises_after_retry_exhaustion
```

The candidate must visibly pass through:

```text
Generated
→ Syntax valid
→ pytest collectable
→ Executable
→ Target changed branch reached
→ Human review / Accepted
```

After acceptance, Auracle builds the final regression plan and executes it.

Final state:

```text
PASS WITHIN SUPPORTED SCOPE
```

with explicit explanation that this does not mean “bug free”; it means the supported regression workflow has no unresolved material Test Need.

---

# 8. Target end-to-end UX flow

## Step 1 — IDE: code change

Primary entry route:

```text
/ide
```

Show:

- repository tree;
- `payment/service.py`;
- `PaymentService.refund()`;
- modified lines highlighted;
- Git modified state.

Add an Auracle panel/activity view in the IDE.

Initial state:

```text
Auracle
Current change detected locally
payment/service.py
PaymentService.refund()

Analysis will run after push / PR.
```

Use the fake terminal for:

```bash
git add .
git commit -m "Add guarded retry to refund processing"
git push
```

Then navigate to the GitHub PR simulation.

---

## Step 2 — GitHub PR: REVIEW REQUIRED

The Auracle GitHub check should show:

```text
Auracle Regression Analysis
REVIEW REQUIRED

1 changed function
3 affected components
3 existing relevant tests
1 unresolved Test Need

Reason:
The new retry-exhaustion branch is not observed in any relevant existing test execution.
```

Primary CTA:

```text
Review Regression Plan
```

Secondary details may include changed-code coverage, but do not let the percentage become the decision itself.

Do not make “Risk HIGH” the primary message.

---

## Step 3 — Change Report: main Auracle web screen

Keep `/pull-requests/184/report` if convenient, but rename the visible concept to:

```text
Change Report
```

or:

```text
Regression Plan — PR #184
```

This becomes the main web product screen.

Top area:

```text
PR #184 — Add guarded retry to refund processing

Status: REVIEW REQUIRED
Reason: TN-204 remains unresolved
```

Avoid generic risk labels as the dominant message.

### Replace old evidence chain

Old concept:

```text
CHANGE → IMPACT → SELECTION → EXECUTION → COVERAGE → QUALITY GATE
```

New concept:

```text
CHANGE
→ IMPACT
→ EXISTING TEST EVIDENCE
→ TEST NEEDS
→ REGRESSION PLAN
→ EXECUTION
→ FINAL EVIDENCE
```

Make the stages clickable or inspectable.

---

## Step 4 — Change section

Show factual information:

```text
Changed file: payment/service.py
Changed symbol: PaymentService.refund()
Change type: Modified function / behavior change
Changed executable lines: 17
New branch: Retry exhaustion
```

Show a diff viewer.

Where useful add provenance:

```text
Source: Git diff + Python AST
```

---

## Step 5 — Impact section

Reuse and improve the impact graph.

Focused default graph:

```text
refund API endpoint
        ↓
PaymentService.refund() [CHANGED]
      ↙        ↘
RefundValidator  PaymentRepository

Related tests:
test_refund_success
test_refund_failure
test_payment_api
```

When a node is selected show:

- relationship to change;
- direct/transitive distance;
- dependency path;
- related tests;
- confidence/evidence source if appropriate.

Do not imply the graph is perfectly complete for dynamic Python.

---

## Step 6 — Existing Test Evidence section

Create a first-class section.

Suggested table:

| Test | Relationship | Evidence | Selection Class | Why |
|---|---|---|---|---|

Example:

```text
test_refund_failure
Direct changed-symbol relationship
Previously executes PaymentService.refund()
MUST RUN
Direct evidence
```

```text
test_payment_api
Depth-1 impacted caller
Covers refund API endpoint
STRONG
Covers a direct dependent
```

Do not use unexplained impact scores as the main explanation.

---

## Step 7 — Changed-code coverage section

Keep the existing strong coverage/source viewer, but reframe the language.

Show:

```text
Changed executable lines: 17
Observed during relevant tests: 15
Not observed: 2
```

If branch data exists:

```text
Changed branches: 3
Observed: 2
Unobserved: retry exhaustion
```

Phrase percentages carefully:

```text
88% of changed executable lines were observed during relevant test execution
```

not:

```text
88% of the behavior is correct
```

Add a note:

> Coverage indicates execution evidence, not semantic correctness.

---

## Step 8 — Test Needs

This is a new core product capability.

Add a major Change Report section and preferably a dedicated route:

```text
/test-needs
```

Example card:

```text
TN-204
Material Test Need

Target:
PaymentService.refund()
lines 91–97

Reason:
Changed retry-exhaustion branch is not executed by any observed relevant test.

Coverage state:
Uncovered

Expected behavior:
Known / Partial / Unknown / Conflicting

Recommended action:
Generate candidate regression test
```

Use **Test Need** as the main term.

Do not use vague “testing gap” terminology as the main domain concept.

---

## Step 9 — Behavior sources

For the selected Test Need show:

```text
What should this behavior do?
```

Then display sources such as:

```text
AUTHORITATIVE
PR description
“If all retry attempts fail, raise RefundRetryExhausted.”

SUPPORTING
Function docstring
“Retries refund up to max_attempts.”

SUPPORTING
Existing related test
test_refund_failure

IMPLEMENTATION CONTEXT
PaymentService.refund() source
Not treated as behavioral truth
```

The UI must make it obvious where the candidate assertion comes from.

---

## Step 10 — Candidate Test Generation

CTA:

```text
Generate Candidate Test
```

Do not call it “AI Fix.”

Show:

```text
Candidate:
test_refund_raises_after_retry_exhaustion

Generation mode:
Behavior-grounded

Based on:
• PR behavior requirement
• changed function + diff
• related pytest tests
• repository fixtures
```

Display code.

Show validation checklist:

```text
✓ Syntax valid
✓ pytest collection passed
✓ Candidate executed
✓ Target retry-exhaustion branch reached
○ Human review required
```

Actions:

```text
Review in IDE
Accept Candidate
Reject
```

For the main story, use `Review in IDE`.

---

## Step 11 — Unknown behavior variant

Also represent a secondary state where:

```text
Expected behavior: UNKNOWN
```

Show:

```text
Auracle can identify that this changed region requires testing,
but the correct expected result cannot be established from available evidence.

Human clarification required.
```

CTA:

```text
Provide Expected Behavior
```

Modal fields:

```text
Expected behavior
Source label
Confirm
```

This is an important product truth and should exist somewhere in the prototype even if not in the primary happy path.

---

## Step 12 — Regression Plan

Create a dedicated route:

```text
/regression-plan
```

or make it a dominant Change Report tab.

This replaces the old predictive-selection-centric experience.

Show four explicit areas:

### Existing relevant tests

### Additional candidate/accepted tests

### Selection — Which tests should run?

Use classes:

```text
MUST RUN
STRONG
BROAD
NOT SELECTED
```

### Prioritization — In what order?

Use tiers/reasons:

```text
1. test_refund_raises_after_retry_exhaustion
   P1 — closes TN-204

2. test_refund_failure
   P2 — directly covers changed function

3. test_refund_success
   P2 — directly covers changed function

4. test_payment_api
   P3 — covers direct impacted caller
```

Each row needs an expandable “Why?” explanation.

---

## Step 13 — Replace old `/test-selection`

The current screen's confidence/time/percentage sliders must no longer be central.

Recommended:

```text
/test-selection → redirect/alias to /regression-plan
```

or rebuild the page in place and change its visible title.

Remove/de-emphasize:

- Confidence Target slider;
- “Run 30%” as primary control;
- opaque optimized score.

The main question must be:

```text
Which tests should run, and why?
```

followed separately by:

```text
In what order, and why?
```

---

## Step 14 — Historical ML as secondary enhancement

Show two possible states.

Cold start:

```text
Historical model
Not active

Reason:
Insufficient repository history

Current ranking:
Deterministic impact + coverage rules
```

Mature history:

```text
Historical ranking
Active

Used as:
Tie-breaker within deterministic priority tiers
```

Example:

```text
test_refund_failure
Historical failure likelihood: 0.63
Used only to rank within P2
```

Do not imply ML determines basic relevance or expected behavior.

---

## Step 15 — Execution screen

Add route:

```text
/execution
```

Show:

```text
Regression Run AR-184-02
4 tests planned
4 executed
1 candidate/accepted test
3 existing tests
```

Rows:

```text
PASS test_refund_raises_after_retry_exhaustion
PASS test_refund_failure
PASS test_refund_success
PASS test_payment_api
```

Then post-run evidence:

```text
Before plan:
15 / 17 changed executable lines observed

After plan:
17 / 17 observed

Retry exhaustion branch:
Now observed
```

If feasible, animate or simulate progression.

---

## Step 16 — Final status

Use:

```text
PASS WITHIN SUPPORTED SCOPE
FAIL
REVIEW REQUIRED
OUT OF SCOPE
```

For PASS:

```text
PASS WITHIN SUPPORTED SCOPE

Required tests executed: 4/4
Required tests passed: 4/4
Open material Test Needs: 0
Retry-exhaustion Test Need resolved: Yes
Material analysis uncertainty: None

This means Auracle's supported regression workflow has no unresolved material testing need.
It does not mean the software is bug-free.
```

Initial state:

```text
REVIEW REQUIRED
Reason: TN-204 remains unresolved.
```

Use the same final state consistently in GitHub, Change Report and execution results.

---

## Step 17 — Return to IDE for candidate review

When user clicks:

```text
Review in IDE
```

navigate to something like:

```text
/ide?step=candidate-review
```

Show generated candidate test file and an Auracle IDE panel:

```text
Auracle Candidate Test

Test Need:
TN-204

Target:
PaymentService.refund()

Why generated:
Retry exhaustion branch unobserved

Behavior source:
PR description

Validation:
✓ Syntax
✓ pytest collection
✓ Target branch reached

Action:
Review candidate before accepting
```

Actions:

```text
Accept Candidate
Reject
```

After acceptance:

```text
Regression Plan updated
4 tests selected
```

Then allow:

```text
Run Regression Plan
```

---

## Step 18 — Return to GitHub

After successful execution, GitHub Auracle check changes to:

```text
PASS WITHIN SUPPORTED SCOPE

4 required tests passed
0 open material Test Needs
Previously uncovered retry-exhaustion branch now observed
```

Then user may merge.

---

# 9. Revised information architecture

Primary operational surfaces:

```text
Repositories
Changes / Pull Requests
Change Report
Test Needs
Regression Plan
Execution
```

Supporting investigation:

```text
Impact
Coverage
History / Model Evaluation
Settings
```

Secondary:

```text
Ask Auracle
Test Health
```

Do not make Test Health or AI Copilot first-class core navigation.

Suggested sidebar:

```text
AURACLE

Workspace
• Repositories
• Changes

Current Change
• Change Report
• Impact
• Test Needs
• Regression Plan
• Execution

Evaluation
• History / Model Evaluation

More
• Ask Auracle
• Test Health

System
• Settings
```

Remember: this sidebar is not the beginning of the primary demo journey. The IDE is.

---

# 10. Overview/dashboard redesign

Keep `/`, but change its emphasis.

Old emphasis:

```text
Time Saved
Recall
Avg Runtime
```

New top-level cards:

```text
Changes Requiring Review
Open Test Needs
Recent Regression Runs
Repositories
```

Secondary metrics may include:

```text
Changed-code evidence
Historical model status
Selected/full-suite execution ratio
Time savings
```

Main table:

```text
Recent Changes
```

Columns:

```text
Change
Repository
Status
Changed Symbols
Test Needs
Selected Tests
Last Run
```

---

# 11. Pull Requests page redesign

Visible concept may become:

```text
Changes / Pull Requests
```

Columns should emphasize:

```text
PR / Change
Status
Changed Symbols
Affected Components
Relevant Tests
Open Test Needs
Execution Status
```

Do not make HIGH/LOW risk a primary column.

---

# 12. Coverage page

Keep `/coverage` as a deep inspection screen.

Always show context:

```text
Coverage for PR #184
```

Sections:

```text
Changed-code execution
Branch evidence
Tests responsible for observed lines/branches
Unobserved regions
Unknown regions
```

Provide easy return to Change Report.

---

# 13. Impact page

Keep `/change-impact`.

Its central question is:

> Why does Auracle think this code is affected?

On node click show:

```text
Symbol
Relationship
Distance
Path from changed symbol
Related tests
Evidence/confidence source
```

---

# 14. Ask Auracle

Retain `/copilot`, but visibly demote it and optionally rename it:

```text
Ask Auracle
```

Good example questions:

```text
Why is TN-204 open?
Why was test_payment_api selected?
Why is test_refund_failure ranked second?
What evidence supports the candidate assertion?
Why is this change REVIEW REQUIRED?
```

AI explains structured evidence; it is not the source of truth.

---

# 15. History page

Rename conceptually to:

```text
History & Model Evaluation
```

Keep useful shadow-mode material.

Show:

```text
Deterministic baseline
Historical ML enhancement
Failure recall
Missed failures
Time to first failure
Selected vs full-suite execution cost
```

Separate normal product operation from model evaluation.

---

# 16. Settings redesign

Add sections:

### Project
```text
Language: Python
Framework: pytest
```

### Impact analysis
```text
Impact depth
Conservative on unknown relationships
```

### Coverage
```text
Changed-line policy
Branch coverage
```

### Generation
```text
Candidate generation enabled
Human review required
Allow skeleton on unknown behavior
```

### Prioritization
```text
Deterministic mode
Historical model tie-breaker
```

### AI
```text
Local provider
External provider
Source-code sharing policy
```

Do not center settings around vague risk tolerance.

---

# 17. Mock domain model refactor

Refactor mock data to match the final domain model.

Recommended TypeScript concepts:

```ts
type FinalState =
  | "PASS_WITHIN_SUPPORTED_SCOPE"
  | "FAIL"
  | "REVIEW_REQUIRED"
  | "OUT_OF_SCOPE";

type CoverageState =
  | "covered"
  | "partially_covered"
  | "uncovered"
  | "unknown";

type ExpectedBehaviorState =
  | "known"
  | "partial"
  | "unknown"
  | "conflicting";

type SelectionClass =
  | "MUST_RUN"
  | "STRONG"
  | "BROAD"
  | "NOT_SELECTED";

type PriorityTier =
  | "P0" | "P1" | "P2" | "P3" | "P4" | "P5";
```

Model entities similar to:

```text
ChangeSet
ChangedSymbol
ImpactRelation
RelevantTest
ChangedRegion
TestNeed
BehaviorSource
CandidateTest
SelectionDecision
PriorityDecision
RegressionPlan
RegressionRun
HistoricalModelState
```

Adapt exact shapes to the existing project.

---

# 18. Shared coherent demo state

The current prototype is mock-driven. Keep it mock-driven, but centralize the scenario.

Create something like:

```text
src/data/demoScenario.ts
src/context/DemoScenarioContext.tsx
```

Use a shared phase:

```ts
type DemoPhase =
  | "CHANGE_CREATED"
  | "ANALYSIS_REVIEW"
  | "CANDIDATE_GENERATED"
  | "CANDIDATE_ACCEPTED"
  | "EXECUTED"
  | "MERGED";
```

At minimum support:

### State A — Analysis

```text
REVIEW_REQUIRED
TN-204 open
candidate not generated
```

### State B — Candidate generated

```text
REVIEW_REQUIRED
candidate validated
human review required
```

### State C — Candidate accepted/executed

```text
PASS_WITHIN_SUPPORTED_SCOPE
TN-204 resolved
all required tests passed
changed branch observed
```

All screens must derive values from the same scenario state.

Do not have one page claim `88%` and another page independently claim contradictory data.

React Context plus session/local storage is acceptable for the prototype.

---

# 19. Component refactor

The existing app is monolithic. Extract reusable components where useful, especially for concepts used across pages.

Suggested components:

```text
StatusBadge
EvidenceSourceBadge
ChangeSummaryCard
ImpactPath
RelevantTestTable
CoverageRegionViewer
TestNeedCard
BehaviorSourceList
CandidateTestPanel
ValidationChecklist
SelectionClassBadge
PriorityTierBadge
RegressionPlanTable
ExecutionProgress
FinalStatusPanel
EvidenceDrawer
```

Do not over-engineer. Extract what improves consistency and reuse.

---

# 20. “Why?” interaction pattern

Every important Auracle decision should be explainable.

Create a reusable `Why?` affordance using expandable rows, drawer, popover or panel.

Examples:

### Why selected?

```text
MUST RUN
• Previously executed PaymentService.refund()
• Changed-line overlap exists
```

### Why ranked first?

```text
P1
This accepted candidate closes TN-204.
```

### Why Test Need?

```text
Changed retry-exhaustion branch has no observed execution from any relevant existing test.
```

### Why human review?

```text
Expected behavior is only partially established.
```

This is one of the most important UX patterns in the redesign.

---

# 21. Evidence provenance

Where useful, show source categories:

```text
FACT — Git
FACT — Coverage
FACT — pytest
INFERENCE — Dependency Graph
PREDICTION — Historical Model
SUGGESTION — AI
HUMAN REQUIREMENT
UNKNOWN
```

Do not overuse badges, but make the distinction visible where it improves trust.

---

# 22. Visual design

Preserve the current dark developer-tool visual language.

The UI should feel like:

- developer tooling;
- CI/repository intelligence;
- code evidence;
- observability;
- technical decision support.

Do not turn it into a generic SaaS analytics dashboard.

Suggested semantic colors:

```text
Green — passed/resolved/observed
Red — failed
Amber — review required/uncertain
Blue — structural evidence/selected
Purple — AI candidate/historical model
Gray — unknown/not selected/unavailable
```

Never use color alone; include explicit labels.

---

# 23. Terminology migration

Prefer:

```text
Change Report
Regression Plan
Test Need
Existing Test Evidence
Changed-Code Coverage
Candidate Test
Selection
Prioritization
Regression Run
Final Evidence
PASS WITHIN SUPPORTED SCOPE
REVIEW REQUIRED
```

De-emphasize:

```text
Risk Score
Confidence Target
Material Gap
Quality Gate
AI Fix
Predictive Optimization
```

“Coverage gap” is acceptable when it specifically means an unobserved changed region.

The broader actionable object is a **Test Need**.

---

# 24. Route migration guidance

Current routes can evolve as follows:

```text
/ide
KEEP — primary demo entry

/github/pr/184
KEEP — workflow integration

/pull-requests/184/report
KEEP route if convenient — rebuild as Change Report

/change-impact
KEEP — deep impact inspection

/test-selection
REPLACE or redirect to Regression Plan

/coverage
KEEP — deep coverage evidence

/test-health
DEMOTE

/history
KEEP — History & Model Evaluation

/copilot
KEEP but demote — Ask Auracle

/settings
KEEP and revise

/
KEEP overview, but do not use as primary demo start
```

Add if helpful:

```text
/test-needs
/regression-plan
/execution
```

---

# 25. Required working interaction path

The following must be clickable/functional within the prototype:

1. IDE change/push → GitHub PR.
2. GitHub `Review Regression Plan` → Change Report.
3. Change Report exposes Change, Impact, Test Evidence, Test Need and Plan.
4. Test Need → Generate Candidate.
5. Candidate validation steps become visible.
6. Candidate → Review in IDE.
7. IDE → Accept Candidate.
8. Regression Plan updates.
9. Run Plan → execution state.
10. Post-run evidence resolves TN-204.
11. GitHub state becomes PASS WITHIN SUPPORTED SCOPE.
12. Merge completes the demo.

The app should feel like one product, not disconnected mock pages.

---

# 26. Required alternate states

Represent at least these states:

### No Test Need
```text
Existing evidence currently exercises all changed regions within configured policy.
```

### Coverage unknown
```text
Coverage unavailable.
Auracle cannot determine whether this changed region is exercised.
```

### Expected behavior unknown
```text
Human clarification required.
```

### Cold start
```text
Historical model unavailable.
Using deterministic impact + coverage rules.
```

### Historical model available
```text
Historical ranking active.
Used as a ranking enhancement, not as the source of relevance.
```

### Static analysis incomplete
```text
Relationship resolution incomplete.
Selection broadened conservatively.
```

---

# 27. Final demo narrative

The finished prototype must communicate this story by itself:

> A developer changes `PaymentService.refund()` in the IDE and pushes a PR. Auracle analyzes the change and identifies affected code and existing tests. The existing tests execute most of the changed function, but they do not execute the newly introduced retry-exhaustion branch. Auracle creates Test Need TN-204 instead of merely showing a low coverage percentage. It finds an expected-behavior source in the PR description and proposes a candidate pytest regression test. The developer can see exactly what evidence was used, review the candidate in the IDE and accept it. Auracle then constructs a Regression Plan, separately showing which tests are selected and how they are prioritized. The gap-closing candidate runs first, followed by directly related existing tests and impacted caller tests. After execution, Auracle collects actual results and changed-code coverage, verifies that the previously unobserved branch is now executed, resolves TN-204, and reports PASS WITHIN SUPPORTED SCOPE. Every decision has an inspectable “Why?” explanation.

If the UI does not communicate this story clearly, continue revising it.

---

# 28. Important implementation constraints

This remains a high-fidelity frontend prototype.

Do not unnecessarily build:

- FastAPI backend;
- real AST analyzer;
- real pytest runner;
- real ML model;
- real LLM integration.

Instead:

- create realistic mock domain data;
- create coherent state transitions;
- make types backend-ready;
- make screen content match what the future backend will actually produce.

---

# 29. Things you must not do

Do not:

- merely rename old screens while preserving the old story;
- keep the confidence slider as the center of test selection;
- make dashboard the beginning of the primary user journey;
- make AI Copilot the main product;
- use `Risk HIGH` instead of explaining concrete evidence;
- merge selection and prioritization;
- claim coverage proves behavior correctness;
- let AI invent expected behavior;
- make ML required for cold start;
- keep page-local contradictory mock values;
- remove the IDE/GitHub journey;
- replace the current aesthetic unnecessarily;
- implement unrelated backend infrastructure.

---

# 30. Implementation order

Work in this order:

## Pass 1 — Inspect and refactor state

Inspect:

- `src/App.tsx`
- all page components
- `src/data/mockData.ts`
- `src/data/ideContent.ts`
- global CSS
- local page state
- navigation logic

Then:

- create revised domain model;
- centralize demo scenario state;
- update routes/navigation.

## Pass 2 — Core journey

Implement first:

- IDE
- GitHub PR
- Change Report
- Test Need
- Candidate generation
- Regression Plan
- Execution
- GitHub final state

Do not polish secondary analytics before this full path works.

## Pass 3 — Supporting screens

Update:

- Impact
- Coverage
- History
- Settings
- Overview

## Pass 4 — Secondary areas

Update/demote:

- Ask Auracle
- Test Health

## Pass 5 — polish

- reusable components;
- terminology consistency;
- empty/error/unknown states;
- responsive behavior;
- interaction details;
- build/type errors.

---

# 31. Required deliverable file

After modifying the implementation, create:

```text
AURACLE_UI_REDESIGN_IMPLEMENTATION.md
```

Document:

1. files changed;
2. routes changed/added;
3. components added/extracted;
4. domain/mock-data changes;
5. shared demo-state architecture;
6. old concepts removed/de-emphasized;
7. new product concepts introduced;
8. complete final demo journey;
9. known prototype limitations;
10. anything requested here that was not implemented and why.

---

# 32. Validation

Run the relevant configured commands, especially:

```bash
npm run build
```

and lint/type-check commands if available.

Fix all errors introduced by your changes.

Then manually trace:

```text
IDE
→ Push
→ GitHub REVIEW REQUIRED
→ Change Report
→ Impact
→ Existing Test Evidence
→ TN-204
→ Behavior Source
→ Generate Candidate
→ Candidate Validation
→ Review in IDE
→ Accept Candidate
→ Regression Plan
→ Execution
→ Final Evidence
→ GitHub PASS WITHIN SUPPORTED SCOPE
→ Merge
```

At each step ask:

```text
Does the user understand:
1. what happened?
2. why Auracle reached the conclusion?
3. what evidence supports it?
4. what action should happen next?
```

If any answer is not obvious from the UI, revise that step before considering the task complete.
