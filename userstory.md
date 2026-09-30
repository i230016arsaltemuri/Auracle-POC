# Auracle — Complete End-to-End User Journey and Product Flow

## 1. The Story Starts Before Auracle Exists

Consider a software team maintaining a reasonably large Python application.

The repository may look something like:

```text
payment-platform/
│
├── app/
│   ├── payments/
│   ├── refunds/
│   ├── users/
│   ├── notifications/
│   └── reports/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── api/
│
├── requirements.txt
└── .github/workflows/
```

The application has gradually grown over several years.

It now has:

```text
2,000+ automated tests
25–40 minute CI execution time
multiple developers
hundreds of modules
shared dependencies
frequently changing functionality
```

The team already uses:

```text
Git
GitHub
GitHub Actions
pytest
pytest-cov / coverage.py
```

These tools work.

Auracle is **not replacing them**.

The problem is that these tools individually know very little about the relationship between a code change and the testing decision that should follow from it.

The developer changes code.

Git knows:

> These lines changed.

pytest knows:

> These tests passed or failed.

coverage.py knows:

> These lines were executed.

GitHub Actions knows:

> This CI job succeeded or failed.

But none of those systems, by themselves, answer the complete question:

> What exactly did this change affect, which tests matter for this specific change, which ones should run first, what is still uncovered, and is there enough evidence to safely consider the change sufficiently tested?

That is the gap Auracle occupies. The product is intended to sit above the existing testing infrastructure rather than replacing the test runner or CI platform.

---

# 2. What Happens Today Without Auracle

Imagine our developer is named **Ahmed**.

Ahmed receives a task:

> Add partial refunds to the Payment Service.

He creates a branch:

```bash
git checkout -b feature/partial-refund
```

He modifies:

```text
app/payments/refund_service.py
app/payments/payment_repository.py
```

He adds a new condition:

```python
if refund_amount < original_payment.amount:
    process_partial_refund(...)
```

Ahmed knows he modified refund functionality.

What he does **not necessarily know** is everything that indirectly depends on it.

Perhaps this method is called by:

```text
RefundController
PaymentAPI
SubscriptionCancellationService
InvoiceAdjustmentService
```

And those systems are tested by:

```text
test_refund_success
test_refund_failure
test_partial_refund
test_cancel_subscription
test_invoice_adjustment
test_payment_api
```

Ahmed sees two files.

The real change may propagate through ten components.

---

# 3. Ahmed's Current Testing Decision

Without Auracle, Ahmed has several options.

### Option 1 — Run a few tests he remembers

He runs:

```bash
pytest tests/unit/test_refund_service.py
```

The tests pass.

But this creates an important uncertainty:

> Were these actually all the tests affected by the change?

He doesn't know.

---

### Option 2 — Search manually

Ahmed searches the repository for:

```text
RefundService
process_refund
PaymentRepository
```

Then manually looks at related test files.

This can work in small projects.

But in a large system this becomes difficult because relationships are not always obvious.

There may be:

```text
indirect dependencies
shared utility functions
runtime relationships
historical relationships
integration tests
parameterized tests
fixtures
mocked components
```

---

### Option 3 — Run everything

Ahmed runs:

```bash
pytest
```

Now he has higher confidence.

But perhaps the complete test suite takes:

```text
32 minutes
```

and Ahmed changed only one small part of the repository.

The team therefore spends large amounts of CI compute repeatedly executing tests that have almost no relationship with many changes.

---

# 4. The Existing CI Experience

Ahmed pushes:

```bash
git push origin feature/partial-refund
```

and creates:

```text
PR #184 — Add Partial Refund Support
```

GitHub Actions begins.

The pipeline essentially does:

```text
Checkout
↓
Install dependencies
↓
Run tests
↓
Generate coverage
↓
PASS / FAIL
```

Eventually GitHub says:

```text
✓ 2,147 tests passed
✓ Coverage: 87%
✓ Build successful
```

At first sight, this looks excellent.

But important questions remain unanswered.

For example:

```text
Was the newly added partial-refund branch tested?

Which tests actually exercised the changed code?

Did tests relevant to PaymentRepository run?

Did we execute hundreds of unrelated tests?

Does this change historically correlate with failures elsewhere?

Is 87% repository coverage meaningful for this specific change?

Did we miss a newly introduced branch?
```

A **green CI pipeline only proves that the tests which ran passed**.

It does not automatically prove that the correct tests were chosen or that the changed behavior was sufficiently exercised. That distinction is one of Auracle's core principles.

---

# 5. The Team Decides to Introduce Auracle

Now the organization installs Auracle into this repository.

For the FYP/MVP flow, Auracle's primary target is:

```text
Python
pytest
Git
GitHub
GitHub Actions
pytest-cov / coverage.py
```

The broader architecture can later support additional ecosystems, but the FYP implementation remains deliberately narrower.

The important conceptual change is:

```text
Before:

GitHub
   ↓
pytest
   ↓
PASS / FAIL


After:

GitHub
   ↓
Auracle
   ↓
Understand Change
   ↓
Understand Impact
   ↓
Understand Tests
   ↓
Select Tests
   ↓
pytest
   ↓
Collect Evidence
   ↓
Evaluate Risk
   ↓
PASS / FAIL / REVIEW REQUIRED
```

Auracle becomes the **testing intelligence layer** between source-control changes and the existing test infrastructure.

