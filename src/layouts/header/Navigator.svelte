<script lang="ts">
import { onMount } from "svelte";

let { route, routes }: { route: string; routes: any[] } = $props();

function active(path: string, extra?: string[]) {
  if (extra?.some(item => item === route)) return true;
  if (path === routes[0].path) return path === route;
  return route.startsWith(path);
}

function handleClose() {
  document.getElementById("sidebar")!.classList.remove("active");
  document.getElementById("sidebar-overlay")!.classList.remove("active");
}

onMount(() => {
  const register = () => window.swup?.hooks.on("page:load", () => (route = window.location.pathname));
  window.swup ? register() : document.addEventListener("swup:enable", register, { once: true });
});
</script>

{#each routes as item}
	{@const isActive = active(item.path, item.extra)}
	<a
		href={item.path}
		onclick={handleClose}
		class={`transition-colors duration-150 hover:text-primary ${isActive ? "text-primary font-bold sm:font-normal sm:underline sm:underline-offset-4 sm:decoration-[1px]" : "text-secondary"}`}
	>
		{item.label}
	</a>
{/each}
