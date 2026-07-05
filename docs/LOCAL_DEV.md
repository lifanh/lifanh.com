# Local dev

Default: install from npm (`@lifanh/quiet-paper@^0.2.0`).

To hack on the design system locally:

```bash
git clone git@github.com:lifanh/quiet-paper.git ../quiet-paper
cd ../quiet-paper && npm install && npm run build
cd ../astro-quiet-paper
npm install ../quiet-paper
npm run dev
```

Revert with `npm install @lifanh/quiet-paper@^0.2.0` when done.
