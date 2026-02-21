<script>
	import { slide } from 'svelte/transition';

	let { items = [], allowMultiple = true, initiallyOpen = [] } = $props();
	let openIds = $state([]);
	let initialized = false;

	$effect(() => {
		if (initialized || !items.length) return;
		initialized = true;

		const validInitial = initiallyOpen.filter((id) => items.some((item) => item.id === id));
		if (validInitial.length) {
			openIds = [...new Set(validInitial)];
		}
	});

	$effect(() => {
		const validIds = new Set(items.map((item) => item.id));
		const next = openIds.filter((id) => validIds.has(id));
		if (next.length !== openIds.length) {
			openIds = next;
		}
	});

	function isOpen(id) {
		return openIds.includes(id);
	}

	function toggle(id) {
		if (isOpen(id)) {
			openIds = openIds.filter((openId) => openId !== id);
			return;
		}

		openIds = allowMultiple ? [...openIds, id] : [id];
	}
</script>

<div class="accordion">
	{#each items as item (item.id)}
		<article class="panel">
			<button
				type="button"
				class="panel-toggle"
				aria-expanded={isOpen(item.id)}
				onclick={() => toggle(item.id)}
			>
				<span class="title-block">
					<h3 class="title">{item.title}</h3>
					{#if item.meta}
						<span class="meta">{item.meta}</span>
					{/if}
				</span>

				<span class="icon" class:open={isOpen(item.id)} aria-hidden="true">
					<svg viewBox="0 0 24 24" focusable="false">
						<path d="M6 9l6 6 6-6" />
					</svg>
				</span>
			</button>

			{#if isOpen(item.id)}
				<div class="panel-body" in:slide={{ duration: 140 }} out:slide={{ duration: 110 }}>
					{#if item.summary}
						<p class="summary">{item.summary}</p>
					{/if}

					{#if item.steps?.length}
						<ol>
							{#each item.steps as step}
								<li>{step}</li>
							{/each}
						</ol>
					{/if}

					{#if item.paragraphs?.length}
						{#each item.paragraphs as paragraph}
							<p>{paragraph}</p>
						{/each}
					{/if}

					{#if item.children?.length}
						<div class="children">
							{#each item.children as child}
								<details>
									<summary>{child.title}</summary>
									{#if child.reference}
										<p class="reference">{child.reference}</p>
									{/if}
									{#if child.summary}
										<p>{child.summary}</p>
									{/if}
									{#if child.paragraphs?.length}
										{#each child.paragraphs as paragraph}
											<p>{paragraph}</p>
										{/each}
									{/if}
								</details>
							{/each}
						</div>
					{/if}
				</div>
			{/if}
		</article>
	{/each}
</div>

<style>
	.accordion {
		display: grid;
		gap: 0.75rem;
	}

	.panel {
		border: 0;
		background: transparent;
		border-radius: 0;
		overflow: visible;
		box-shadow: none;
	}

	.panel-toggle {
		width: 100%;
		padding: 0.5rem 0.15rem;
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 0.75rem;
		background: transparent;
		border: 0;
		text-align: left;
		cursor: pointer;
		font: inherit;
	}

	.title-block {
		display: grid;
		gap: 0.2rem;
		flex: 1;
	}

	.title {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 400;
		border-bottom: 1.5px solid color-mix(in srgb, var(--accent), white 18%);
		padding-bottom: 0.2rem;
	}

	.meta {
		font-size: 0.85rem;
		opacity: 0.75;
	}

	.icon {
		flex: 0 0 1.25rem;
		width: 1.25rem;
		height: 1.25rem;
		display: grid;
		place-items: center;
		color: var(--ink-soft);
		transition: transform 130ms ease, color 130ms ease;
		transform-origin: 50% 50%;
	}

	.icon svg {
		width: 1.1rem;
		height: 1.1rem;
		display: block;
	}

	.icon path {
		fill: none;
		stroke: currentColor;
		stroke-width: 1.8;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.icon.open {
		transform: rotate(180deg);
		color: var(--accent);
	}

	.panel-body {
		padding: 0.15rem 0.2rem 0.95rem;
		display: grid;
		gap: 0.75rem;
	}

	.summary {
		font-style: italic;
		opacity: 0.9;
	}

	ol {
		margin: 0;
		padding-left: 1.25rem;
		display: grid;
		gap: 0.35rem;
	}

	p {
		margin: 0;
		line-height: 1.5;
	}

	.children {
		display: grid;
		gap: 0.55rem;
	}

	details {
		border: 0;
		border-radius: 0;
		padding: 0.55rem 0.1rem;
		background: transparent;
	}

	summary {
		cursor: pointer;
		font-weight: 500;
	}

	.reference {
		font-size: 0.9rem;
		opacity: 0.72;
	}
</style>
