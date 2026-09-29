// ============================================================
// AURACLE — Mock Data Module
// All data for the PR #184 demonstration scenario
// ============================================================

export const REPO = {
  id: "acme/payments-api",
  name: "payments-api",
  org: "acme",
  fullName: "acme/payments-api",
  url: "https://github.com/acme/payments-api",
  defaultBranch: "main",
  language: "Python",
  framework: "pytest",
  coverage: "pytest-cov",
  lastSync: "2 min ago",
  modelVersion: "v0.6.3",
  modelStatus: "healthy",
  lastFullRun: "8h ago",
  stats: {
    openPRs: 4,
    avgSelectiveRuntime: "5m 08s",
    avgFullRuntime: "27m 12s",
    runtimeSaved: "81%",
    failureRecall: "94.7%",
    changedCodeCoverage: "88%",
    repositoryCoverage: "87%",
  },
};

export const PR = {
  number: 184,
  title: "Add guarded retry to refund processing",
  branch: "feat/refund-retry-policy",
  baseBranch: "main",
  commit: "a92f31e",
  author: {
    name: "Maya Chen",
    username: "mayachen",
    avatar: "MC",
  },
  createdAt: "2026-09-29T08:42:00Z",
  updatedAt: "2026-09-29T09:18:00Z",
  state: "open",
  gate: "FAIL" as "FAIL" | "PASS" | "REVIEW" | "RUNNING",
  risk: "HIGH" as "HIGH" | "MEDIUM" | "LOW" | "UNKNOWN",
  description:
    "Introduces retry handling for transient payment gateway errors in the refund flow. The retry policy is guarded by a configurable maximum retry count and exponential backoff.",
};

export const CHANGE_SUMMARY = {
  filesChanged: 8,
  functionsAffected: 17,
  relevantTests: 42,
  selectedTests: 24,
  changedCodeCoverage: 88,
  changedBranchCoverage: 81,
  confidence: 92,
  selectiveRuntime: "4m 12s",
  fullSuiteRuntime: "26m 48s",
  runtimeReduction: 84,
  addedLines: 126,
  deletedLines: 38,
  materialGaps: 1,
  failedSelectedTests: 1,
};

export const CHANGED_FILES = [
  {
    path: "payments/service.py",
    language: "Python",
    added: 89,
    deleted: 28,
    modified: true,
    changedSymbols: ["PaymentService.refund", "PaymentService._retry_gateway"],
    changedImports: ["RetryPolicy", "GatewayException"],
    classification: "Behavior modification",
    coverage: 81,
    gaps: 1,
    isMainChange: true,
    diff: `@@ -142,18 +142,67 @@ class PaymentService:
     def refund(self, payment_id: str, amount: Decimal) -> RefundResult:
         """Process a refund for a completed payment."""
         payment = self.repository.get_payment(payment_id)
         if not payment:
             raise PaymentNotFoundError(payment_id)
 
-        result = self.gateway.process_refund(payment_id, amount)
-        if result.success:
-            self.repository.save_refund(payment_id, amount, result)
-            return RefundResult(success=True, refund_id=result.refund_id)
-        return RefundResult(success=False, error=result.error)
+        retry_count = 0
+        max_retries = self.retry_policy.max_attempts
+        backoff = self.retry_policy.initial_backoff
+
+        while retry_count <= max_retries:
+            try:
+                result = self.gateway.process_refund(payment_id, amount)
+                if result.success:
+                    self.repository.save_refund(payment_id, amount, result)
+                    return RefundResult(
+                        success=True,
+                        refund_id=result.refund_id
+                    )
+                return RefundResult(success=False, error=result.error)
+            except TransientGatewayError as e:
+                retry_count += 1
+                if retry_count > max_retries:
+                    # RETRY EXHAUSTION — no validated regression test evidence
+                    self.logger.error(
+                        "Refund retry exhausted",
+                        payment_id=payment_id,
+                        attempts=retry_count,
+                    )
+                    raise RetryExhaustedException(
+                        f"Refund failed after {max_retries} attempts"
+                    ) from e
+                time.sleep(backoff)
+                backoff = min(backoff * 2, self.retry_policy.max_backoff)
+
+    def _retry_gateway(
+        self, payment_id: str, amount: Decimal, attempt: int
+    ) -> GatewayResult:
+        """Internal helper for retryable gateway calls."""
+        return self.gateway.process_refund(payment_id, amount)`,
  },
  {
    path: "payments/retry_policy.py",
    language: "Python",
    added: 18,
    deleted: 0,
    modified: false,
    changedSymbols: ["RetryPolicy"],
    changedImports: [],
    classification: "New functionality",
    coverage: 100,
    gaps: 0,
    isMainChange: false,
    diff: `@@ -0,0 +1,18 @@
+from dataclasses import dataclass
+from decimal import Decimal
+
+
+@dataclass
+class RetryPolicy:
+    """Configuration for gateway retry behavior."""
+    max_attempts: int = 3
+    initial_backoff: float = 0.5
+    max_backoff: float = 30.0
+    retryable_errors: tuple = ("TRANSIENT", "TIMEOUT", "RATE_LIMITED")
+
+    def is_retryable(self, error_code: str) -> bool:
+        return error_code in self.retryable_errors`,
  },
  {
    path: "payments/exceptions.py",
    language: "Python",
    added: 8,
    deleted: 0,
    modified: false,
    changedSymbols: ["RetryExhaustedException", "TransientGatewayError"],
    changedImports: [],
    classification: "New functionality",
    coverage: 94,
    gaps: 0,
    isMainChange: false,
    diff: `@@ -12,3 +12,11 @@ class PaymentNotFoundError(Exception):
     pass
 
+
+class TransientGatewayError(Exception):
+    """Raised when the gateway returns a retryable error."""
+    pass
+
+
+class RetryExhaustedException(Exception):
+    """Raised when all retry attempts are exhausted."""
+    pass`,
  },
  {
    path: "api/refunds.py",
    language: "Python",
    added: 5,
    deleted: 3,
    modified: true,
    changedSymbols: ["RefundRouter.create_refund"],
    changedImports: ["RetryExhaustedException"],
    classification: "Behavior modification",
    coverage: 94,
    gaps: 0,
    isMainChange: false,
    diff: `@@ -28,9 +28,11 @@ router = APIRouter()
 async def create_refund(payment_id: str, amount: Decimal):
     try:
         result = payment_service.refund(payment_id, amount)
         return RefundResponse(success=result.success)
-    except PaymentNotFoundError:
-        raise HTTPException(status_code=404)
+    except PaymentNotFoundError:
+        raise HTTPException(status_code=404, detail="Payment not found")
+    except RetryExhaustedException as e:
+        raise HTTPException(status_code=503, detail=str(e))`,
  },
  {
    path: "tests/test_refund.py",
    language: "Python",
    added: 4,
    deleted: 5,
    modified: true,
    changedSymbols: ["test_refund_failure"],
    changedImports: [],
    classification: "Test-only change",
    coverage: 100,
    gaps: 0,
    isMainChange: false,
    diff: `@@ -41,10 +41,9 @@ def test_refund_failure(payment_service, mock_gateway):
     mock_gateway.process_refund.return_value = GatewayResult(
         success=False, error="DECLINED"
     )
-    result = payment_service.refund("pay_001", Decimal("50.00"))
-    assert result.success is False
-    assert "DECLINED" in result.error
+    with pytest.raises(Exception):
+        payment_service.refund("pay_001", Decimal("50.00"))`,
  },
  {
    path: "payments/gateway.py",
    language: "Python",
    added: 2,
    deleted: 2,
    modified: true,
    changedSymbols: ["PaymentGateway.process_refund"],
    changedImports: [],
    classification: "Behavior modification",
    coverage: 88,
    gaps: 0,
    isMainChange: false,
    diff: `@@ -67,6 +67,6 @@ class PaymentGateway:
     def process_refund(self, payment_id: str, amount: Decimal) -> GatewayResult:
-        response = self._send_request("POST", f"/refunds/{payment_id}", {"amount": str(amount)})
+        response = self._send_request("POST", f"/v2/refunds/{payment_id}", {"amount": str(amount), "idempotency_key": payment_id})
         return GatewayResult.from_response(response)`,
  },
  {
    path: "config/settings.py",
    language: "Python",
    added: 3,
    deleted: 0,
    modified: false,
    changedSymbols: ["Settings.retry_policy"],
    changedImports: [],
    classification: "Configuration change",
    coverage: 72,
    gaps: 0,
    isMainChange: false,
    diff: `@@ -18,3 +18,6 @@ class Settings(BaseSettings):
     database_url: str = "postgresql://localhost/payments"
     gateway_api_key: str = ""
     gateway_timeout: int = 30
+    refund_max_retries: int = Field(default=3, env="REFUND_MAX_RETRIES")
+    refund_initial_backoff: float = Field(default=0.5, env="REFUND_INITIAL_BACKOFF")
+    refund_max_backoff: float = Field(default=30.0, env="REFUND_MAX_BACKOFF")`,
  },
  {
    path: "tests/conftest.py",
    language: "Python",
    added: 7,
    deleted: 0,
    modified: false,
    changedSymbols: ["retry_policy_fixture"],
    changedImports: ["RetryPolicy"],
    classification: "Test-only change",
    coverage: 100,
    gaps: 0,
    isMainChange: false,
    diff: `@@ -22,3 +22,10 @@ def payment_service(mock_gateway, mock_repository):
     return PaymentService(gateway=mock_gateway, repository=mock_repository)
+
+
+@pytest.fixture
+def retry_policy():
+    return RetryPolicy(
+        max_attempts=3,
+        initial_backoff=0.1,
+        max_backoff=1.0,
+    )`,
  },
];