---

# 6. Installing Auracle

There are effectively two places where Auracle participates.

```text
Developer / Repository environment

AND

CI environment
```

For a simple Python installation, the project can install the package:

```bash
pip install auracle
```

The repository can then initialize Auracle:

```bash
auracle init
```

Conceptually, initialization does several things.

Auracle identifies:

```text
Repository
Programming language
Test framework
Coverage provider
Git metadata
Default branch
Project structure
```

For this repository it may determine:

```text
Language: Python
Test Framework: pytest
Coverage Provider: pytest-cov
SCM: Git
Provider: GitHub
Default Branch: main
```

Auracle can create repository-specific configuration, for example conceptually:

```yaml
repository:
  default_branch: main

language:
  primary: python

testing:
  framework: pytest

coverage:
  provider: pytest-cov

selection:
  mode: shadow

risk:
  policy: default
```

The precise configuration format can evolve, but the user's mental model should remain simple:

> Tell Auracle what repository it is observing and how that repository already runs tests.

The CLI defined by the PRD includes commands such as `auracle init`, `auracle analyze`, `auracle impact`, `auracle predict`, `auracle run`, `auracle report`, and `auracle gate`.

---

# 7. Initial Repository Onboarding

After initialization, Auracle needs to understand the repository.

The user should not manually map every file and test.

Auracle performs that analysis.

The onboarding pipeline looks conceptually like:

```text
Repository connected
        ↓
Repository scanned
        ↓
Python files discovered
        ↓
Tests discovered
        ↓
ASTs generated
        ↓
Functions/classes/imports extracted
        ↓
Dependency relationships created
        ↓
Initial coverage imported/generated
        ↓
Initial test execution history recorded
        ↓
Repository becomes ready
```

For every Python source file, Auracle can extract structures such as:

```text
module
class
function
method
import
function call
inheritance
decorator
definition
reference
```

This is done through static analysis rather than asking an LLM to guess repository relationships.

---

# 8. Auracle Builds Its Understanding of the Repository

Suppose Auracle discovers:

```text
refund_service.py
 ├─ RefundService
 │   ├─ refund()
 │   ├─ partial_refund()
 │   └─ validate_refund()
 │
 └─ imports
     ├─ PaymentRepository
     └─ NotificationService
```

It also discovers test relationships.

Conceptually:

```text
RefundService.refund()
        ↑
        │ covered by
        │
test_refund_success

RefundService.refund()
        ↑
        │ covered by
        │
test_refund_failure
```

And perhaps:

```text
PaymentRepository
        ↓
RefundService
        ↓
PaymentAPI
        ↓
test_payment_api
```

Auracle begins forming a **dependency and impact graph**.

The graph connects concepts such as:

```text
File
Function
Class
Test
Coverage
Execution
History
```

The PRD describes these relations explicitly—for example files importing files, functions calling functions, and tests covering functions/files.

---

# 9. The First Important Difference: Cold Start

At this point Auracle has static structure and perhaps coverage information.

But it does **not yet have months of historical test data**.

Auracle therefore should not pretend its predictive model already knows everything.

Instead the repository enters:

```text
COLD START
```

Auracle initially relies more heavily on:

```text
Static impact analysis
+
Coverage relationships
+
Deterministic prioritization
```

Every test run then creates new historical evidence.

Over time:

```text
Execution 1
Execution 2
Execution 3
...
Execution 500
```

Auracle learns patterns such as:

```text
test_refund_failure
frequently fails after
refund_service.py changes
```

The PRD explicitly requires this cold-start strategy and says that the system must remain useful without ML history.

---

# 10. Shadow Mode Comes First

The team should not immediately allow Auracle to eliminate tests from production CI.

Instead Auracle initially runs in:

```text
SHADOW MODE
```

The normal full suite still executes.

Suppose:

```text
Actual full suite:
2,147 tests

Auracle predicted:
126 tests
```

Auracle does **not yet prevent the remaining tests from executing**.

Instead it asks:

```text
If we had executed only those 126 tests...

Would we have detected every failure?
How much runtime would we have saved?
Did any test outside the selection fail?
```

For example:

```text
Full suite failures: 3

Failures inside Auracle selection: 3

Missed failures: 0

Potential runtime reduction: 71%
```

The organization gradually builds evidence that the selector behaves acceptably before trusting selective execution. This comparison between predicted subsets, actual failures, missed failures, and potential time savings is a required part of Auracle's shadow mode.

---

# 11. Now Return to Ahmed

Several weeks later, Ahmed again works on the refund service.

He opens:

```text
app/payments/refund_service.py
```

and changes:

```python
def refund(payment, refund_amount):
```

He adds a new branch for:

```text
partial refund of international payments
```

Nothing unusual happens while he codes.

Auracle is **not supposed to constantly interrupt him**.

He continues using:

```text
VS Code
Git
pytest
GitHub
```

as before.

---

# 12. Ahmed Commits His Work

Ahmed commits:

```bash
git add .
git commit -m "Support partial refunds for international payments"
```

Then:

```bash
git push
```

This is where Auracle's automated workflow begins.

---

# 13. GitHub Creates the Change Context

The branch is now compared against:

```text
main
```

Auracle receives the relevant revisions:

```text
Base revision:
92ac81

Target revision:
a92f31
```

The system computes:

```text
git diff 92ac81..a92f31
```

