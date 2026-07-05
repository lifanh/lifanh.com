import type { Html, Parent, Root, RootContent } from "mdast";
import type { Plugin } from "unified";

/** Escape HTML special characters in mermaid source */
function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function isParent(node: RootContent): node is RootContent & Parent {
  return "children" in node;
}

/** Walk mdast tree and replace mermaid code blocks with HTML containers */
function walk(node: Parent): void {
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    if (child.type === "code" && child.lang === "mermaid") {
      const source = child.value;
      const html: Html = {
        type: "html",
        value: `<div class="mermaid-diagram"><pre class="mermaid-source">${escapeHtml(source)}</pre></div>`
      };
      node.children[i] = html;
    } else if (isParent(child)) {
      walk(child);
    }
  }
}

/**
 * Remark plugin to mark mermaid code blocks for client-side rendering.
 *
 * Converts ```mermaid code blocks into a container with hidden source text,
 * bypassing Shiki highlighting and the copy-button transformer.
 */
const remarkMermaid: Plugin<[], Root> = () => {
  return tree => {
    walk(tree);
  };
};

export default remarkMermaid;
