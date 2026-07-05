// Keep this predicate in sync with src/lib/markdown/mermaid.js.
function isTruthyEnv(value) {
  return value === "1" || value?.toLowerCase() === "true";
}

const isCloudBuild =
  isTruthyEnv(process.env.CI) ||
  isTruthyEnv(process.env.WORKERS_CI) ||
  isTruthyEnv(process.env.CF_PAGES);

module.exports = {
  skipDownload: isCloudBuild,
};