Now Auracle knows exactly which source change it must reason about.

---

# 14. Auracle Stage 1 — Change Intelligence

Auracle asks:

> What changed?

It identifies:

```text
Files changed: 3
Lines added: 47
Lines deleted: 12
Functions modified: 4
Imports changed: 1
```

Perhaps:

```text
refund_service.py
  modified:
    refund()
    validate_refund()

payment_repository.py
  modified:
    save_refund()

refund_constants.py
  added:
    PARTIAL_REFUND_LIMIT
```

It may also classify the change:

```text
Change type:
Behavior Modification
```

That classification is advisory.

It does **not** automatically determine the testing decision.

Auracle's change intelligence is intended to track files, functions, classes, imports, modified regions, and related metadata between a base and target revision.

---

# 15. Stage 2 — Structural Analysis

Next Auracle asks:

> What software structures were affected?

The Python AST analyzer parses the changed files.

Auracle discovers that:

```text
RefundService.refund()
    calls
PaymentRepository.save_refund()

RefundController
    calls
RefundService.refund()

SubscriptionCancellationService
    calls
RefundService.refund()
```

The change therefore affects more than the file Ahmed edited.

Auracle updates the repository dependency graph.

---

# 16. Stage 3 — Impact Propagation

Auracle now starts walking through those relationships.

Conceptually:

```text
refund_service.py changed
        ↓
RefundService.refund changed
        ↓
Payment API depends on refund()
        ↓
Subscription cancellation depends on refund()
        ↓
Integration tests depend on those behaviors
```

The system begins generating candidate tests.

---

# 17. Stage 4 — Test Impact Analysis

Auracle evaluates several kinds of evidence.

### Direct Relationship

```text
changed function
    ↓
direct test
```

Example:

```text
RefundService.refund()
        ↓
test_refund_success
```

### Coverage Relationship

Historical coverage says:

```text
test_refund_failure

previously executed
RefundService.refund()
```

Therefore it is relevant.

### Dependency Relationship

```text
refund()
  ↓
SubscriptionCancellationService
  ↓
test_cancel_subscription
```

### Historical Relationship

Auracle's history says:

```text
When refund_service.py changed previously,
test_payment_api failed 4 times.
```

### Runtime Relationship

If runtime traces are available later, they can provide another signal.

The PRD defines these structural, coverage, dependency, historical, and runtime relationships as the inputs to test-impact analysis.

---

# 18. Auracle Creates the Candidate Test Set

The repository contains:

```text
2,147 tests
```

Auracle may determine:

```text
Structurally related tests: 83
Coverage-related tests: 57
Historically related tests: 22
```

After combining overlaps:

```text
Candidate tests: 104
```

Now Auracle has reduced the problem from:

> Which of 2,147 tests matter?

to:

> How should these 104 evidence-backed candidates be prioritized?

---

# 19. Stage 5 — Coverage Intelligence

Now Auracle examines coverage.

Traditional coverage says:

```text
Repository coverage:
87%
```

Auracle asks a different question:

> How much of Ahmed's changed code is covered?

Suppose Ahmed modified:

```text
47 executable lines
```

and existing evidence covers:

```text
36 lines
```

Auracle reports:

```text
Changed-code coverage:
76.6%
```

This number is much more directly relevant to Ahmed's PR than global repository coverage.

The product explicitly distinguishes repository-wide coverage from **change-aware coverage**, where coverage is calculated against the changed behavior.

---

# 20. Auracle Detects a Gap

Auracle sees something important.

The new branch:

```python
if payment.country != "PK" and refund_amount < payment.amount:
```

has never been executed by an existing test.

Auracle therefore records:

```text
COVERAGE GAP

RefundService.refund()
    ↓
new international partial refund branch
    ↓
no validated test coverage
```

This is materially different from:

```text
Tests passed.
```

Auracle is not claiming the implementation is wrong.

It is saying:

> There is currently insufficient testing evidence for this changed behavior.

Coverage gaps should be explicitly categorized as covered, partially covered, uncovered, or unknown.

---

# 21. Stage 6 — Historical Intelligence

Auracle checks previous executions.

For every test it may already know:

```text
Pass rate
Failure rate
Average duration
Recent failures
Flakiness
Change relationships
Coverage relationships
```

For example:

```text
test_refund_failure
failure rate: 8%
avg runtime: 0.7 sec
strong historical association with refund changes

test_payment_api
failure rate: 2%
avg runtime: 4.8 sec
moderate relationship

test_login
failure rate: 0.3%
no meaningful refund relationship
```

Each execution continuously adds records such as status, duration, commit, timestamp, and environment.

---

# 22. Stage 7 — Predictive Test Selection

Auracle now asks:

> Given this change and everything we know, which tests provide the highest-value feedback?

The model considers signals such as:

```text
changed files
changed symbols
dependency distance
coverage relationship
historical failure relationship
test duration
recent test failures
impact score
```

The system may produce:

```text
1. test_refund_failure
   Score: 0.96
   Reason:
   - directly covers changed function
   - historically failed after similar changes
   - short runtime

2. test_partial_refund
   Score: 0.94
   Reason:
   - directly related to modified refund behavior

3. test_payment_api
   Score: 0.88
   Reason:
   - dependent API path
   - previous coverage relationship

4. test_cancel_subscription
   Score: 0.72
   Reason:
   - indirect dependency relationship

...

104. test_login
     Score: 0.01
     Reason:
     - no meaningful relationship
```