export const IMPACT_GRAPH_NODES = [
  {
    id: "PaymentService.refund",
    type: "function",
    changed: true,
    file: "payments/service.py",
    x: 400,
    y: 200,
  },
  {
    id: "PaymentService._retry_gateway",
    type: "function",
    changed: true,
    file: "payments/service.py",
    x: 220,
    y: 320,
  },
  {
    id: "RetryPolicy",
    type: "class",
    changed: true,
    file: "payments/retry_policy.py",
    x: 580,
    y: 120,
  },
  {
    id: "PaymentGateway.process_refund",
    type: "function",
    changed: true,
    file: "payments/gateway.py",
    x: 220,
    y: 120,
  },
  {
    id: "RetryExhaustedException",
    type: "class",
    changed: true,
    file: "payments/exceptions.py",
    x: 580,
    y: 320,
  },
  {
    id: "RefundRepository.save_refund",
    type: "function",
    changed: false,
    file: "payments/repository.py",
    x: 400,
    y: 360,
  },
  {
    id: "RefundRouter.create_refund",
    type: "function",
    changed: true,
    file: "api/refunds.py",
    x: 120,
    y: 200,
  },
  {
    id: "test_refund_failure",
    type: "test",
    changed: false,
    result: "FAIL",
    selected: true,
    file: "tests/test_refund.py",
    x: 620,
    y: 440,
  },
  {
    id: "test_refund_success",
    type: "test",
    changed: false,
    result: "PASS",
    selected: true,
    file: "tests/test_refund.py",
    x: 440,
    y: 480,
  },
  {
    id: "test_payment_api",
    type: "test",
    changed: false,
    result: "PASS",
    selected: true,
    file: "tests/test_payment_api.py",
    x: 200,
    y: 480,
  },
  {
    id: "test_gateway_timeout",
    type: "test",
    changed: false,
    result: "PASS",
    selected: true,
    file: "tests/test_gateway.py",
    x: 80,
    y: 360,
  },
  {
    id: "test_tax_calculation",
    type: "test",
    changed: false,
    result: "PASS",
    selected: true,
    file: "tests/test_tax.py",
    x: 260,
    y: 20,
  },
];

export const IMPACT_GRAPH_EDGES = [
  {
    source: "PaymentService.refund",
    target: "PaymentGateway.process_refund",
    type: "calls",
  },
  {
    source: "PaymentService.refund",
    target: "RetryPolicy",
    type: "depends_on",
  },
  {
    source: "PaymentService.refund",
    target: "RetryExhaustedException",
    type: "raises",
  },
  {
    source: "PaymentService.refund",
    target: "RefundRepository.save_refund",
    type: "calls",
  },
  {
    source: "PaymentService._retry_gateway",
    target: "PaymentGateway.process_refund",
    type: "calls",
  },
  {
    source: "RefundRouter.create_refund",
    target: "PaymentService.refund",
    type: "calls",
  },
  {
    source: "test_refund_failure",
    target: "PaymentService.refund",
    type: "covered_by",
  },
  {
    source: "test_refund_success",
    target: "PaymentService.refund",
    type: "covered_by",
  },
  {
    source: "test_payment_api",
    target: "RefundRouter.create_refund",
    type: "covered_by",
  },
  {
    source: "test_gateway_timeout",
    target: "PaymentGateway.process_refund",
    type: "covered_by",
  },
  {
    source: "test_tax_calculation",
    target: "PaymentService.refund",
    type: "historically_associated",
  },
];

