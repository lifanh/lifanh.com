import { useState } from "react";
import {
  EmptyState,
  HairlineTable,
  LoadingBlock,
  Panel,
} from "@lifanh/quiet-paper";

type Run = {
  id: string;
  name: string;
  status: "ok" | "draft";
  ms: number;
};

const SAMPLE_ROWS: Run[] = [
  { id: "r1", name: "ingest-notes", status: "ok", ms: 124 },
  { id: "r2", name: "sync-index", status: "ok", ms: 891 },
  { id: "r3", name: "export-csv", status: "draft", ms: 0 },
  {
    id: "r4",
    name: "this-is-a-very-long-long-long-name-that-should-trigger-horizontal-scroll-instead-of-squash-not-long-enough-adding-more-text-now",
    status: "draft",
    ms: 0,
  },
];

export default function RunsTable() {
  const [rows, setRows] = useState<Run[]>([]);
  const [loading, setLoading] = useState(false);

  const loadSamples = async () => {
    if (loading) return;
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setRows(SAMPLE_ROWS);
    setLoading(false);
  };

  return (
    <Panel className="max-w-measure-wide">
      <header className="mb-4 space-y-1">
        <h2
          id="runs-title"
          className="font-ui m-0 text-sm font-semibold text-text"
        >
          Recent runs
        </h2>
        <p className="font-ui m-0 text-xs text-muted">
          Lesson 5 · hairline table (no zebra, no shadow)
        </p>
      </header>

      <HairlineTable
        caption="Recent prototype job runs"
        rows={rows}
        getRowKey={(row) => row.id}
        columns={[
          {
            id: "name",
            header: "Job Name",
            cell: (row) => row.name,
          },
          {
            id: "status",
            header: "Status",
            cell: (row) => (
              <span
                className={row.status === "ok" ? "text-text" : "text-muted"}
              >
                {row.status}
              </span>
            ),
          },
          {
            id: "ms",
            header: "ms",
            align: "right",
            cell: (row) => (row.ms > 0 ? row.ms : "—"),
          },
        ]}
        empty={
          loading ? (
            <LoadingBlock label="Loading runs" lines={3} />
          ) : (
            <EmptyState
              title="No runs recorded"
              description="Load sample rows to see alignment and hairline dividers."
              primaryAction={{
                label: "Load samples",
                onClick: loadSamples,
              }}
            />
          )
        }
      />

      {rows.length > 0 ? (
        <p className="font-ui m-0 mt-4 text-center">
          <button
            type="button"
            className="text-sm text-accent underline-offset-2 hover:underline"
            onClick={() => setRows([])}
          >
            Clear table
          </button>
        </p>
      ) : null}
    </Panel>
  );
}
