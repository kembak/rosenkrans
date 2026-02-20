<script>
	import Accordion from '$lib/components/Accordion.svelte';
	import StatueVisual from '$lib/components/StatueVisual.svelte';
	import ToggleGroup from '$lib/components/ToggleGroup.svelte';
	import { rosaryContent } from '$lib/content/rosaryContent';

	const sectionOptions = [
		{ id: 'rekkefolge', label: 'Rekkefølge', description: 'Bønnen steg for steg' },
		{ id: 'bonner', label: 'Bønner', description: 'Alle faste bønner' },
		{ id: 'mysterier', label: 'Mysterier', description: 'Bibelske meditasjoner' }
	];

	let selectedSections = $state(sectionOptions.map((option) => option.id));
	let compactMode = $state(false);

	const sequenceItems = rosaryContent.sequence.map((entry) => ({
		id: entry.id,
		title: entry.title,
		steps: entry.steps
	}));

	const prayerItems = $derived.by(() =>
		rosaryContent.prayers.map((prayer) => ({
			id: prayer.id,
			title: prayer.title,
			summary: compactMode ? prayer.summary : '',
			paragraphs: compactMode ? prayer.paragraphs.slice(0, 1) : prayer.paragraphs
		}))
	);

	const mysteryItems = $derived.by(() =>
		rosaryContent.mysteries.map((group) => ({
			id: group.id,
			title: group.title,
			summary: group.dayHint,
			children: group.mysteries.map((mystery) => ({
				id: mystery.id,
				title: mystery.title,
				reference: mystery.reference,
				summary: compactMode ? mystery.summary : '',
				paragraphs: compactMode ? mystery.paragraphs.slice(0, 1) : mystery.paragraphs
			}))
		}))
	);

	function sectionVisible(id) {
		return selectedSections.includes(id);
	}

	function onSectionChange(event) {
		const next = event.detail;
		selectedSections = next.length ? next : selectedSections;
	}
</script>

<svelte:head>
	<title>Rosenkransen</title>
	<meta
		name="description"
		content="Interaktiv norsk veiviser for å lære og be den katolske rosenkransen."
	/>
</svelte:head>

<main class="page">
	<header class="hero">
		<div class="hero-content">
			<p class="eyebrow">Katolsk bønneliv</p>
			<h1>{rosaryContent.heroTitle}</h1>
			<p>{rosaryContent.heroLead}</p>
		</div>

		<div class="about">
			{#each rosaryContent.about as paragraph}
				<p>{paragraph}</p>
			{/each}
		</div>
	</header>

	<section class="controls">
		<h2>Velg hva du vil se</h2>
		<ToggleGroup options={sectionOptions} selected={selectedSections} on:change={onSectionChange} />

		<label class="compact">
			<input type="checkbox" bind:checked={compactMode} />
			<span>Kompakt visning (kortere tekst i hver seksjon)</span>
		</label>
	</section>

	<div class="content-layout">
		<div class="main-content">
			{#if sectionVisible('rekkefolge')}
				<section id="rekkefolge">
					<h2>Rekkefølge</h2>
					<p class="section-intro">{rosaryContent.guidance}</p>
					<Accordion items={sequenceItems} initiallyOpen={[sequenceItems[0]?.id]} />
				</section>
			{/if}

			{#if sectionVisible('bonner')}
				<section id="bonner">
					<h2>Bønnene</h2>
					<Accordion items={prayerItems} />
				</section>
			{/if}

			{#if sectionVisible('mysterier')}
				<section id="mysterier">
					<h2>Mysteriene</h2>
					<div class="day-hints">
						{#each rosaryContent.mysteryDays as day}
							<p>{day.label}: {day.dayHint}</p>
						{/each}
					</div>
					<Accordion items={mysteryItems} />
				</section>
			{/if}
		</div>

		<aside class="desktop-visual">
			<StatueVisual />
		</aside>
	</div>
</main>

<style>
	.page {
		width: min(70rem, 100% - 1.5rem);
		margin: 1.1rem auto 2.5rem;
		display: grid;
		gap: 1rem;
	}

	.hero,
	.controls,
	.main-content > section {
		padding: 1rem;
		border: 1px solid var(--line);
		border-radius: 1rem;
		background: var(--surface);
		box-shadow: var(--soft-shadow);
	}

	.hero {
		display: grid;
		gap: 1rem;
	}

	.eyebrow {
		font-size: 0.82rem;
		text-transform: uppercase;
		letter-spacing: 0.11em;
	}

	h1 {
		font-size: clamp(1.75rem, 6vw, 2.9rem);
	}

	.about {
		display: grid;
		gap: 0.65rem;
	}

	.controls {
		display: grid;
		gap: 0.75rem;
	}

	.controls h2 {
		font-size: 1.2rem;
	}

	.compact {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		font-size: 0.9rem;
	}

	.compact input {
		width: 1rem;
		height: 1rem;
	}

	.content-layout {
		display: block;
	}

	.main-content {
		display: grid;
		gap: 1rem;
	}

	.main-content > section {
		display: grid;
		gap: 0.75rem;
	}

	.main-content h2 {
		font-size: 1.4rem;
	}

	.section-intro {
		font-style: italic;
	}

	.day-hints {
		display: grid;
		gap: 0.35rem;
		font-size: 0.9rem;
	}

	.desktop-visual {
		display: none;
	}

	@media (min-width: 60rem) {
		.page {
			margin-top: 1.8rem;
			gap: 1.2rem;
		}

		.hero {
			grid-template-columns: 1.2fr 1fr;
		}

		.content-layout {
			display: grid;
			grid-template-columns: minmax(0, 1fr) minmax(16rem, 23rem);
			align-items: start;
			gap: 1rem;
		}

		.desktop-visual {
			display: block;
			position: sticky;
			top: 1rem;
			padding: 1rem;
			border: 1px solid var(--line);
			border-radius: 1rem;
			background: var(--surface);
			box-shadow: var(--soft-shadow);
		}
	}
</style>
