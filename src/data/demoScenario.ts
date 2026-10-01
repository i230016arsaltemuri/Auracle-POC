export type FinalState =
  | "PASS_WITHIN_SUPPORTED_SCOPE"
  | "FAIL"
  | "REVIEW_REQUIRED"
  | "OUT_OF_SCOPE";

export type CoverageState =
  | "covered"
  | "partially_covered"
  | "uncovered"
  | "unknown";

export type ExpectedBehaviorState =
  | "known"
  | "partial"
  | "unknown"
  | "conflicting";

export type SelectionClass =
  | "MUST_RUN"
  | "STRONG"
  | "BROAD"
  | "NOT_SELECTED";

export type PriorityTier =
  | "P0" | "P1" | "P2" | "P3" | "P4" | "P5";

export type DemoPhase =
  | "NO_AURACLE"
  | "CHANGE_CREATED"
  | "ANALYSIS_REVIEW"
  | "CANDIDATE_GENERATED"
  | "CANDIDATE_ACCEPTED"
  | "EXECUTED"
  | "MERGED";

export interface TestNeed {
  id: string;
  title: string;
  target: string;
  lines: string;
  reason: string;
  coverageState: CoverageState;
  expectedBehavior: ExpectedBehaviorState;
  recommendedAction: string;
  resolved: boolean;
}

export interface CandidateTest {
  id: string;
  name: string;
  mode: string;
  basedOn: string[];
  code: string;
  validation: {
    syntax: boolean;
    collection: boolean;
    executed: boolean;
    branchReached: boolean;
    humanReviewRequired: boolean;
  };
}

export interface BehaviorSource {
  id: string;
  type: "AUTHORITATIVE" | "SUPPORTING" | "IMPLEMENTATION CONTEXT";
  name: string;
  content: string;
}

export const DEMO_TEST_NEED: TestNeed = {
  id: "TN-204",
  title: "Material Test Need",
  target: "PaymentService.refund()",
  lines: "159–167",
  reason: "Changed retry-exhaustion branch is not executed by any observed relevant test.",
  coverageState: "uncovered",
  expectedBehavior: "known",
  recommendedAction: "Generate candidate regression test",
  resolved: false,
};

export const DEMO_BEHAVIOR_SOURCES: BehaviorSource[] = [
  {
    id: "src-1",
    type: "AUTHORITATIVE",
    name: "PR description",
    content: "If all retry attempts fail, raise RefundRetryExhausted.",
  },
  {
    id: "src-2",
    type: "SUPPORTING",
    name: "Function docstring",
    content: "Retries refund up to max_attempts.",
  },
  {
    id: "src-3",
    type: "SUPPORTING",
    name: "Existing related test",
    content: "test_refund_failure",
  },
  {
    id: "src-4",
    type: "IMPLEMENTATION CONTEXT",
    name: "PaymentService.refund() source",
    content: "Not treated as behavioral truth",
  }
];

export const DEMO_CANDIDATE: CandidateTest = {
  id: "test_refund_raises_after_retry_exhaustion",
  name: "test_refund_raises_after_retry_exhaustion",
  mode: "Behavior-grounded",
  basedOn: [
    "PR behavior requirement",
    "changed function + diff",
    "related pytest tests",
    "repository fixtures"
  ],
  code: `def test_refund_raises_after_retry_exhaustion(payment_service, mock_gateway):
    mock_gateway.process_refund.side_effect = TransientGatewayError("Timeout")
    with pytest.raises(RetryExhaustedException) as exc_info:
        payment_service.refund("pay_001", Decimal("50.00"))
    assert "Refund failed after 3 attempts" in str(exc_info.value)
    assert mock_gateway.process_refund.call_count == 4`,
  validation: {
    syntax: true,
    collection: true,
    executed: true,
    branchReached: true,
    humanReviewRequired: true,
  }
};