export const SELECTED_TESTS = [
  {
    rank: 1,
    id: "tests/test_refund.py::test_refund_failure",
    name: "test_refund_failure",
    file: "tests/test_refund.py",
    impactScore: 0.96,
    failureProbability: 0.87,
    selected: true,
    result: "FAIL" as "PASS" | "FAIL" | "SKIP" | null,
    duration: "0.82s",
    durationMs: 820,
    reasons: [
      "Directly covers changed function PaymentService.refund()",
      "Prior failure relationship in refund-related changes",
      "Historical coverage relationship to changed lines",
      "High predicted failure probability from model v0.6.3",
    ],
    coverageRelationship: "direct",
    historicalRelationship: "3 failures in last 10 refund changes",
    modelVersion: "v0.6.3",
    healthSignal: "healthy",
  },
  {
    rank: 2,
    id: "tests/test_refund.py::test_refund_success",
    name: "test_refund_success",
    file: "tests/test_refund.py",
    impactScore: 0.93,
    failureProbability: 0.52,
    selected: true,
    result: "PASS" as "PASS" | "FAIL" | "SKIP" | null,
    duration: "0.71s",
    durationMs: 710,
    reasons: [
      "Directly covers changed function PaymentService.refund()",
      "Coverage relationship to changed lines 142-181",
      "Structural dependency on RetryPolicy",
    ],
    coverageRelationship: "direct",
    historicalRelationship: "1 failure in last 10 refund changes",
    modelVersion: "v0.6.3",
    healthSignal: "healthy",
  },
  {
    rank: 3,
    id: "tests/test_payment_api.py::test_payment_api",
    name: "test_payment_api",
    file: "tests/test_payment_api.py",
    impactScore: 0.87,
    failureProbability: 0.34,
    selected: true,
    result: "PASS" as "PASS" | "FAIL" | "SKIP" | null,
    duration: "1.23s",
    durationMs: 1230,
    reasons: [
      "API route depends on PaymentService.refund()",
      "Covers RefundRouter.create_refund() which was modified",
      "Dependency relationship through API layer",
    ],
    coverageRelationship: "dependency",
    historicalRelationship: "0 failures in last 10 refund changes",
    modelVersion: "v0.6.3",
    healthSignal: "healthy",
  },
  {
    rank: 4,
    id: "tests/test_gateway.py::test_gateway_timeout",
    name: "test_gateway_timeout",
    file: "tests/test_gateway.py",
    impactScore: 0.79,
    failureProbability: 0.28,
    selected: true,
    result: "PASS" as "PASS" | "FAIL" | "SKIP" | null,
    duration: "0.94s",
    durationMs: 940,
    reasons: [
      "Covers PaymentGateway.process_refund() which was modified",
      "TransientGatewayError handling dependency",
      "Historical association with gateway changes",
    ],
    coverageRelationship: "direct",
    historicalRelationship: "2 failures in last 8 gateway changes",
    modelVersion: "v0.6.3",
    healthSignal: "healthy",
  },
  {
    rank: 5,
    id: "tests/test_tax.py::test_tax_calculation",
    name: "test_tax_calculation",
    file: "tests/test_tax.py",
    impactScore: 0.61,
    failureProbability: 0.12,
    selected: true,
    result: "PASS" as "PASS" | "FAIL" | "SKIP" | null,
    duration: "0.43s",
    durationMs: 430,
    reasons: [
      "Historically associated with PaymentService changes",
      "Indirect dependency through payment calculation chain",
    ],
    coverageRelationship: "historical",
    historicalRelationship: "0 failures in last 10 payment changes",
    modelVersion: "v0.6.3",
    healthSignal: "healthy",
  },
  {
    rank: 6,
    id: "tests/test_refund.py::test_refund_partial",
    name: "test_refund_partial",
    file: "tests/test_refund.py",
    impactScore: 0.58,
    failureProbability: 0.09,
    selected: true,
    result: "PASS" as "PASS" | "FAIL" | "SKIP" | null,
    duration: "0.65s",
    durationMs: 650,
    reasons: ["Dependency relationship to refund flow"],
    coverageRelationship: "dependency",
    historicalRelationship: "0 failures in last 5 refund changes",
    modelVersion: "v0.6.3",
    healthSignal: "healthy",
  },
  {
    rank: 7,
    id: "tests/test_retry_policy.py::test_retry_max_attempts",
    name: "test_retry_max_attempts",
    file: "tests/test_retry_policy.py",
    impactScore: 0.55,
    failureProbability: 0.31,
    selected: true,
    result: "PASS" as "PASS" | "FAIL" | "SKIP" | null,
    duration: "0.38s",
    durationMs: 380,
    reasons: [
      "Directly covers new RetryPolicy class",
      "Coverage relationship to retry_policy.py",
    ],
    coverageRelationship: "direct",
    historicalRelationship: "new test — no history",
    modelVersion: "v0.6.3",
    healthSignal: "new",
  },
  {
    rank: 8,
    id: "tests/test_retry_policy.py::test_retry_backoff",
    name: "test_retry_backoff",
    file: "tests/test_retry_policy.py",
    impactScore: 0.52,
    failureProbability: 0.18,
    selected: true,
    result: "PASS" as "PASS" | "FAIL" | "SKIP" | null,
    duration: "0.29s",
    durationMs: 290,
    reasons: ["Covers RetryPolicy.initial_backoff and max_backoff logic"],
    coverageRelationship: "direct",
    historicalRelationship: "new test — no history",
    modelVersion: "v0.6.3",
    healthSignal: "new",
  },
  {
    rank: 9,
    id: "tests/test_payment.py::test_payment_create",
    name: "test_payment_create",
    file: "tests/test_payment.py",
    impactScore: 0.44,
    failureProbability: 0.07,
    selected: true,
    result: "PASS" as "PASS" | "FAIL" | "SKIP" | null,
    duration: "0.91s",
    durationMs: 910,
    reasons: ["Indirect dependency through PaymentService"],
    coverageRelationship: "dependency",
    historicalRelationship: "0 failures in last 15 payment changes",
    modelVersion: "v0.6.3",
    healthSignal: "healthy",
  },
  {
    rank: 10,
    id: "tests/test_gateway.py::test_gateway_transient_error",
    name: "test_gateway_transient_error",
    file: "tests/test_gateway.py",
    impactScore: 0.42,
    failureProbability: 0.19,
    selected: true,
    result: "PASS" as "PASS" | "FAIL" | "SKIP" | null,
    duration: "0.55s",
    durationMs: 550,
    reasons: ["Covers TransientGatewayError which is new in this change"],
    coverageRelationship: "direct",
    historicalRelationship: "new test — no history",
    modelVersion: "v0.6.3",
    healthSignal: "new",
  },
  // Not selected tests (showing some)
  {
    rank: 25,
    id: "tests/test_auth.py::test_login",
    name: "test_login",
    file: "tests/test_auth.py",
    impactScore: 0.04,
    failureProbability: 0.02,
    selected: false,
    result: null,
    duration: "0.33s",
    durationMs: 330,
    reasons: ["No structural relationship to changed code"],
    coverageRelationship: "none",
    historicalRelationship: "no association",
    modelVersion: "v0.6.3",
    healthSignal: "healthy",
  },
  {
    rank: 26,
    id: "tests/test_users.py::test_user_profile",
    name: "test_user_profile",
    file: "tests/test_users.py",
    impactScore: 0.03,
    failureProbability: 0.01,
    selected: false,
    result: null,
    duration: "0.41s",
    durationMs: 410,
    reasons: ["No structural relationship to changed code"],
    coverageRelationship: "none",
    historicalRelationship: "no association",
    modelVersion: "v0.6.3",
    healthSignal: "healthy",
  },
  {
    rank: 27,
    id: "tests/test_products.py::test_product_list",
    name: "test_product_list",
    file: "tests/test_products.py",
    impactScore: 0.02,
    failureProbability: 0.01,
    selected: false,
    result: null,
    duration: "0.62s",
    durationMs: 620,
    reasons: ["No structural relationship to changed code"],
    coverageRelationship: "none",
    historicalRelationship: "no association",
    modelVersion: "v0.6.3",
    healthSignal: "healthy",
  },
];

