import { useState } from "react";
import { EmptyState, Panel } from "@lifanh/quiet-paper";

const SAMPLE = { id: "1", name: "Quiet inbox", updated: "Just now" };

export default function ExperimentsList() {
  const [items, setItems] = useState<typeof SAMPLE[]>([]);

  return (
    <Panel>
      <header className="mb-4 space-y-1">
        <h2
          id="experiments-title"
          className="font-ui m-0 text-sm font-semibold text-text"
        >
          Experiments
        </h2>
        <p className="font-ui m-0 text-xs text-muted">
          Lesson 4 · empty vs filled list
        </p>
      </header>

      {items.length === 0 ? (
        <EmptyState
          title="No experiments yet"
          description="Add a sample row to see the filled list pattern."
          primaryAction={{
            label: "Add sample",
            onClick: () => setItems([SAMPLE]),
          }}
        />
      ) : (
        <ul className="m-0 list-none space-y-0 p-0">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-baseline justify-between gap-4 border-b border-border-subtle py-3 first:pt-0 last:border-b-0"
            >
              <span className="font-ui text-sm text-text">{item.name}</span>
              <span className="font-ui shrink-0 text-xs text-muted">
                {item.updated}
              </span>
            </li>
          ))}
        </ul>
      )}

      {items.length > 0 ? (
        <p className="font-ui m-0 mt-4 text-center">
          <button
            type="button"
            className="text-sm text-accent underline-offset-2 hover:underline"
            onClick={() => setItems([])}
          >
            Clear list
          </button>
        </p>
      ) : null}
    </Panel>
  );
}