The predictive layer is designed to rank tests rather than blindly reducing the number of tests, and it should retain machine-readable explanations for selections.

---

# 23. The User Can Choose a Selection Policy

The repository may use a policy such as:

```text
Confidence target:
90%
```

Auracle selects enough tests to reach that target.

Another project could say:

```text
Time budget:
5 minutes
```

Another could say:

```text
Run approximately 30% of expected test time.
```

The team's testing policy remains configurable.

Auracle does not enforce one universal strategy. The PRD provides confidence-target, time-budget, and percentage-based selection modes.

---

# 24. Stage 8 — Risk Engine

At the same time Auracle calculates change risk.

Signals may include:

```text
change size
structural impact
critical component involvement
changed-code coverage
historical failure association
flaky tests
prediction confidence
dependency depth
testing gaps
```

For Ahmed's change:

```text
Change size:
Moderate

Structural impact:
High

Changed-code coverage:
76%

Historical risk:
Moderate

Coverage gap:
1 material branch

Prediction confidence:
91%
```

Auracle therefore reports:

```text
Evidence Risk:
HIGH / REVIEW REQUIRED
```

Importantly, this does **not** mean:

> Auracle knows the code contains a bug.

It means:

> Evidence supporting this change is currently insufficient.

Risk is explicitly defined as a decision-support signal rather than a claim of certainty.

---

# 25. Stage 9 — Auracle Builds the Execution Plan

After combining:

```text
Change intelligence
+
Impact analysis
+
Coverage
+
History
+
Prediction
+
Risk
```

Auracle creates a test execution plan.

For example:

```yaml
change:
  commit: a92f31

selection:
  strategy: predictive
  confidence_target: 0.90

tests:
  - test_refund_failure
  - test_refund_success
  - test_partial_refund
  - test_payment_api
  - test_cancel_subscription
```

Auracle has now decided **what should execute**.

But Auracle itself is still not a testing framework.

---

# 26. Stage 10 — pytest Still Executes the Tests

Auracle calls the existing test runner.

Conceptually:

```text
Auracle
   ↓
pytest
```

For example:

```bash
pytest \
tests/test_refunds.py::test_refund_failure \
tests/test_refunds.py::test_refund_success \
tests/test_refunds.py::test_partial_refund \
tests/api/test_payment_api.py \
tests/subscriptions/test_cancel_subscription.py
```

pytest remains responsible for actually executing the tests. This runner separation is a hard architectural principle in the PRD.

---

# 27. Stage 11 — Execution Happens

The runner executes the selected tests.

Suppose:

```text
test_refund_success          PASS
test_refund_failure          PASS
test_partial_refund          FAIL
test_payment_api             PASS
test_cancel_subscription     PASS
```

Auracle records:

```text
repository
commit
branch
PR
runner
command
selected tests
executed tests
result
duration
coverage artifact
environment
timestamp
```

This creates a reproducible evidence trail for the quality decision.

---

# 28. Stage 12 — Coverage Is Recalculated

After those tests execute, Auracle ingests the new coverage artifact.

Previously:

```text
Changed-code coverage:
76%
```

After execution:

```text
Changed-code coverage:
89%
```

However, the newly introduced international partial-refund branch may still be uncovered.

So Auracle does **not** say:

```text
Everything is fine.
```

It retains the unresolved gap.

---

# 29. Stage 13 — Evidence Is Updated

The execution creates new historical intelligence.

Auracle updates:

```text
test_partial_refund
    ↓
failed after refund_service change

refund_service.py
    ↓
stronger historical association
    ↓
test_partial_refund
```

Future predictions now have better evidence.

The system is therefore continuously learning from normal CI activity.

---

# 30. Stage 14 — Quality Gate

Now Auracle evaluates the change.

It asks:

```text
Did required relevant tests execute?

Did they pass?

Is changed behavior sufficiently covered?

Are high-risk uncovered areas present?

Were prediction misses detected?

Are there unresolved testing needs?

Is the evidence inside supported scope?
```

In Ahmed's example:

```text
Relevant tests executed:
YES

Relevant tests passed:
NO

Material coverage gap:
YES
```

Therefore:

```text
AURACLE QUALITY GATE

STATUS: FAIL / REVIEW REQUIRED
```

The quality gate is not merely looking at a single pass/fail signal. It considers execution, changed behavior coverage, risk, missed failures, authority conflicts, and evidence sufficiency.

---

# 31. What Ahmed Sees in GitHub

Ahmed does not need to open Auracle immediately.

The PR receives an Auracle report.

For example:

```text
─────────────────────────────────────
AURACLE TEST INTELLIGENCE
─────────────────────────────────────

PR #184
Add Partial Refund Support

CHANGE
3 files changed
4 functions affected

IMPACT
104 potentially relevant tests
37 strongly relevant tests

TEST SELECTION
24 tests selected
Estimated runtime: 3m 42s

EXECUTION
23 passed
1 failed

COVERAGE
Repository coverage: 87%
Changed-code coverage: 89%

RISK
REVIEW REQUIRED

MAIN ISSUE
RefundService.refund()
international partial-refund branch
has no validated regression coverage.

FAILED TEST
test_partial_refund

[Open Auracle Report]
─────────────────────────────────────
```

This PR-level reporting is part of the intended product experience.