export const COVERAGE_LINES = [
  {
    line: 138,
    content: "    def refund(self, payment_id: str, amount: Decimal) -> RefundResult:",
    status: "covered",
    coveredBy: ["test_refund_success", "test_refund_failure"],
    added: false,
  },
  {
    line: 139,
    content: '        """Process a refund for a completed payment."""',
    status: "covered",
    coveredBy: ["test_refund_success"],
    added: false,
  },
  {
    line: 140,
    content: "        payment = self.repository.get_payment(payment_id)",
    status: "covered",
    coveredBy: ["test_refund_success", "test_refund_failure"],
    added: false,
  },
  {
    line: 141,
    content: "        if not payment:",
    status: "covered",
    coveredBy: ["test_refund_failure"],
    added: false,
  },
  {
    line: 142,
    content: "        retry_count = 0",
    status: "covered",
    coveredBy: ["test_refund_success", "test_refund_failure"],
    added: true,
  },
  {
    line: 143,
    content: "        max_retries = self.retry_policy.max_attempts",
    status: "covered",
    coveredBy: ["test_refund_success"],
    added: true,
  },
  {
    line: 144,
    content: "        backoff = self.retry_policy.initial_backoff",
    status: "covered",
    coveredBy: ["test_refund_success"],
    added: true,
  },
  {
    line: 145,
    content: "",
    status: "neutral",
    coveredBy: [],
    added: true,
  },
  {
    line: 146,
    content: "        while retry_count <= max_retries:",
    status: "covered",
    coveredBy: ["test_refund_success", "test_refund_failure"],
    added: true,
  },
  {
    line: 147,
    content: "            try:",
    status: "covered",
    coveredBy: ["test_refund_success", "test_refund_failure"],
    added: true,
  },
  {
    line: 148,
    content: "                result = self.gateway.process_refund(payment_id, amount)",
    status: "covered",
    coveredBy: ["test_refund_success", "test_refund_failure", "test_gateway_timeout"],
    added: true,
  },
  {
    line: 149,
    content: "                if result.success:",
    status: "covered",
    coveredBy: ["test_refund_success", "test_refund_failure"],
    added: true,
  },
  {
    line: 150,
    content: "                    self.repository.save_refund(payment_id, amount, result)",
    status: "covered",
    coveredBy: ["test_refund_success"],
    added: true,
  },
  {
    line: 151,
    content: "                    return RefundResult(",
    status: "covered",
    coveredBy: ["test_refund_success"],
    added: true,
  },
  {
    line: 152,
    content: "                        success=True,",
    status: "covered",
    coveredBy: ["test_refund_success"],
    added: true,
  },
  {
    line: 153,
    content: "                        refund_id=result.refund_id",
    status: "covered",
    coveredBy: ["test_refund_success"],
    added: true,
  },
  {
    line: 154,
    content: "                    )",
    status: "covered",
    coveredBy: ["test_refund_success"],
    added: true,
  },
  {
    line: 155,
    content: "                return RefundResult(success=False, error=result.error)",
    status: "covered",
    coveredBy: ["test_refund_failure"],
    added: true,
  },
  {
    line: 156,
    content: "            except TransientGatewayError as e:",
    status: "covered",
    coveredBy: ["test_gateway_timeout"],
    added: true,
  },
  {
    line: 157,
    content: "                retry_count += 1",
    status: "covered",
    coveredBy: ["test_gateway_timeout"],
    added: true,
  },
  {
    line: 158,
    content: "                if retry_count > max_retries:",
    status: "covered",
    coveredBy: ["test_gateway_timeout"],
    added: true,
  },
  {
    line: 159,
    content: "                    # RETRY EXHAUSTION — no validated regression test evidence",
    status: "uncovered",
    coveredBy: [],
    added: true,
    isGap: true,
    gapLabel: "MATERIAL GAP: Retry exhaustion branch — no validated test evidence",
  },
  {
    line: 160,
    content: "                    self.logger.error(",
    status: "uncovered",
    coveredBy: [],
    added: true,
    isGap: true,
  },
  {
    line: 161,
    content: '                        "Refund retry exhausted",',
    status: "uncovered",
    coveredBy: [],
    added: true,
    isGap: true,
  },
  {
    line: 162,
    content: "                        payment_id=payment_id,",
    status: "uncovered",
    coveredBy: [],
    added: true,
    isGap: true,
  },
  {
    line: 163,
    content: "                        attempts=retry_count,",
    status: "uncovered",
    coveredBy: [],
    added: true,
    isGap: true,
  },
  {
    line: 164,
    content: "                    )",
    status: "uncovered",
    coveredBy: [],
    added: true,
    isGap: true,
  },
  {
    line: 165,
    content: "                    raise RetryExhaustedException(",
    status: "uncovered",
    coveredBy: [],
    added: true,
    isGap: true,
  },
  {
    line: 166,
    content: '                        f"Refund failed after {max_retries} attempts"',
    status: "uncovered",
    coveredBy: [],
    added: true,
    isGap: true,
  },
  {
    line: 167,
    content: "                    ) from e",
    status: "uncovered",
    coveredBy: [],
    added: true,
    isGap: true,
  },
  {
    line: 168,
    content: "                time.sleep(backoff)",
    status: "covered",
    coveredBy: ["test_gateway_timeout"],
    added: true,
  },
  {
    line: 169,
    content: "                backoff = min(backoff * 2, self.retry_policy.max_backoff)",
    status: "covered",
    coveredBy: ["test_gateway_timeout"],
    added: true,
  },
];

