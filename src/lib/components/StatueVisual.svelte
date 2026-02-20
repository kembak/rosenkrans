<script>
	let spinY = $state(0);
	let crossOffset = $state(0);

	$effect(() => {
		if (typeof window === 'undefined') return;

		const onScroll = () => {
			const y = window.scrollY || 0;
			spinY = (y * 0.08) % 360;
			crossOffset = Math.sin(y / 180) * 12;
		};

		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});
</script>

<div class="visual-shell" style={`--spin-y: ${spinY}deg; --cross-offset: ${crossOffset}px;`} aria-hidden="true">
	<div class="halo"></div>

	<div class="orb">
		<svg viewBox="0 0 180 220" role="presentation">
			<ellipse cx="90" cy="110" rx="62" ry="94" class="ring" />
			<path
				d="M90 46c-10 0-18 8-18 18 0 6 3 11 7 14-10 8-17 21-17 35v34c0 19 13 35 28 35s28-16 28-35v-34c0-14-7-27-17-35 4-3 7-8 7-14 0-10-8-18-18-18z"
				class="statue"
			/>
		</svg>
	</div>

	<span class="cross north"></span>
	<span class="cross east"></span>
	<span class="cross south"></span>
	<span class="cross west"></span>
</div>

<style>
	.visual-shell {
		position: relative;
		min-height: 22rem;
		display: grid;
		place-items: center;
		perspective: 880px;
	}

	.halo {
		position: absolute;
		width: min(26vw, 18rem);
		aspect-ratio: 1;
		border-radius: 50%;
		background: radial-gradient(circle, color-mix(in srgb, var(--accent-soft), white 55%) 0%, transparent 68%);
		filter: blur(2px);
	}

	.orb {
		width: min(24vw, 16rem);
		aspect-ratio: 1/1.2;
		transform-style: preserve-3d;
		transform: rotateY(var(--spin-y));
		transition: transform 90ms linear;
	}

	svg {
		width: 100%;
		height: 100%;
	}

	.ring {
		fill: none;
		stroke: color-mix(in srgb, var(--ink), transparent 55%);
		stroke-width: 1.4;
	}

	.statue {
		fill: color-mix(in srgb, var(--ink), white 18%);
		stroke: color-mix(in srgb, var(--ink), transparent 25%);
		stroke-width: 1.2;
	}

	.cross {
		position: absolute;
		width: 0.95rem;
		height: 1.9rem;
		transform: translateY(var(--cross-offset));
		opacity: 0.7;
	}

	.cross::before,
	.cross::after {
		content: '';
		position: absolute;
		background: color-mix(in srgb, var(--ink), transparent 28%);
	}

	.cross::before {
		width: 2px;
		height: 100%;
		left: 50%;
		transform: translateX(-50%);
	}

	.cross::after {
		width: 0.95rem;
		height: 2px;
		top: 42%;
		left: 0;
	}

	.north {
		top: 0.7rem;
	}

	.east {
		right: 1.2rem;
	}

	.south {
		bottom: 0.7rem;
	}

	.west {
		left: 1.2rem;
	}
</style>
