import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { markdownToMdast, mdxToMdast } from "satteri";

const MERMAID_RENDER_VERSION = "quiet-paper-mermaid-v1";
const MERMAID_CACHE_DIR = path.resolve(process.cwd(), "src/generated/mermaid");
const MERMAID_SCAN_DIR = path.resolve(process.cwd(), "src");
const BROWSER_CLOSE_DELAY_MS = 100;

const inFlightRenders = new Map();
let renderQueue = Promise.resolve();
let browserPromise;
let browserCloseTimer;

const mermaidConfig = {
  securityLevel: "strict",
  startOnLoad: false,
  theme: "base",
  themeVariables: {
    background: "#faf9f6",
    mainBkg: "#faf9f6",
    primaryColor: "#faf9f6",
    primaryBorderColor: "#ddd9d0",
    primaryTextColor: "#1a1917",
    secondaryColor: "#f4f3ef",
    secondaryBorderColor: "#ebe8e1",
    secondaryTextColor: "#1a1917",
    tertiaryColor: "#f4f3ef",
    tertiaryBorderColor: "#ebe8e1",
    tertiaryTextColor: "#1a1917",
    lineColor: "#5c5a54",
    textColor: "#1a1917",
    nodeBorder: "#ddd9d0",
    clusterBkg: "#f4f3ef",
    clusterBorder: "#ebe8e1",
    edgeLabelBackground: "#faf9f6",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
  },
};

const parseMMDOptions = {
  backgroundColor: "transparent",
  mermaidConfig,
};

// Keep this predicate in sync with .puppeteerrc.cjs.
function isTruthyEnv(value) {
  return value === "1" || value?.toLowerCase() === "true";
}

function isCi() {
  return (
    isTruthyEnv(process.env.CI) ||
    isTruthyEnv(process.env.WORKERS_CI) ||
    isTruthyEnv(process.env.CF_PAGES)
  );
}

function cacheKey(source) {
  return createHash("sha256")
    .update(
      JSON.stringify({
        source,
        parseMMDOptions,
        renderVersion: MERMAID_RENDER_VERSION,
      }),
    )
    .digest("hex");
}

function normalizeMermaidSource(source) {
  return source.replace(/\r\n?/g, "\n").replace(/\n$/, "");
}

function isCompleteSvg(svg) {
  const trimmed = svg.trim();

  return trimmed.startsWith("<svg") && trimmed.endsWith("</svg>");
}

function mermaidSourceFromPre(node, ctx) {
  const codeChild = node.children?.find(
    (child) => child.type === "element" && child.tagName === "code",
  );

  if (!codeChild || codeChild.type !== "element") {
    return undefined;
  }

  const className = codeChild.properties?.className;
  const classes = Array.isArray(className)
    ? className
    : typeof className === "string"
      ? className.split(/\s+/)
      : [];
  const lang = codeChild.data?.lang;
  const isMermaid = lang === "mermaid" || classes.includes("language-mermaid");

  if (!isMermaid) {
    return undefined;
  }

  return normalizeMermaidSource(ctx.textContent(codeChild));
}

async function readCachedSvg(hash) {
  try {
    const svg = await readFile(path.join(MERMAID_CACHE_DIR, `${hash}.svg`), "utf8");

    return isCompleteSvg(svg) ? svg : undefined;
  } catch (error) {
    if (error?.code === "ENOENT") {
      return undefined;
    }
    throw error;
  }
}

async function writeCachedSvg(hash, svg) {
  if (!isCompleteSvg(svg)) {
    throw new Error(`Mermaid renderer produced invalid SVG for ${hash}.`);
  }

  await mkdir(MERMAID_CACHE_DIR, { recursive: true });

  const targetPath = path.join(MERMAID_CACHE_DIR, `${hash}.svg`);
  const tempPath = path.join(
    MERMAID_CACHE_DIR,
    `${hash}.${process.pid}.${Date.now()}.tmp`,
  );

  try {
    await writeFile(tempPath, svg);
    await rename(tempPath, targetPath);
  } catch (error) {
    await rm(tempPath, { force: true });
    throw error;
  }
}

function clearBrowserCloseTimer() {
  if (browserCloseTimer) {
    clearTimeout(browserCloseTimer);
    browserCloseTimer = undefined;
  }
}

function getBrowser() {
  clearBrowserCloseTimer();

  if (!browserPromise) {
    browserPromise = import("puppeteer")
      .then(({ default: puppeteer }) =>
        puppeteer.launch({
          headless: "shell",
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
        }),
      )
      .catch((error) => {
        browserPromise = undefined;
        throw error;
      });
  }

  return browserPromise;
}

function scheduleBrowserClose() {
  if (browserCloseTimer) {
    return;
  }

  browserCloseTimer = setTimeout(() => {
    const closingBrowser = browserPromise;

    browserCloseTimer = undefined;
    browserPromise = undefined;
    closingBrowser?.then((browser) => browser.close()).catch(() => undefined);
  }, BROWSER_CLOSE_DELAY_MS);
}

async function renderSvg(source, svgId) {
  const [{ renderMermaid }, browser] = await Promise.all([
    import("@mermaid-js/mermaid-cli"),
    getBrowser(),
  ]);

  try {
    const result = await renderMermaid(browser, source, "svg", {
      ...parseMMDOptions,
      svgId,
    });

    return new TextDecoder().decode(result.data);
  } finally {
    scheduleBrowserClose();
  }
}

