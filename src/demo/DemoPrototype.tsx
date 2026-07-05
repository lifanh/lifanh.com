import { useState } from "react";
import ExperimentsList from "./ExperimentsList";
import FetchDemo from "./FetchDemo";
import RunsTable from "./RunsTable";
import SubscribePanel from "./SubscribePanel";
import { Button, Field, Panel } from "@lifanh/quiet-paper";

export default function DemoPrototype() {
  const [name, setName] = useState("");
  const [note, setNote] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | undefined>();

  return (
    <div className="mx-auto w-full max-w-measure-wide space-y-6">
      <header className="space-y-2">
        <p className="font-ui m-0 text-xs font-semibold tracking-[0.12em] text-muted uppercase">
          Lesson 3 · React island
        </p>
        <h2 className="m-0 text-xl leading-tight">Prototype shell</h2>
        <p className="m-0 text-base leading-relaxed text-muted">
          Same tokens as the marketing page—tighter labels, hairline panel, no
          shadows.
        </p>
      </header>

      <Panel>
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            const trimmed = name.trim();
            if (!trimmed) {
              setNameError("Enter a name to save a draft.");
              setNote(null);
              return;
            }
            setNameError(undefined);
            setNote(`Saved “${trimmed}”.`);
          }}
        >
          <Field
            id="demo-name"
            label="Experiment name"
            hint="A single line is enough for early demos."
            error={nameError}
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              if (nameError) setNameError(undefined);
            }}
            placeholder="e.g. Quiet inbox"
          />
          <div className="flex flex-wrap gap-3 pt-1">
            <Button type="submit">Save draft</Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setName("");
                setNote(null);
              }}
            >
              Reset
            </Button>
          </div>
        </form>
        {note ? (
          <p className="font-ui m-0 mt-4 text-sm text-muted" role="status">
            {note}
          </p>
        ) : null}
      </Panel>

      <ExperimentsList />

      <RunsTable />

      <FetchDemo />

      <SubscribePanel />
    </div>
  );
}