export const EVIDENCE_LEDGER = [
  {
    id: "CHG-184-01",
    type: "OBSERVED_FACT",
    source: "git",
    revision: "a92f31e",
    timestamp: "2026-09-29T08:42:11Z",
    category: "Change",
    fact: "8 files changed in commit a92f31e on branch feat/refund-retry-policy: payments/service.py (+89/-28), payments/retry_policy.py (+18), payments/exceptions.py (+8), api/refunds.py (+5/-3), tests/test_refund.py (+4/-5), payments/gateway.py (+2/-2), config/settings.py (+3), tests/conftest.py (+7)",
    confidence: null,
    linkedEvidence: [],
  },
  {
    id: "CHG-184-02",
    type: "OBSERVED_FACT",
    source: "auracle/ast-parser",
    revision: "a92f31e",
    timestamp: "2026-09-29T08:42:14Z",
    category: "Change",
    fact: "Changed symbol identified: PaymentService.refund() in payments/service.py. Change classification: Behavior modification (advisory). AST diff detected new retry loop, exception handling, and new helper method _retry_gateway().",
    confidence: null,
    linkedEvidence: ["CHG-184-01"],
  },
  {
    id: "IMP-184-03",
    type: "OBSERVED_FACT",
    source: "auracle/impact-engine",
    revision: "a92f31e",
    timestamp: "2026-09-29T08:42:18Z",
    category: "Impact",
    fact: "Dependency graph traversal from PaymentService.refund(): direct callers include RefundRouter.create_refund() (api/refunds.py). Called functions include PaymentGateway.process_refund(), RefundRepository.save_refund(). New dependencies: RetryPolicy, TransientGatewayError, RetryExhaustedException.",
    confidence: null,
    linkedEvidence: ["CHG-184-02"],
  },
  {
    id: "IMP-184-04",
    type: "OBSERVED_FACT",
    source: "auracle/impact-engine",
    revision: "a92f31e",
    timestamp: "2026-09-29T08:42:18Z",
    category: "Impact",
    fact: "17 functions affected across 8 files via structural impact propagation. Impact depth: 3 hops from changed root symbol.",
    confidence: null,
    linkedEvidence: ["IMP-184-03"],
  },
  {
    id: "IMP-184-05",
    type: "OBSERVED_FACT",
    source: "auracle/tia-engine",
    revision: "a92f31e",
    timestamp: "2026-09-29T08:42:21Z",
    category: "Impact",
    fact: "Test Impact Analysis: 42 candidate tests identified from structural dependency, coverage, historical, and runtime signals. Direct coverage relationship: test_refund_success, test_refund_failure. Dependency relationship: test_payment_api, test_gateway_timeout. Historical association: test_tax_calculation.",
    confidence: null,
    linkedEvidence: ["IMP-184-04"],
  },
  {
    id: "COV-184-06",
    type: "OBSERVED_FACT",
    source: "auracle/coverage-engine",
    revision: "a92f31e",
    timestamp: "2026-09-29T08:42:24Z",
    category: "Coverage",
    fact: "Pre-execution changed-code coverage: 69% (29/42 changed lines covered by historical coverage data). Branch coverage of changed code: 61%. Repository-wide coverage: 87%.",
    confidence: null,
    linkedEvidence: ["CHG-184-01"],
  },
  {
    id: "COV-184-07",
    type: "OBSERVED_FACT",
    source: "auracle/coverage-engine",
    revision: "a92f31e",
    timestamp: "2026-09-29T08:42:24Z",
    category: "Coverage",
    fact: "Coverage gap identified: Lines 159-167 in payments/service.py (retry exhaustion branch) have no coverage evidence in historical data. This is a newly introduced code branch with zero coverage.",
    confidence: null,
    linkedEvidence: ["COV-184-06"],
  },
  {
    id: "PRED-184-08",
    type: "MODEL_PREDICTION",
    source: "auracle/prediction-engine",
    revision: "a92f31e",
    timestamp: "2026-09-29T08:42:27Z",
    category: "Prediction",
    fact: "Model v0.6.3 ranked 42 candidate tests. Top selection: test_refund_failure (impact_score=0.96, failure_probability=0.87), test_refund_success (0.93, 0.52), test_payment_api (0.87, 0.34), test_gateway_timeout (0.79, 0.28), test_tax_calculation (0.61, 0.12).",
    confidence: 0.92,
    linkedEvidence: ["IMP-184-05", "COV-184-06"],
  },
  {
    id: "PRED-184-09",
    type: "MODEL_PREDICTION",
    source: "auracle/selector",
    revision: "a92f31e",
    timestamp: "2026-09-29T08:42:28Z",
    category: "Prediction",
    fact: "Selection strategy: confidence_target=0.90. 24 tests selected from 42 candidates. Estimated runtime: 4m 12s (vs 26m 48s full suite). Runtime reduction: 84%. Selection confidence: 92%.",
    confidence: 0.92,
    linkedEvidence: ["PRED-184-08"],
  },
  {
    id: "EXEC-184-10",
    type: "OBSERVED_FACT",
    source: "github-actions",
    revision: "a92f31e",
    timestamp: "2026-09-29T09:01:14Z",
    category: "Execution",
    fact: "pytest executed 24 selected tests on commit a92f31e. Command: pytest tests/test_refund.py::test_refund_failure tests/test_refund.py::test_refund_success ... --cov=payments --cov-report=json. Runner: ubuntu-latest. Duration: 4m 07s.",
    confidence: null,
    linkedEvidence: ["PRED-184-09"],
  },
  {
    id: "EXEC-184-11",
    type: "OBSERVED_FACT",
    source: "pytest",
    revision: "a92f31e",
    timestamp: "2026-09-29T09:05:21Z",
    category: "Execution",
    fact: "Execution results: 23 passed, 1 failed. FAILED: tests/test_refund.py::test_refund_failure — AssertionError: test expected result.success to be False but PaymentService.refund() now raises TransientGatewayError before returning a result. Duration: 4m 07s.",
    confidence: null,
    linkedEvidence: ["EXEC-184-10"],
  },
  {
    id: "COV-184-12",
    type: "OBSERVED_FACT",
    source: "pytest-cov",
    revision: "a92f31e",
    timestamp: "2026-09-29T09:05:28Z",
    category: "Coverage",
    fact: "Post-execution coverage: changed-code coverage updated to 88% (37/42 changed lines). Branch coverage: 81%. Material gap confirmed: retry exhaustion branch (lines 159-167 in payments/service.py) remains uncovered after all 24 selected tests executed.",
    confidence: null,
    linkedEvidence: ["EXEC-184-11", "COV-184-07"],
  },
  {
    id: "RISK-184-13",
    type: "OBSERVED_FACT",
    source: "auracle/risk-engine",
    revision: "a92f31e",
    timestamp: "2026-09-29T09:05:31Z",
    category: "Risk",
    fact: "Risk recalculation post-execution. Structural risk: HIGH (17 affected functions, critical payment path). Coverage risk: MEDIUM (88% changed-code coverage, 1 material gap). Execution risk: HIGH (1 selected test failed). Historical risk: MEDIUM (3 prior failures in refund context). Aggregate: HIGH.",
    confidence: null,
    linkedEvidence: ["COV-184-12", "EXEC-184-11"],
  },
  {
    id: "GATE-184-14",
    type: "OBSERVED_FACT",
    source: "auracle/gate",
    revision: "a92f31e",
    timestamp: "2026-09-29T09:05:33Z",
    category: "Gate",
    fact: "Quality gate evaluation: FAIL. Blocking reasons: (1) test_refund_failure FAILED — a directly relevant selected test failed on this revision. (2) Material coverage gap: retry exhaustion branch has no validated regression test evidence. Gate policy: any selected test failure OR unresolved material gap → FAIL.",
    confidence: null,
    linkedEvidence: ["EXEC-184-11", "COV-184-12", "RISK-184-13"],
  },
];

