<script>
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
					<span class="title">{item.title}</span>
					{#if item.meta}
						<span class="meta">{item.meta}</span>
					{/if}
				</span>
				<span class="icon" aria-hidden="true">{isOpen(item.id) ? '-' : '+'}</span>
			</button>

			{#if isOpen(item.id)}
				<div class="panel-body">
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
		border: 1px solid var(--line);
		background: var(--surface);
		border-radius: 0.8rem;
		overflow: hidden;
		box-shadow: var(--soft-shadow);
	}

	.panel-toggle {
		width: 100%;
		padding: 0.85rem 1rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
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
	}

	.title {
		font-weight: 600;
	}

	.meta {
		font-size: 0.85rem;
		opacity: 0.75;
	}

	.icon {
		font-size: 1.25rem;
		width: 1.25rem;
		text-align: center;
	}

	.panel-body {
		padding: 0 1rem 1rem;
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
		border: 1px solid color-mix(in srgb, var(--line), transparent 30%);
		border-radius: 0.65rem;
		padding: 0.55rem 0.75rem;
		background: color-mix(in srgb, var(--surface), white 18%);
	}

	summary {
		cursor: pointer;
		font-weight: 600;
	}

	.reference {
		font-size: 0.9rem;
		opacity: 0.72;
	}
</style>