function queueRenderSvg(source, svgId) {
  const render = () => renderSvg(source, svgId);
  const queuedRender = renderQueue.then(render, render);

  renderQueue = queuedRender.catch(() => undefined);
  return queuedRender;
}

async function renderAndCacheSvg(source, hash) {
  const svg = await queueRenderSvg(source, `mm-${hash.slice(0, 12)}`);

  await writeCachedSvg(hash, svg);
  return svg;
}

async function getRenderedSvg(source, hash) {
  const cached = await readCachedSvg(hash);

  if (cached) {
    return cached;
  }

  if (isCi()) {
    throw new Error(
      `Missing or invalid cached Mermaid SVG for ${hash}. Run npm run build locally and commit src/generated/mermaid/${hash}.svg.`,
    );
  }

  const inFlightRender = inFlightRenders.get(hash);

  if (inFlightRender) {
    return inFlightRender;
  }

  const render = renderAndCacheSvg(source, hash);

  inFlightRenders.set(hash, render);

  try {
    return await render;
  } finally {
    if (inFlightRenders.get(hash) === render) {
      inFlightRenders.delete(hash);
    }
  }
}

async function findMarkdownFiles(dir) {
  let entries;

  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (error) {
    if (error?.code === "ENOENT") {
      return [];
    }

    throw error;
  }

  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        return findMarkdownFiles(fullPath);
      }

      if (entry.isFile() && /\.mdx?$/.test(entry.name)) {
        return [fullPath];
      }

      return [];
    }),
  );

  return files.flat();
}

function collectMermaidSources(node, sources) {
  if (node.type === "code" && node.lang === "mermaid") {
    sources.push(normalizeMermaidSource(node.value));
  }

  for (const child of node.children ?? []) {
    collectMermaidSources(child, sources);
  }
}

function extractMermaidSources(markdown, file) {
  const tree = file.endsWith(".mdx") ? mdxToMdast(markdown) : markdownToMdast(markdown);
  const sources = [];

  collectMermaidSources(tree, sources);
  return sources;
}

async function getExpectedCacheEntries() {
  const cacheEntries = [];
  const markdownFiles = await findMarkdownFiles(MERMAID_SCAN_DIR);

  for (const file of markdownFiles) {
    const markdown = await readFile(file, "utf8");

    for (const source of extractMermaidSources(markdown, file)) {
      cacheEntries.push({ file, hash: cacheKey(source), source });
    }
  }

  return cacheEntries;
}

async function checkMermaidCache() {
  const missing = [];
  const expectedCacheEntries = await getExpectedCacheEntries();

  for (const { file, hash, source } of expectedCacheEntries) {
    if (!(await readCachedSvg(hash))) {
      if (isCi()) {
        missing.push({ file, hash });
      } else {
        await getRenderedSvg(source, hash);
      }
    }
  }

  if (missing.length === 0) {
    return;
  }

  const details = missing
    .map(
      ({ file, hash }) =>
        `- ${path.relative(process.cwd(), file)} -> src/generated/mermaid/${hash}.svg`,
    )
    .join("\n");

  throw new Error(
    `Missing or invalid cached Mermaid SVGs for CI/Cloudflare build:\n${details}\nRun npm run build locally and commit the generated SVG files.`,
  );
}

async function pruneMermaidCache() {
  const expectedHashes = new Set(
    (await getExpectedCacheEntries()).map(({ hash }) => hash),
  );
  let cacheFiles;

  try {
    cacheFiles = await readdir(MERMAID_CACHE_DIR, { withFileTypes: true });
  } catch (error) {
    if (error?.code === "ENOENT") {
      return 0;
    }

    throw error;
  }

  let pruned = 0;

  await Promise.all(
    cacheFiles.map(async (entry) => {
      if (!entry.isFile() || !entry.name.endsWith(".svg")) {
        return;
      }

      const hash = entry.name.slice(0, -".svg".length);

      if (!expectedHashes.has(hash)) {
        await rm(path.join(MERMAID_CACHE_DIR, entry.name), { force: true });
        pruned += 1;
      }
    }),
  );

  return pruned;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderFigure(source, svg) {
  const escapedSource = escapeHtml(source);

  return `<figure class="qp-mermaid">
  <div class="qp-mermaid-render">
    ${svg}
  </div>
  <details class="qp-mermaid-source">
    <summary>Mermaid source</summary>
    <pre><code class="language-mermaid">${escapedSource}</code></pre>
  </details>
</figure>`;
}

/** @returns {import("satteri").HastPluginDefinition} */
export function mermaidPlugin() {
  return {
    name: `mermaid-${MERMAID_RENDER_VERSION}`,
    element: {
      filter: ["pre"],
      async visit(node, ctx) {
        const source = mermaidSourceFromPre(node, ctx);

        if (!source) {
          return undefined;
        }

        const hash = cacheKey(source);
        const svg = await getRenderedSvg(source, hash);

        /** @type {{ type: "raw", value: string }} */
        const replacement = {
          type: "raw",
          value: renderFigure(source, svg),
        };

        return replacement;
      },
    },
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  Promise.resolve()
    .then(async () => {
      if (process.argv.includes("--prune")) {
        const pruned = await pruneMermaidCache();

        console.log(`Pruned ${pruned} stale Mermaid SVG cache file(s).`);
      }

      if (process.argv.includes("--check-cache")) {
        await checkMermaidCache();
      }
    })
    .catch((error) => {
      console.error(error.message);
      process.exit(1);
    });
}