---

# 32. Ahmed Now Opens the Auracle Dashboard

This is where the deeper investigation begins.

The landing page gives Ahmed an overview:

```text
Repository
Latest pull requests
Testing risk
Coverage trend
Test health
Saved execution time
```

He sees:

```text
PR #184    REVIEW REQUIRED
```

and clicks it.

The PRD specifies the dashboard around repository overview, change reports, test intelligence, predictive testing, and coverage visibility.

---

# 33. PR / Change Report Screen

Ahmed now sees the full change report.

At the top:

```text
PR #184
Partial Refund Support

Commit:
a92f31

Files changed:
3

Functions affected:
4

Relevant tests:
37

Selected tests:
24

Changed coverage:
89%

Prediction confidence:
91%

STATUS:
REVIEW REQUIRED
```

Below it are different investigation sections.

---

# 34. Ahmed Opens “Change Impact”

The Change Impact screen answers:

> What did my code change affect?

Auracle may show:

```text
RefundService.refund()
        │
        ├── PaymentRepository
        │
        ├── RefundController
        │       └── PaymentAPI
        │
        └── SubscriptionCancellationService
```

And then:

```text
Affected Tests
│
├── test_refund_success
├── test_refund_failure
├── test_partial_refund
├── test_payment_api
└── test_cancel_subscription
```

Ahmed no longer has to manually search the repository trying to infer these relationships.

---

# 35. Ahmed Opens “Test Selection”

This screen answers:

> Why did Auracle run these tests?

He sees a ranked table conceptually like:

| Test | Score | Reason |
|---|---:|---|
| test_refund_failure | 0.96 | Direct coverage + historical relation |
| test_partial_refund | 0.94 | Direct changed behavior |
| test_payment_api | 0.88 | Dependency + coverage |
| test_cancel_subscription | 0.72 | Dependency relationship |

He can click any individual test.

---

# 36. Individual Test Explanation

Ahmed clicks:

```text
test_refund_failure
```

Auracle shows:

```text
Selected because:

✓ Covers RefundService.refund()
✓ The function changed in this PR
✓ Similar previous changes caused this test to fail
✓ Average execution time is low
✓ Prediction score: 0.96
```

This explainability is important because engineers should not be expected to trust an unexplained machine-learning score.

The PRD requires every selected test to retain its rank, score, coverage evidence, historical evidence, execution cost, reason, and model version.

---

# 37. Ahmed Opens “Coverage”

The coverage screen does not simply show:

```text
87%
```

Instead he sees:

```text
Global Coverage
87%

Changed-Code Coverage
89%

Changed Branch Coverage
72%
```

Auracle highlights the changed function:

```text
RefundService.refund()
```

Perhaps visually:

```text
Line 102  ✓ covered
Line 103  ✓ covered
Line 104  ✓ covered

Line 105  + if international_payment:
Line 106  +     if partial_refund:
Line 107  +         apply_exchange_adjustment()

               ↑
             UNCOVERED
```

Ahmed now knows exactly what testing evidence is missing.

---

# 38. Ahmed Opens “Risk”

The Risk screen explains:

```text
Overall Evidence Risk:
HIGH
```

Not because Auracle magically knows the code is defective.

But because:

```text
+ Important payment component changed
+ New control-flow branch introduced
+ Branch has no validated coverage
+ Historically sensitive component
+ One relevant test currently failing
```

The explanation remains evidence-based.

---

# 39. Ahmed Uses the AI Copilot

Ahmed could technically inspect all of these panels himself.

But he can also ask:

> Why is this PR marked Review Required?

Auracle's AI receives structured evidence such as:

```json
{
  "change": {},
  "affected_symbols": [],
  "impact": [],
  "coverage": {},
  "historical_tests": [],
  "selection": [],
  "execution": {},
  "risk": {},
  "gaps": []
}
```

The AI then explains:

```text
This PR is marked Review Required primarily because the
new international partial-refund branch in
RefundService.refund() does not currently have validated
test coverage.

Additionally, test_partial_refund failed during the
selected execution set.

The assessment is based on change analysis, coverage
evidence and the recorded test execution.
```

The crucial architecture is:

```text
Evidence first
↓
LLM explanation second
```

not:

```text
Git diff
↓
LLM guesses what tests matter
```

The PRD explicitly requires the LLM to sit on top of structured deterministic evidence, rather than being the source of truth.

---

# 40. Ahmed Asks Another Question

Ahmed asks:

> What test am I missing?

Auracle can answer:

```text
The main uncovered behavior is:

RefundService.refund()
→ international payment
→ partial refund
→ exchange adjustment path

No validated test currently covers this branch.

Suggested testing need:
Add a regression test exercising a partial refund
for an international payment.
```

Notice the wording:

Auracle identifies a **testing need**.

It does not fabricate proof that a proposed test is correct.

---

# 41. Optional Future Flow — AI Test Suggestion

If AI-assisted test generation is enabled later, the flow remains controlled.

```text
Coverage gap detected
        ↓
Testing need identified
        ↓
AI proposes candidate test
        ↓
Developer reviews it
        ↓
Developer accepts/modifies it
        ↓
Test added
        ↓
Test executed
        ↓
Coverage verified
        ↓
Evidence stored
```

Auracle does not silently write a test and declare the problem solved.

The developer remains the authority over accepting generated code.

---

# 42. Ahmed Fixes the Problem

