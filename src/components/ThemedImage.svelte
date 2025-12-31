<script lang="ts">
import { onMount } from "svelte";
import zoom from "medium-zoom/dist/pure";
import type { Zoom } from "medium-zoom";

interface Props {
  light: string;
  dark: string;
  alt: string;
  class?: string;
}

let { light, dark, alt, class: className = "" }: Props = $props();
let isDark = $state(false);
let imgElement: HTMLImageElement | null = $state(null);
let zoomInstance: Zoom | null = null;

// Get background color based on current theme
function getZoomBackground() {
  return getComputedStyle(document.documentElement).getPropertyValue("--background-color").trim();
}

// Create or recreate zoom instance with current theme background
function setupZoom() {
  if (zoomInstance) {
    zoomInstance.detach();
  }
  if (imgElement) {
    zoomInstance = zoom(imgElement, { background: getZoomBackground() });
  }
}

onMount(() => {
  // Initial theme check
  isDark = document.documentElement.dataset.theme === "dark";

  // Watch for theme changes
  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      if (mutation.attributeName === "data-theme") {
        const newIsDark = document.documentElement.dataset.theme === "dark";
        // Close zoom and recreate with new background if theme changes
        if (isDark !== newIsDark && zoomInstance) {
          zoomInstance.close();
        }
        isDark = newIsDark;
        // Recreate zoom with updated background color
        setupZoom();
      }
    }
  });

  observer.observe(document.documentElement, { attributes: true });

  // Create initial zoom instance
  setupZoom();

  return () => {
    observer.disconnect();
    zoomInstance?.detach();
  };
});
</script>

<img bind:this={imgElement} src={isDark ? dark : light} {alt} class={className} data-nozoom />