export const CI_STEPS = [
  {
    name: "Checkout repository",
    status: "success",
    duration: "2s",
    output: `Run actions/checkout@v4
  with:
    ref: a92f31e
    fetch-depth: 0
Initialized empty Git repository
Checking out a92f31e...
Done.`,
  },
  {
    name: "Set up Python 3.12",
    status: "success",
    duration: "8s",
    output: `Successfully setup Python 3.12.7
pip 24.2 from /opt/hostedtoolcache/Python/3.12.7/x64/lib/python3.12/site-packages/pip
Installed: pytest, pytest-cov, auracle-cli`,
  },
  {
    name: "auracle analyze",
    status: "success",
    duration: "1.8s",
    output: `auracle v0.6.3 — Change Intelligence
Repository: acme/payments-api
Commit: a92f31e
Base: main (HEAD~1)

Analyzing diff...
  Parsing payments/service.py (Python, AST)
  Parsing payments/retry_policy.py (Python, AST)
  Parsing payments/exceptions.py (Python, AST)
  ... 5 more files

Change summary:
  8 files changed  +126/-38 lines
  Changed symbols: PaymentService.refund, PaymentService._retry_gateway, RetryPolicy, ...
  Impact graph: 17 affected functions

Analysis complete in 1.8s`,
  },
  {
    name: "auracle select",
    status: "success",
    duration: "0.3s",
    output: `auracle v0.6.3 — Test Selection
Strategy: confidence_target=0.90
Model: v0.6.3 (healthy, 847 sessions)

Scoring 42 candidate tests...
Selected 24 tests (confidence: 92%)
Estimated runtime: 4m 12s (vs 26m 48s full suite, -84%)

Top selections:
  [0.96] tests/test_refund.py::test_refund_failure
  [0.93] tests/test_refund.py::test_refund_success
  [0.87] tests/test_payment_api.py::test_payment_api
  [0.79] tests/test_gateway.py::test_gateway_timeout
  [0.61] tests/test_tax.py::test_tax_calculation
  ... 19 more

Writing test plan to .auracle/test_plan.json`,
  },
  {
    name: "pytest — selected tests",
    status: "failure",
    duration: "4m 07s",
    output: `pytest 8.3.3 — running 24 selected tests
Coverage: payments/ (target: branch+line)

tests/test_refund.py::test_refund_success PASSED         [  4%]
tests/test_refund.py::test_refund_partial PASSED         [  8%]
tests/test_payment_api.py::test_payment_api PASSED       [ 12%]
tests/test_gateway.py::test_gateway_timeout PASSED       [ 16%]
tests/test_tax.py::test_tax_calculation PASSED           [ 20%]
tests/test_retry_policy.py::test_retry_max_attempts PASSED [ 25%]
tests/test_retry_policy.py::test_retry_backoff PASSED   [ 29%]
...
FAILED tests/test_refund.py::test_refund_failure

FAILURES:
─────────────────── test_refund_failure ───────────────────
def test_refund_failure(payment_service, mock_gateway):
    mock_gateway.process_refund.return_value = GatewayResult(
        success=False, error="DECLINED"
    )
>   with pytest.raises(Exception):
>       payment_service.refund("pay_001", Decimal("50.00"))
E   Failed: DID NOT RAISE <class 'Exception'>
E   AssertionError

tests/test_refund.py:44: AssertionError
─────────────────────────────────────────────────────────────

23 passed, 1 failed in 4m 07s`,
  },
  {
    name: "auracle ingest-results",
    status: "success",
    duration: "0.4s",
    output: `auracle v0.6.3 — Results Ingestion
Ingesting pytest results from .auracle/results.json
Ingesting coverage from .coverage
Processing 24 execution records...

Changed-code coverage: 88% (37/42 lines)
Branch coverage: 81%
Material gaps identified: 1
  → payments/service.py:159-167 (retry exhaustion branch)

Results stored. Evidence IDs: EXEC-184-10, EXEC-184-11, COV-184-12`,
  },
  {
    name: "auracle gate",
    status: "failure",
    duration: "0.1s",
    output: `auracle v0.6.3 — Quality Gate

Evaluating gate policy...

  [FAIL] test_refund_failure FAILED on revision a92f31e
  [FAIL] Material gap: retry exhaustion branch uncovered (payments/service.py:159-167)
  [PASS] Changed-code coverage: 88% ≥ 80% threshold
  [PASS] Selection confidence: 92% ≥ 90% threshold
  [PASS] 23/24 selected tests passed

Gate decision: FAIL
Blocking reasons: 2

Evidence: GATE-184-14
PR check: updating GitHub status...

Process completed with exit code 1`,
  },
];

export const TEST_HEALTH_DATA = [
  {
    id: "tests/test_refund.py::test_refund_failure",
    name: "test_refund_failure",
    file: "tests/test_refund.py",
    passRate: 0.65,
    failureRate: 0.35,
    p95Duration: "1.2s",
    avgDuration: "0.82s",
    totalRuns: 48,
    recentResults: ["PASS", "FAIL", "PASS", "PASS", "FAIL", "PASS", "FAIL", "PASS"],
    healthSignal: "frequently_failing",
    lastFailure: "2026-09-29",
    linkedComponents: ["PaymentService.refund"],
    flakiness: 0.0,
  },
  {
    id: "tests/test_payment.py::test_payment_timeout",
    name: "test_payment_timeout",
    file: "tests/test_payment.py",
    passRate: 0.78,
    failureRate: 0.22,
    p95Duration: "4.8s",
    avgDuration: "2.1s",
    totalRuns: 64,
    recentResults: ["PASS", "FAIL", "PASS", "FAIL", "PASS", "PASS", "FAIL", "PASS"],
    healthSignal: "flaky",
    lastFailure: "2026-09-28",
    linkedComponents: ["PaymentService", "PaymentGateway"],
    flakiness: 0.42,
  },
  {
    id: "tests/test_integration.py::test_full_payment_flow",
    name: "test_full_payment_flow",
    file: "tests/test_integration.py",
    passRate: 0.71,
    failureRate: 0.29,
    p95Duration: "12.3s",
    avgDuration: "8.7s",
    totalRuns: 48,
    recentResults: ["FAIL", "PASS", "FAIL", "PASS", "PASS", "FAIL", "PASS", "PASS"],
    healthSignal: "slow",
    lastFailure: "2026-09-29",
    linkedComponents: ["PaymentService", "PaymentGateway", "RefundRepository"],
    flakiness: 0.18,
  },
  {
    id: "tests/test_auth.py::test_jwt_validation",
    name: "test_jwt_validation",
    file: "tests/test_auth.py",
    passRate: 1.0,
    failureRate: 0.0,
    p95Duration: "0.8s",
    avgDuration: "0.33s",
    totalRuns: 120,
    recentResults: ["PASS", "PASS", "PASS", "PASS", "PASS", "PASS", "PASS", "PASS"],
    healthSignal: "rarely_failing",
    lastFailure: "never",
    linkedComponents: ["AuthService"],
    flakiness: 0.0,
  },
  {
    id: "tests/test_users.py::test_user_create",
    name: "test_user_create",
    file: "tests/test_users.py",
    passRate: 1.0,
    failureRate: 0.0,
    p95Duration: "0.6s",
    avgDuration: "0.41s",
    totalRuns: 95,
    recentResults: ["PASS", "PASS", "PASS", "PASS", "PASS", "PASS", "PASS", "PASS"],
    healthSignal: "rarely_failing",
    lastFailure: "never",
    linkedComponents: ["UserService"],
    flakiness: 0.0,
  },
];

