import sourceMarkdown from '../../../rosenkransen.md?raw';

function cleanInline(text) {
	return text
		.replace(/\[(.*?)\]\((.*?)\)/g, '$1')
		.replace(/\(link to [^)]+\)/gi, '')
		.replace(/[_*`]/g, '')
		.replace(/\s+/g, ' ')
		.trim();
}

function splitParagraphs(text) {
	return text
		.split(/\n\s*\n/)
		.map((paragraph) => cleanInline(paragraph))
		.filter(Boolean);
}

function excerpt(text, maxLength = 180) {
	if (!text || text.length <= maxLength) return text;
	return `${text.slice(0, maxLength).trimEnd()}...`;
}

function sliceBetween(document, startHeading, endHeading) {
	const startIndex = document.indexOf(startHeading);
	if (startIndex === -1) return '';

	const fromStart = document.slice(startIndex + startHeading.length);
	if (!endHeading) return fromStart.trim();

	const endIndex = fromStart.indexOf(endHeading);
	return (endIndex === -1 ? fromStart : fromStart.slice(0, endIndex)).trim();
}

function slugify(value) {
	return value
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '');
}

function splitHeadingBlocks(section, headingPrefix) {
	const normalized = section.trim();
	if (!normalized) return [];

	return normalized
		.split(new RegExp(`\\n(?=${headingPrefix}\\s+)`))
		.map((block) => block.trim())
		.filter((block) => block.startsWith(`${headingPrefix} `));
}

function parseSequence(section) {
	const blocks = splitHeadingBlocks(section, '##');

	return blocks.map((block) => {
		const [titleLine, ...rest] = block.split('\n');
		const title = cleanInline(titleLine.replace(/^##\s+/, ''));
		const steps = rest
			.filter((line) => line.trim().startsWith('- '))
			.map((line) => cleanInline(line.replace(/^- /, '')));

		return {
			id: `sequence-${slugify(title)}`,
			title,
			steps
		};
	});
}

function parsePrayers(section) {
	const blocks = splitHeadingBlocks(section, '###');

	return blocks.map((block, index) => {
		const [titleLine, ...rest] = block.split('\n');
		const body = rest.join('\n').replace(/^_\((.*?)\)_$/gm, '$1').trim();
		const paragraphs = splitParagraphs(body);

		return {
			id: `prayer-${index + 1}`,
			title: cleanInline(titleLine.replace(/^###\s+/, '')),
			summary: excerpt(paragraphs[0], 160),
			paragraphs
		};
	});
}

function parseMysteryGroup(groupBlock, groupIndex) {
	const [titleLine, ...rest] = groupBlock.split('\n');
	const body = rest.join('\n').trim();
	const dayHintMatch = body.match(/_\((.*?)\)_/);
	const dayHint = dayHintMatch ? cleanInline(dayHintMatch[1]) : '';

	const markerRegex = /\*\*(\d+)\.\s+(.+?)\*\*/g;
	const markers = [];

	let markerMatch = markerRegex.exec(body);
	while (markerMatch) {
		markers.push({
			number: markerMatch[1],
			title: cleanInline(markerMatch[2]),
			start: markerMatch.index,
			end: markerRegex.lastIndex
		});
		markerMatch = markerRegex.exec(body);
	}

	const mysteries = markers.map((marker, index) => {
		const endOfSection = index === markers.length - 1 ? body.length : markers[index + 1].start;
		const description = body.slice(marker.end, endOfSection).trim();
		const paragraphs = splitParagraphs(description);
		const referenceMatch = marker.title.match(/\(([^)]+)\)\s*$/);
		const reference = referenceMatch ? referenceMatch[1] : '';
		const title = marker.title.replace(/\s*\([^)]+\)\s*$/, '');

		return {
			id: `mystery-${groupIndex + 1}-${marker.number}`,
			title: `${marker.number}. ${title}`,
			reference,
			summary: excerpt(paragraphs[0], 180),
			paragraphs
		};
	});

	return {
		id: `mystery-group-${groupIndex + 1}`,
		title: cleanInline(titleLine.replace(/^###\s+/, '')),
		dayHint,
		mysteries
	};
}

function parseMysteries(section) {
	return splitHeadingBlocks(section, '###').map((groupBlock, index) =>
		parseMysteryGroup(groupBlock, index)
	);
}

function buildRosaryContent(markdown) {
	// Keep parsing lightweight so content can be edited directly in rosenkransen.md.
	const normalized = markdown.replace(/\r\n/g, '\n').trim();
	const aboutSection = sliceBetween(normalized, '# Hva er rosenkransen?', '# Hvordan be rosenkransen?');
	const howToSection = sliceBetween(normalized, '# Hvordan be rosenkransen?', '# Rekkefølge');
	const sequenceSection = sliceBetween(normalized, '# Rekkefølge', '# Bønnene');
	const prayersSection = sliceBetween(normalized, '# Bønnene', '# Mysteriene');
	const mysteriesSection = sliceBetween(normalized, '# Mysteriene');

	const aboutParagraphs = splitParagraphs(aboutSection);
	const guidanceParagraph = splitParagraphs(howToSection)[0] ?? '';
	const sequence = parseSequence(sequenceSection);
	const prayers = parsePrayers(prayersSection);
	const mysteries = parseMysteries(mysteriesSection);

	return {
		siteTitle: 'Rosenkransen',
		heroTitle: 'Rosenkransen',
		heroLead:
			'En enkel og vakker veiviser for å lære og be rosenkransen, bygget for både hverdagsbønn og fordypning.',
		about: aboutParagraphs,
		guidance: guidanceParagraph,
		sequence,
		prayers,
		mysteries,
		mysteryDays: mysteries
			.map((group) => ({
				id: group.id,
				label: group.title,
				dayHint: group.dayHint
			}))
			.filter((group) => group.dayHint)
	};
}

export const rosaryContent = buildRosaryContent(sourceMarkdown);