Ahmed investigates the failed test.

Perhaps the implementation contained a genuine bug.

He modifies:

```python
apply_exchange_adjustment(...)
```

Then adds:

```python
def test_partial_refund_international_payment():
    ...
```

He commits:

```bash
git commit -m "Fix international partial refund and add regression test"
git push
```

A new Auracle analysis begins.

---

# 43. Auracle Does Not Start From Zero

Auracle does not need to rebuild the entire repository model every time.

Instead:

```text
Existing graph
+
new changed files
↓
incremental update
```

Only affected artifacts are reanalyzed where possible.

Caching includes things such as:

```text
ASTs
parsed files
dependency relationships
test discovery
coverage mappings
history
ML features
```

This is important for keeping PR feedback fast. The PRD explicitly prefers incremental graph updates and targeted cache invalidation over rebuilding everything.

---

# 44. The Second Analysis

Auracle now reports:

```text
Changed files:
2

Affected tests:
29

Selected tests:
17
```

Coverage after running the new test:

```text
Changed-code coverage:
98%
```

Branch coverage:

```text
International partial refund:
COVERED
```

Selected test execution:

```text
17 / 17 passed
```

Material gaps:

```text
0
```

---

# 45. Quality Gate Re-evaluates

Auracle now asks:

```text
Required tests executed?
YES

Required tests passed?
YES

Material changed behavior covered?
YES

High-risk uncovered area?
NO

Outstanding supported-scope action?
NO

Evidence sufficient?
YES
```

The result becomes:

```text
SATISFIED WITHIN SUPPORTED SCOPE
```

This wording matters.

Auracle is not claiming:

> This software has zero bugs.

It is saying:

> Within the system's supported testing scope, the identified testing needs for this change now have sufficient evidence.

The PRD's definition of done requires relevant testing evidence, required tests, available results, resolved material gaps, sufficient behavioral authority, and no outstanding supported-scope action.

---

# 46. GitHub Now Shows the Updated Result

The PR comment changes:

```text
─────────────────────────────────────
AURACLE TEST INTELLIGENCE
─────────────────────────────────────

PR #184

Relevant tests:
29

Selected tests:
17

Execution:
17 passed

Changed-code coverage:
98%

Unresolved testing gaps:
0

Risk:
LOW EVIDENCE RISK

STATUS:
SATISFIED WITHIN SUPPORTED SCOPE
─────────────────────────────────────
```

The GitHub quality check becomes green.

The Tech Lead can review the PR knowing not only:

```text
tests passed
```

but also:

```text
what changed
what was affected
which tests mattered
why those tests were selected
what they covered
whether important gaps remain
what evidence supports the final decision
```

---

# 47. The Tech Lead's Experience

Now imagine Sara is the Tech Lead reviewing Ahmed's PR.

Without Auracle, she sees:

```text
✓ CI Passed
✓ 2,147 tests passed
```

With Auracle, she sees:

```text
Change Risk
Impact
Relevant Tests
Changed-Code Coverage
Coverage Gaps
Execution Results
Selection Confidence
Reasoning
```

She does not necessarily need to understand the internals of the predictive model.

She needs the answer to:

> Why should I trust this testing result?

Auracle provides the evidence trail.

---

# 48. The QA Engineer's Experience

The QA Engineer may interact with Auracle differently.

They may spend more time inside:

```text
Coverage
Test Health
Historical Trends
Missing Testing Evidence
```

They can identify:

```text
flaky tests
slow tests
frequently failing tests
coverage gaps
repeated high-risk components
```

For example:

```text
Top flaky tests

test_payment_timeout       18%
test_currency_conversion   12%
test_refund_retry           9%
```

The test-health subsystem is intended to surface flaky, slow, frequently failing, and rarely failing tests for investigation.

---

# 49. The DevOps Engineer's Experience

The DevOps engineer focuses more on:

```text
CI runtime
test execution savings
selection reliability
missed failures
prediction confidence
```

Suppose historical statistics show:

```text
Average full suite:
31m 42s

Average Auracle selection:
8m 17s

Average reduction:
73%

Failure recall:
94%

Missed failures:
2 during evaluation period
```

These metrics help determine whether selective execution should remain conservative or become more aggressive.

Auracle's evaluation explicitly tracks failure recall, test reduction, time savings, missed failures, and precision.

---

# 50. The Engineering Manager's Experience

The manager does not inspect AST relationships.

They see aggregated trends:

```text
CI time saved
Testing risk trend
Coverage trend
Flaky-test trend
Predictive accuracy
Missed failures
Repository quality history
```

For example:

```text
Last 30 days

CI hours saved:
68

Average selection reduction:
61%

Changed-code coverage:
84% → 92%

Flaky tests:
23 → 11
```

The same underlying intelligence serves different personas at different levels.

---

# 51. Periodic Full Runs Still Happen

Even after Auracle becomes trusted, the full suite should not disappear forever.

The repository may use:

```text
Every PR:
Auracle-selected tests

Every night:
Full suite

Every release:
Full suite
```

Why?

Because full runs provide a defense against:

```text
prediction mistakes
model drift
new dependencies
stale coverage relationships
unexpected failures
```

The PRD explicitly requires defensive full-suite execution for validation, drift control, coverage refresh, and missed-failure discovery.

---

# 52. What Happens If Auracle Misses Something?

Suppose Auracle selects:

```text
40 tests
```

but the nightly full suite later discovers:

```text
test_invoice_reconciliation FAILED
```

and that test was not selected.

Auracle records:

```text
MISSED FAILURE
```

That becomes important feedback.

The relationship:

```text
refund change
↓
invoice reconciliation failure
```

now becomes historical training/evaluation evidence.

The next similar change may rank that test much higher.

Auracle therefore does not hide its mistakes.

Missed failures are an explicit metric.

---

# 53. What Happens If the Model Becomes Unreliable?

Auracle monitors things such as:

```text
failure recall
missed failures
repository architecture changes
test suite changes
distribution changes
framework changes
```

If predictive performance deteriorates:

```text
Prediction confidence
        ↓
below threshold
        ↓
Broader test selection
```

Auracle should become more conservative rather than quietly continue reducing the test suite.

The PRD specifically requires fallback to conservative selection when model performance degrades or confidence becomes insufficient.

---

# 54. What Happens When Auracle Does Not Know?

Several cases can occur.

### No historical data

Auracle says:

```text
COLD START
```

not:

```text
Low risk
```

---

### No coverage

Auracle says:

```text
COVERAGE UNKNOWN
```

---

### Parser failure

Auracle says:

```text
STATIC ANALYSIS INCOMPLETE
```

---

### Unsupported framework

Auracle says:

```text
OUT OF SUPPORTED SCOPE
```

---

### Conflicting behavioral evidence

Auracle says:

```text
HUMAN DECISION REQUIRED
```

---

### Model unavailable

Auracle falls back to:

```text
Impact-based selection
```

This explicit abstention is important.

Unknown information must remain **unknown** rather than silently being treated as evidence of safety.

---

# 55. The Complete User-Facing Lifecycle

From Ahmed's perspective, the whole experience can therefore be understood as:

```text
────────────────────────────────────────────

1. I write code.

             ↓

2. I commit and push normally.

             ↓

3. I create/update my GitHub PR.

             ↓

4. Auracle automatically receives the change.

             ↓

5. Auracle determines exactly what changed.

             ↓

6. Auracle understands the changed code structure.

             ↓

7. Auracle traces what components may be affected.

             ↓

8. Auracle finds tests related to those components.

             ↓

9. Auracle checks historical runtime coverage.

             ↓

10. Auracle checks historical test behavior.

             ↓

11. Auracle predicts which tests provide the
    most useful feedback.

             ↓

12. Auracle calculates testing risk.

             ↓

13. Auracle creates an execution plan.

             ↓

14. My existing test runner executes the tests.

             ↓

15. Auracle receives execution results.

             ↓

16. Auracle receives coverage results.

             ↓

17. Auracle updates historical intelligence.

             ↓

18. Auracle determines whether testing gaps remain.

             ↓

19. Auracle generates the quality-gate decision.

             ↓

20. I see a concise result directly inside GitHub.

             ↓

21. If something is wrong, I open the Auracle Dashboard.

             ↓

22. I investigate:

       Change Impact
       Test Selection
       Coverage
       Risk
       Test Results
       History

             ↓

23. If needed, I ask the AI Copilot:

       "Why is this risky?"
       "Why was this test selected?"
       "What am I missing?"
       "What should I investigate?"

             ↓

24. I modify the code/test.

             ↓

25. I push again.

             ↓

26. Auracle reruns the analysis incrementally.

             ↓

27. Required tests execute again.

             ↓

28. Evidence is refreshed.

             ↓

29. Quality Gate changes.

             ↓

30. Once supported-scope testing needs are resolved:

       SATISFIED WITHIN SUPPORTED SCOPE

────────────────────────────────────────────
```

---

# 56. What Happens Inside Auracle During Those Same Steps

The user sees a relatively simple experience.

Internally, much more is happening.

```text
USER
 │
 │ push
 ▼
GitHub
 │
 ▼
GitHub Actions
 │
 ▼
Auracle Ingestion
 │
 ├───────────────┐
 ▼               ▼
Git Diff       Repository Metadata
 │
 ▼
AST Analysis
 │
 ▼
Dependency Graph
 │
 ▼
Impact Analysis
 │
 ├──────────┬───────────────┐
 ▼          ▼               ▼
Coverage   History        Change Info
 │          │               │
 └─────┬────┴───────┬──────┘
       ▼            ▼
 Evidence Fusion    ML Prediction
       │            │
       └──────┬─────┘
              ▼
         Risk Engine
              │
              ▼
        Test Selector
              │
              ▼
      Execution Planner
              │
              ▼
            pytest
              │
              ▼
      Results + Coverage
              │
        ┌─────┴─────┐
        ▼           ▼
     History      Evidence
        │           │
        └─────┬─────┘
              ▼
        Quality Gate
              │
      ┌───────┴────────┐
      ▼                ▼
GitHub PR         Auracle Dashboard
                       │
                       ▼
                  AI Copilot
```

This mirrors the high-level Auracle architecture in the PRD, where Git/CI feed change and evidence engines, impact/history/coverage inform predictive selection and risk, the existing runner executes the plan, and results feed the evidence store and quality gate.

---

# 57. User Navigation Model

The Web Dashboard should make that complex pipeline feel much simpler.

A developer should conceptually navigate through:

