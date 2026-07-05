import { useCallback, useState } from "react";
import { ErrorState, LoadingBlock, Panel } from "@lifanh/quiet-paper";

type Phase = "idle" | "loading" | "ok" | "error";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function FetchDemo() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [payload, setPayload] = useState<string | null>(null);
  const [failNext, setFailNext] = useState(true);

  const load = useCallback(async () => {
    setPhase("loading");
    setPayload(null);
    await wait(600);
    if (failNext) {
      setFailNext(false);
      setPhase("error");
      return;
    }
    setPayload("transactions · 42 rows · last sync 2m ago");
    setPhase("ok");
  }, [failNext]);

  return (
    <Panel>
      <header className="mb-4 space-y-1">
        <h2
          id="fetch-title"
          className="font-ui m-0 text-sm font-semibold text-text"
        >
          Fetch demo
        </h2>
        <p className="font-ui m-0 text-xs text-muted">
          Lesson 8 · idle → loading → error or ok
        </p>
      </header>

      {phase === "idle" ? (
        <p className="font-ui m-0 text-sm text-muted">
          <button
            type="button"
            className="text-accent underline-offset-2 hover:underline"
            onClick={() => void load()}
          >
            Load summary
          </button>{" "}
          to simulate an API call.
        </p>
      ) : null}

      {phase === "loading" ? (
        <LoadingBlock label="Loading summary" lines={2} />
      ) : null}

      {phase === "error" ? (
        <ErrorState
          title="Could not load summary"
          description="The request failed. Check the network or API, then try again."
          detail="GET /api/summary → 503 Service Unavailable"
          primaryAction={{
            label: "Retry",
            onClick: () => void load(),
          }}
          secondaryAction={{
            label: "Dismiss",
            onClick: () => setPhase("idle"),
          }}
        />
      ) : null}

      {phase === "ok" && payload ? (
        <p className="font-ui m-0 text-sm text-text" role="status">
          {payload}
        </p>
      ) : null}
    </Panel>
  );
}