export const HISTORY_DATA = {
  failureRecall: 94.7,
  testReduction: 78,
  missedFailures: 2,
  medianSelectionLatency: 1.8,
  modelVersion: "v0.6.3",
  totalSessions: 847,
  runtimeTrend: [
    { date: "Sep 1", full: 28.2, selected: 6.1 },
    { date: "Sep 5", full: 27.8, selected: 5.9 },
    { date: "Sep 8", full: 27.6, selected: 5.4 },
    { date: "Sep 12", full: 26.9, selected: 5.2 },
    { date: "Sep 15", full: 27.1, selected: 5.0 },
    { date: "Sep 19", full: 27.3, selected: 4.8 },
    { date: "Sep 22", full: 26.8, selected: 4.5 },
    { date: "Sep 26", full: 26.7, selected: 4.2 },
    { date: "Sep 29", full: 26.8, selected: 4.1 },
  ],
  recallTrend: [
    { date: "Sep 1", recall: 91.2, missed: 3 },
    { date: "Sep 5", recall: 92.8, missed: 2 },
    { date: "Sep 8", recall: 93.1, missed: 2 },
    { date: "Sep 12", recall: 94.0, missed: 2 },
    { date: "Sep 15", recall: 93.6, missed: 2 },
    { date: "Sep 19", recall: 94.2, missed: 1 },
    { date: "Sep 22", recall: 94.5, missed: 1 },
    { date: "Sep 26", recall: 94.7, missed: 1 },
    { date: "Sep 29", recall: 94.7, missed: 1 },
  ],
  coverageTrend: [
    { date: "Sep 1", global: 85.1, changed: 81.2 },
    { date: "Sep 5", global: 85.4, changed: 82.0 },
    { date: "Sep 8", global: 86.0, changed: 83.1 },
    { date: "Sep 12", global: 86.2, changed: 84.2 },
    { date: "Sep 15", global: 86.8, changed: 85.0 },
    { date: "Sep 19", global: 87.0, changed: 86.1 },
    { date: "Sep 22", global: 87.0, changed: 87.2 },
    { date: "Sep 26", global: 87.0, changed: 87.8 },
    { date: "Sep 29", global: 87.0, changed: 88.0 },
  ],
  recentPRs: [
    {
      pr: 184,
      title: "Add guarded retry to refund processing",
      gate: "FAIL",
      risk: "HIGH",
      changedCoverage: 88,
      selected: 24,
      full: 312,
      selectedTime: "4m 12s",
      fullTime: "26m 48s",
      gaps: 1,
      date: "Sep 29",
    },
    {
      pr: 183,
      title: "Update payment validation rules",
      gate: "PASS",
      risk: "MEDIUM",
      changedCoverage: 91,
      selected: 18,
      full: 308,
      selectedTime: "3m 41s",
      fullTime: "26m 30s",
      gaps: 0,
      date: "Sep 28",
    },
    {
      pr: 182,
      title: "Fix currency rounding in tax calculation",
      gate: "PASS",
      risk: "LOW",
      changedCoverage: 100,
      selected: 8,
      full: 305,
      selectedTime: "1m 22s",
      fullTime: "26m 10s",
      gaps: 0,
      date: "Sep 27",
    },
    {
      pr: 181,
      title: "Refactor repository layer",
      gate: "PASS",
      risk: "MEDIUM",
      changedCoverage: 86,
      selected: 31,
      full: 302,
      selectedTime: "5m 48s",
      fullTime: "25m 54s",
      gaps: 0,
      date: "Sep 25",
    },
    {
      pr: 180,
      title: "Add webhook payment notifications",
      gate: "PASS",
      risk: "MEDIUM",
      changedCoverage: 83,
      selected: 22,
      full: 299,
      selectedTime: "4m 01s",
      fullTime: "25m 42s",
      gaps: 1,
      date: "Sep 23",
    },
  ],
};

export const COPILOT_CONVERSATIONS = [
  {
    id: "q1",
    question: "Why did Auracle select test_refund_failure?",
    answer: `**test_refund_failure** was selected because multiple independent evidence signals converge on it:

**Observed evidence [IMP-184-05]:** The changed function \`PaymentService.refund()\` is directly covered by this test — Auracle's TIA engine traced a direct coverage relationship from the changed lines to this test's execution history.

**Observed evidence [PRED-184-08]:** Model v0.6.3 assigned an impact score of **0.96** and predicted failure probability of **0.87** — the highest of any candidate test. This reflects 3 prior failures in the last 10 refund-related changes.

**Observed evidence [COV-184-06]:** Historical coverage data shows this test previously exercised lines 138-155 of payments/service.py — all of which were modified in commit a92f31e.

The combination of direct structural dependency, high historical failure rate, and strong coverage relationship gave this test the highest selection priority.`,
    evidenceIds: ["IMP-184-05", "PRED-184-08", "COV-184-06"],
  },
  {
    id: "q2",
    question: "Why is PR #184 high risk?",
    answer: `PR #184 carries **HIGH** risk for two distinct, independently blocking reasons:

**Reason 1 — A selected test failed [EXEC-184-11]:** \`test_refund_failure\` failed on revision a92f31e. This is not a passing test with low coverage — it is an actively failing test that is directly structurally related to the changed function.

**Reason 2 — Material testing gap [COV-184-07, COV-184-12]:** The retry exhaustion branch (lines 159-167 in payments/service.py) has zero coverage evidence, even after all 24 selected tests executed. This newly introduced code path handles the case where all retry attempts are exhausted and raises \`RetryExhaustedException\`. No test validates this behavior.

**Risk engine assessment [RISK-184-13]:** Structural risk is HIGH (17 affected functions in the critical payment path). Execution risk is HIGH (1/24 selected tests failed). The combination produces aggregate risk: HIGH.

Auracle does not suggest that fixing the failing test or adding one coverage line would automatically make this safe — both issues must be independently resolved.`,
    evidenceIds: ["EXEC-184-11", "COV-184-07", "COV-184-12", "RISK-184-13"],
  },
  {
    id: "q3",
    question: "What testing gap remains?",
    answer: `**One material testing gap remains after execution [COV-184-12]:**

The **retry exhaustion branch** in \`payments/service.py\` lines 159-167 was not covered by any of the 24 selected tests.

This code path is reached when \`TransientGatewayError\` is raised and \`retry_count > max_retries\`. In this case, the system logs the exhaustion and raises \`RetryExhaustedException\`. This is new behavior introduced in commit a92f31e that has no validated regression test evidence.

**What this means:** If the retry logic has a bug — for example, raising the wrong exception type, logging incorrect metadata, or failing to propagate the original error correctly — no executed test would detect it. A green gate would provide false confidence about this code path.

**What would resolve this gap:** A test that configures the gateway to raise \`TransientGatewayError\` on every attempt (max_retries + 1 times) and asserts that \`RetryExhaustedException\` is raised with correct metadata. Auracle can propose a candidate test, but a developer must review and verify it before it becomes evidence.`,
    evidenceIds: ["COV-184-07", "COV-184-12"],
  },
  {
    id: "q4",
    question: "Show me the evidence behind the gate.",
    answer: `The quality gate decision [GATE-184-14] is fully traceable through the evidence chain:

**1. Change detected [CHG-184-01]:** Auracle observed 8 changed files in commit a92f31e via git diff.

**2. Symbol identified [CHG-184-02]:** AST parser identified \`PaymentService.refund()\` as the primary changed symbol.

**3. Impact mapped [IMP-184-04]:** 17 affected functions across 8 files via graph traversal.

**4. Tests identified [IMP-184-05]:** 42 candidate tests found. 24 selected at 92% confidence.

**5. Pre-execution coverage gap found [COV-184-07]:** Retry exhaustion branch identified as uncovered before tests ran.

**6. Tests executed [EXEC-184-10]:** 24 tests ran via pytest on ubuntu-latest for 4m 07s.

**7. Test failure observed [EXEC-184-11]:** test_refund_failure FAILED — not a prediction, an observed execution result.

**8. Post-execution gap confirmed [COV-184-12]:** Coverage ingested, gap confirmed at lines 159-167.

**9. Gate evaluated [GATE-184-14]:** Policy: any selected test failure OR material gap → FAIL. Both conditions true. Result: FAIL.

Every step cites an observed fact or labeled model prediction — nothing is invented.`,
    evidenceIds: ["CHG-184-01", "CHG-184-02", "IMP-184-04", "IMP-184-05", "COV-184-07", "EXEC-184-11", "COV-184-12", "GATE-184-14"],
  },
];