```text
Dashboard
│
├── Repository
│
├── Pull Requests
│   └── PR #184
│       ├── Overview
│       ├── Change Impact
│       ├── Test Selection
│       ├── Coverage
│       ├── Risk
│       ├── Execution
│       └── Evidence
│
├── Tests
│   ├── Test Health
│   ├── Flaky Tests
│   ├── Slow Tests
│   └── Test History
│
├── Predictive Testing
│   ├── Selection Accuracy
│   ├── Failure Recall
│   ├── Missed Failures
│   └── Time Savings
│
├── AI Copilot
│
└── Settings
```

The important UX principle is:

**the developer should not need to understand Auracle's architecture in order to use Auracle.**

The backend may contain dozens of moving pieces.

The interface should primarily answer:

```text
WHAT CHANGED?

WHAT DID IT AFFECT?

WHAT TESTS MATTER?

WHAT RAN?

WHAT PASSED/FAILED?

WHAT IS NOT COVERED?

WHAT RISK REMAINS?

WHY?
```

---

# 58. First-Time User Journey vs Daily User Journey

These are actually two different flows.

## First-Time Setup

```text
Discover Auracle
↓
Install Auracle
↓
Connect repository
↓
Detect Python/pytest
↓
Configure coverage
↓
Configure GitHub Actions
↓
Initial repository scan
↓
Discover tests
↓
Build dependency graph
↓
Generate/import baseline coverage
↓
Enable Shadow Mode
↓
Collect history
↓
Evaluate predictions
↓
Enable selective execution
```

This happens relatively infrequently.

---

## Everyday Developer Flow

```text
Write code
↓
Commit
↓
Push
↓
Open/update PR
↓
Auracle analyzes automatically
↓
Relevant tests selected
↓
pytest executes
↓
Evidence collected
↓
Quality gate generated
↓
Developer reads GitHub summary
↓
Open dashboard only when investigation is needed
↓
Fix issue/gap
↓
Push again
↓
Repeat
```

This happens many times every day.

That distinction is important when designing the UX.

Auracle should require configuration during onboarding.

It should require **almost no additional effort during normal development**.

---

# 59. The Ideal Developer Experience

The eventual ideal experience is not:

```text
Developer changes code

Developer opens Auracle

Developer manually enters commit

Developer starts analysis

Developer selects repository

Developer selects tests

Developer downloads report
```

That would create unnecessary friction.

The ideal experience is:

```text
Developer changes code
↓
Developer pushes code
↓
Everything happens automatically
↓
Auracle appears where the developer already works
```

Primarily:

```text
GitHub PR
CI
IDE/CLI where useful
```

The Dashboard becomes the place for deeper investigation rather than something the developer must constantly operate.

---

# 60. The Product's Fundamental Loop

Everything Auracle does ultimately belongs to this loop:

```text
CHANGE
   ↓
UNDERSTAND
   ↓
IMPACT
   ↓
EVIDENCE
   ↓
PREDICT
   ↓
SELECT
   ↓
EXECUTE
   ↓
OBSERVE
   ↓
EVALUATE
   ↓
EXPLAIN
   ↓
LEARN
```

Then the next change arrives.

And the loop repeats.

---

# 61. The Mental Model We Want Users to Have

Ahmed should not think:

> Auracle is an AI that tells me what tests to run.

That undersells and incorrectly describes the product.

He should think:

> Auracle watches every software change, understands what the change affects, connects it to coverage and historical test evidence, determines which tests provide the most useful feedback, observes what actually happened when they ran, identifies anything still insufficiently tested, and explains whether the change has enough evidence to proceed.

That is much closer to what Auracle actually represents.

---

# 62. The Whole Product in One Scenario

The shortest complete story is therefore:

```text
Ahmed modifies RefundService.

Without Auracle:
Ahmed either guesses which tests to run
or waits for the entire suite.

With Auracle:

Ahmed pushes normally.

Auracle sees that refund() changed.

It traces refund() through the repository.

It determines that 37 tests are relevant.

Historical information identifies which of those
tests commonly expose failures.

Coverage identifies a new branch with no evidence.

The predictive model ranks the relevant tests.

Auracle selects 17 tests.

pytest executes them.

One fails.

Auracle records that result and the new coverage.

The quality gate reports REVIEW REQUIRED.

Ahmed opens Auracle.

He sees exactly which branch is uncovered,
which test failed,
which components are affected,
and why the risk exists.

He adds/fixes the test and pushes again.

Auracle incrementally repeats the analysis.

17 relevant tests pass.

The new branch is now covered.

No material supported-scope testing gap remains.

The quality gate changes to:

SATISFIED WITHIN SUPPORTED SCOPE.

The pull request now contains not merely a green checkmark,
but evidence explaining why that checkmark exists.

Meanwhile, the new execution becomes historical data
that makes the next Auracle decision better.
```

That is the **end-to-end Auracle user journey**.

---

# 63. One-Line Product Flow

```text
Developer makes a change
→ Auracle understands the change
→ determines what it affects
→ connects the change to tests and coverage
→ predicts which tests matter most
→ executes them through the existing runner
→ collects results
→ determines remaining testing risk/gaps
→ explains the evidence
→ records what happened
→ becomes better informed for the next change.
```

This is the same core product loop expressed in the PRD's final definition: Auracle must answer what changed, what was affected, which tests are relevant, what is covered, which tests should run, what gaps remain, what happened during execution, and whether the change is sufficiently tested within supported scope.