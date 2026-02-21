<script>
	import Accordion from '$lib/components/Accordion.svelte';
	import ToggleGroup from '$lib/components/ToggleGroup.svelte';
	import rosaryIllustration from '$lib/assets/rosaryillustration-2.png';
	import virginMaryImage from '$lib/assets/virginmary2.png';
	import { rosaryContent } from '$lib/content/rosaryContent';

	const sectionOptions = [
		{ id: 'rekkefolge', label: 'Rekkefølge', description: 'Bønnen steg for steg' },
		{ id: 'bonner', label: 'Bønner', description: 'Alle faste bønner' },
		{ id: 'mysterier', label: 'Mysterier', description: 'Bibelske meditasjoner' }
	];

	let selectedSections = $state(sectionOptions.map((option) => option.id));

	const sequenceItems = rosaryContent.sequence.map((entry) => ({
		id: entry.id,
		title: entry.title,
		steps: entry.steps
	}));

	const prayerItems = rosaryContent.prayers.map((prayer) => ({
		id: prayer.id,
		title: prayer.title,
		paragraphs: prayer.paragraphs
	}));

	const mysteryItems = rosaryContent.mysteries.map((group) => ({
		id: group.id,
		title: group.title,
		summary: group.dayHint,
		children: group.mysteries.map((mystery) => ({
			id: mystery.id,
			title: mystery.title,
			reference: mystery.reference,
			paragraphs: mystery.paragraphs
		}))
	}));

	const sequenceInitiallyOpen = sequenceItems.map((item) => item.id);
	const prayerInitiallyOpen = prayerItems.map((item) => item.id);

	function sectionVisible(id) {
		return selectedSections.includes(id);
	}

	function onSectionChange(event) {
		selectedSections = event.detail;
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
			<p class="subheader">En tradisjonell og enkel veiviser for rosenkransbønn</p>
			<p class="hero-lead">{rosaryContent.heroLead}</p>
		</div>

		<div class="hero-image">
			<img src={virginMaryImage} alt="Jomfru Maria" loading="lazy" />
		</div>
	</header>

	<section class="about">
		<h2>Hva er rosenkransen?</h2>
		<div class="about-text">
			{#each rosaryContent.about as paragraph}
				<p>{paragraph}</p>
			{/each}
		</div>
	</section>

	<section class="controls">
		<h2>Velg hva du vil se</h2>
		<ToggleGroup options={sectionOptions} selected={selectedSections} on:change={onSectionChange} />
	</section>

	<div class="main-content">
		{#if sectionVisible('rekkefolge')}
			<section id="rekkefolge">
				<h2>Rekkefølge</h2>
				<p class="section-intro">{rosaryContent.guidance}</p>
				<div class="sequence-layout">
					<img src={rosaryIllustration} alt="Rosenkransens oppbygning" loading="lazy" />
					<Accordion items={sequenceItems} initiallyOpen={sequenceInitiallyOpen} />
				</div>
			</section>
		{/if}

		{#if sectionVisible('bonner')}
			<section id="bonner">
				<h2>Bønnene</h2>
				<Accordion items={prayerItems} initiallyOpen={prayerInitiallyOpen} />
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
</main>

<style>
	.page {
		width: min(70rem, 100% - 1.5rem);
		margin: 1.15rem auto 2.5rem;
		display: grid;
		gap: 1.5rem;
	}

	.hero {
		display: grid;
		gap: 1.2rem;
		align-items: center;
	}

	.eyebrow {
		font-size: 0.82rem;
		text-transform: uppercase;
		letter-spacing: 0.11em;
		color: var(--accent);
	}

	h1 {
		font-size: clamp(2rem, 6vw, 3.2rem);
	}

	.subheader {
		font-size: clamp(1.05rem, 2.5vw, 1.3rem);
		color: var(--ink);
	}

	.hero-lead {
		max-width: 56ch;
	}

	.hero-image {
		justify-self: center;
	}

	.hero-image img {
		width: min(100%, 20rem);
		height: auto;
		display: block;
	}

	.about,
	.controls,
	.main-content > section {
		display: grid;
		gap: 0.75rem;
	}

	.about-text {
		display: grid;
		gap: 0.65rem;
	}

	.controls {
		padding: 0.2rem 0;
	}

	.controls h2,
	.main-content h2 {
		font-size: 1.35rem;
	}

	.main-content {
		display: grid;
		gap: 1.65rem;
	}

	.section-intro {
		font-style: italic;
	}

	.sequence-layout {
		display: grid;
		gap: 1rem;
		align-items: start;
	}

	.sequence-layout img {
		width: min(100%, 12rem);
		height: auto;
		display: block;
		justify-self: center;
	}

	.day-hints {
		display: grid;
		gap: 0.35rem;
		font-size: 0.9rem;
		padding-left: 0.2rem;
	}

	:global(.panel) {
		border: 0;
		border-radius: 0;
		box-shadow: none;
		background: color-mix(in srgb, var(--surface), transparent 30%);
	}

	:global(.panel-toggle) {
		padding-inline: 0.75rem;
	}

	:global(.panel-body) {
		padding-inline: 0.75rem;
	}

	@media (min-width: 60rem) {
		.page {
			margin-top: 1.45rem;
			gap: 1.8rem;
		}

		.hero {
			grid-template-columns: 1.15fr 0.85fr;
		}

		.sequence-layout {
			grid-template-columns: 13rem minmax(0, 1fr);
			gap: 1.25rem;
		}

		.sequence-layout img {
			justify-self: start;
		}
	}
</style>
