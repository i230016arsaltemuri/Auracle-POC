import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { DEMO_TEST_NEED, DEMO_CANDIDATE } from '../data/demoScenario';
import type { DemoPhase, TestNeed, CandidateTest } from '../data/demoScenario';

interface DemoState {
  phase: DemoPhase;
  testNeed: TestNeed;
  candidate: CandidateTest | null;
  setPhase: (phase: DemoPhase) => void;
  acceptCandidate: () => void;
  runExecution: () => void;
  mergePR: () => void;
}

const DemoContext = createContext<DemoState | undefined>(undefined);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<DemoPhase>("NO_AURACLE");
  const [testNeed, setTestNeed] = useState<TestNeed>(DEMO_TEST_NEED);
  const [candidate, setCandidate] = useState<CandidateTest | null>(null);

  const acceptCandidate = () => {
    setPhase("CANDIDATE_ACCEPTED");
    setCandidate(DEMO_CANDIDATE);
  };

  const runExecution = () => {
    setPhase("EXECUTED");
    setTestNeed((prev: TestNeed) => ({ ...prev, resolved: true, coverageState: "covered" }));
  };

  const mergePR = () => {
    setPhase("MERGED");
  };

  return (
    <DemoContext.Provider value={{
      phase,
      setPhase,
      testNeed,
      candidate,
      acceptCandidate,
      runExecution,
      mergePR
    }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
}
