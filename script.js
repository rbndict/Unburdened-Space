﻿
'use strict';

const brainInput     = document.getElementById('brainInput');
const releaseBtn     = document.getElementById('releaseBtn');
const releaseMessage = document.getElementById('releaseMessage');

releaseBtn.addEventListener('click', () => {
  const hasText = brainInput.value.trim().length > 0;

  if (!hasText) {
    releaseMessage.textContent =
      "There is nothing to release yet — or maybe that is a good thing. \u2733";
    releaseMessage.classList.remove('opacity-0');
    return;
  }

  brainInput.classList.add('dissolving');
  releaseBtn.disabled = true;

  setTimeout(() => {
    brainInput.value = '';
    brainInput.blur();

    brainInput.classList.remove('dissolving');
    brainInput.classList.add('fade-in');
    setTimeout(() => brainInput.classList.remove('fade-in'), 900);

    releaseMessage.innerHTML = "It's gone. Only you knew it, and now only you let it go.\n"
      + '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
      + '<path d="M4 20C4 11 10 5 20 4c1 10-5 16-14 16z"/><path d="M4 20c3-5 7-9 12-12"/></svg>';
    releaseMessage.classList.remove('opacity-0');
    releaseBtn.disabled = false;

    setTimeout(() => releaseMessage.classList.add('opacity-0'), 5000);
  }, 1600);
});

const breathCircle = document.getElementById('breathCircle');
const breathText   = document.getElementById('breathText');
const breathToggle = document.getElementById('breathToggle');

const BREATH_PHASES = [
  { label: 'Breathe in…',  duration: 4000, scale: 1.9 },
  { label: 'Hold…',        duration: 4000, scale: 1.9 },
  { label: 'Breathe out…', duration: 6000, scale: 1.0 },
];

let breathTimer = null;
let phaseIndex   = 0;
let isBreathing  = false;

function runPhase() {
  const phase = BREATH_PHASES[phaseIndex];

  breathText.textContent = phase.label;

  breathCircle.style.transitionDuration = phase.duration + 'ms';
  breathCircle.style.transform = 'scale(' + phase.scale + ')';

  breathTimer = setTimeout(() => {
    phaseIndex = (phaseIndex + 1) % BREATH_PHASES.length;
    runPhase();
  }, phase.duration);
}

function startBreathing() {
  isBreathing = true;
  phaseIndex = 0;
  breathToggle.textContent = 'Pause';
  breathToggle.setAttribute('aria-pressed', 'true');
  runPhase();
}

function stopBreathing() {
  isBreathing = false;
  clearTimeout(breathTimer);
  breathCircle.style.transitionDuration = '1200ms';
  breathCircle.style.transform = 'scale(1)';
  breathText.textContent = 'Ready when you are';
  breathToggle.textContent = 'Begin breathing';
  breathToggle.setAttribute('aria-pressed', 'false');
}

breathToggle.addEventListener('click', () => {
  isBreathing ? stopBreathing() : startBreathing();
});

const quoteText   = document.getElementById('quoteText');
const quoteAuthor = document.getElementById('quoteAuthor');
const newQuoteBtn = document.getElementById('newQuoteBtn');

const FALLBACK_QUOTES = [
  { q: 'You do not have to control your thoughts. You just have to stop letting them control you.', a: 'Dan Millman' },
  { q: 'Almost everything will work again if you unplug it for a few minutes — including you.', a: 'Anne Lamott' },
  { q: 'Breathe. Let go. And remind yourself that this very moment is the only one you know you have.', a: 'Oprah Winfrey' },
  { q: 'Feelings come and go like clouds in a windy sky. Conscious breathing is my anchor.',          a: 'Thich Nhat Hanh' },
  { q: 'The quieter you become, the more you can hear.',                                              a: 'Ram Dass' },
];

async function fetchCalmingQuote() {
  quoteText.textContent = 'Loading a gentle thought…';
  quoteAuthor.textContent = '';
  quoteText.classList.remove('fade-in');

  try {
    const response = await fetch('https://zenquotes.io/api/random', {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) throw new Error('Quote service responded with ' + response.status);

    const data = await response.json();
    quoteText.textContent   = data[0].q;
    quoteAuthor.textContent = data[0].a;
  } catch (error) {
    console.info('Quote API unavailable, using a local quote instead. (', error.message, ')');
    const fallback = FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
    quoteText.textContent   = fallback.q;
    quoteAuthor.textContent = fallback.a;
  }

  quoteText.classList.add('fade-in');
}

newQuoteBtn.addEventListener('click', fetchCalmingQuote);

fetchCalmingQuote();
