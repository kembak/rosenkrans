<script>
	import { createEventDispatcher } from 'svelte';

	let { options = [], selected = [] } = $props();
	const dispatch = createEventDispatcher();

	function isSelected(id) {
		return selected.includes(id);
	}

	function toggle(id) {
		const next = isSelected(id) ? selected.filter((entry) => entry !== id) : [...selected, id];
		dispatch('change', next);
	}
</script>

<div class="toggle-group">
	{#each options as option}
		<button
			type="button"
			class:selected={isSelected(option.id)}
			aria-pressed={isSelected(option.id)}
			onclick={() => toggle(option.id)}
		>
			<span>{option.label}</span>
			<small>{option.description}</small>
		</button>
	{/each}
</div>

<style>
	.toggle-group {
		display: grid;
		gap: 0.5rem;
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	button {
		display: grid;
		gap: 0.2rem;
		text-align: left;
		padding: 0.7rem 0.75rem;
		border-radius: 0.75rem;
		border: 1px solid var(--line);
		background: color-mix(in srgb, var(--surface), white 15%);
		color: inherit;
		font: inherit;
		cursor: pointer;
		transition: border-color 140ms ease, transform 140ms ease, background-color 140ms ease;
	}

	button:hover {
		transform: translateY(-1px);
	}

	button.selected {
		border-color: var(--accent);
		background: color-mix(in srgb, var(--accent-soft), white 45%);
	}

	span {
		font-size: 0.95rem;
		font-weight: 600;
	}

	small {
		font-size: 0.77rem;
		opacity: 0.8;
	}

	@media (min-width: 48rem) {
		.toggle-group {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
</style>
