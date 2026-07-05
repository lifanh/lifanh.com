import { Button, Field, Panel } from "@lifanh/quiet-paper";

export default function SubscribePanel() {
  return (
    <Panel>
      <header className="mb-4 space-y-2">
        <h2
          id="subscribe-title"
          className="m-0 font-sans text-xl leading-tight text-text"
        >
          Stay in the loop
        </h2>
        <p className="m-0 text-base leading-relaxed text-muted">
          One quiet note when there is something worth reading. No noise.
        </p>
      </header>

      <form
        className="space-y-4"
        onSubmit={(event) => event.preventDefault()}
        aria-label="Email subscription"
      >
        <Field
          id="subscribe-email"
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@example.com"
          hint="Display only — nothing is sent yet."
        />
        <Button type="submit">Subscribe</Button>
      </form>
    </Panel>
  );
}