export const DEMO_STEPS = [
  {
    step: 1,
    title: "The Testing Problem",
    route: "/",
    description:
      "Green CI can still leave changed behavior insufficiently tested. Traditional CI tells you whether tests passed — not whether you ran the right tests or covered what changed.",
    presenterNotes:
      "Explain that the root problem is not whether tests pass — it's whether you tested the right things. A green suite is only evidence about executed tests.",
    highlight: "overview-problem-banner",
  },
  {
    step: 2,
    title: "Install Auracle",
    route: "/install",
    description:
      "pip install auracle → auracle init → discover tests → run baseline coverage. Shadow mode allows safe evaluation before trusting selective execution.",
    presenterNotes:
      "Walk through the onboarding steps. Emphasize shadow mode: full suite still runs, Auracle independently predicts a subset and compares results without risk.",
    highlight: "install-steps",
  },
  {
    step: 3,
    title: "Developer Changes Code",
    route: "/ide",
    description:
      "Maya Chen modifies PaymentService.refund() to add retry logic. The IDE shows the diff, Auracle's sidebar highlights impact in real-time.",
    presenterNotes:
      "Show the realistic IDE simulation. Focus on the changed function and the retry exhaustion branch that will become the material gap.",
    highlight: "ide-editor",
  },
  {
    step: 4,
    title: "PR #184 Created",
    route: "/pull-requests/184",
    description:
      "Maya pushes feat/refund-retry-policy and opens PR #184. Auracle CI check immediately shows RUNNING.",
    presenterNotes:
      "The GitHub-style PR view shows the CI check starting. This is what the team sees before Auracle results are ready.",
    highlight: "pr-checks",
  },
  {
    step: 5,
    title: "GitHub Actions Triggers Auracle",
    route: "/pull-requests/184/report?tab=ci",
    description:
      "auracle analyze runs in 1.8s. 8 files changed, 17 functions affected, impact graph built.",
    presenterNotes:
      "Show the CI tab with terminal output. auracle analyze is fast — under 2 seconds — because it uses AST parsing, not an LLM.",
    highlight: "ci-analyze-step",
  },
  {
    step: 6,
    title: "Auracle Identifies Affected Code",
    route: "/change-impact",
    description:
      "The dependency/impact graph shows how PaymentService.refund() connects to downstream functions and which tests cover them.",
    presenterNotes:
      "Walk through the impact graph. Explain signal types: structural, coverage, historical. Show that impact propagates through the call graph.",
    highlight: "impact-graph",
  },
  {
    step: 7,
    title: "Tests Identified and Ranked",
    route: "/pull-requests/184/report?tab=tests",
    description:
      "42 relevant tests found. 24 selected at 92% confidence. test_refund_failure ranked #1 with impact score 0.96.",
    presenterNotes:
      "Explain that each test has an impact score from structural/coverage/historical signals AND a failure probability from the ML model. Click test_refund_failure to see the selection reasons.",
    highlight: "test-selection-table",
  },
  {
    step: 8,
    title: "pytest Executes Selected Tests",
    route: "/pull-requests/184/report?tab=ci",
    description:
      "24 tests execute in 4m 12s instead of 26m 48s — 84% reduction. pytest is still the runner; Auracle only selects.",
    presenterNotes:
      "Show the CI step output. Emphasis: Auracle does NOT replace pytest. It decides WHICH tests to pass to pytest. The runner remains authoritative.",
    highlight: "ci-pytest-step",
  },
  {
    step: 9,
    title: "Results and Coverage Return",
    route: "/pull-requests/184/report?tab=coverage",
    description:
      "pytest-cov returns coverage data. Changed-code coverage updates from 69% → 88%. Material gap on lines 159-167 confirmed.",
    presenterNotes:
      "Show the coverage view. Highlight the difference between repository coverage (87%) and changed-code coverage (88%). Then point to the uncovered retry exhaustion branch.",
    highlight: "coverage-gap",
  },
  {
    step: 10,
    title: "test_refund_failure FAILS",
    route: "/pull-requests/184/report?tab=tests",
    description:
      "test_refund_failure FAILS. The test expected a return value but the changed code now raises an exception. This is a real behavioral incompatibility.",
    presenterNotes:
      "Show the FAIL result on test_refund_failure. Explain what the test expected vs what the new code does. This is not a flaky failure — it is a genuine test/implementation conflict.",
    highlight: "test-failure-row",
  },
  {
    step: 11,
    title: "Risk = HIGH, Quality Gate = FAIL",
    route: "/pull-requests/184/report",
    description:
      "Two independent reasons block this PR: 1. test_refund_failure failed. 2. Retry exhaustion branch has no validated regression test evidence.",
    presenterNotes:
      "Show the gate banner. Emphasize that BOTH reasons must be resolved. A test failure alone is enough to block — but so is a material gap even if all tests pass.",
    highlight: "gate-banner",
  },
  {
    step: 12,
    title: "AI Copilot Explains Using Evidence",
    route: "/copilot",
    description:
      "The AI Copilot explains the gate decision citing evidence IDs like [EXEC-184-11] and [COV-184-12]. It explains, it does not decide.",
    presenterNotes:
      "Ask the copilot 'Show me the evidence behind the gate.' Watch it cite specific evidence IDs that are traceable to real observed facts. AI explains structured evidence — it does not invent coverage or test results.",
    highlight: "copilot-response",
  },
];
