﻿'use strict';

const brainInput     = document.getElementById('brainInput');
const releaseBtn     = document.getElementById('releaseBtn');
const releaseMessage = document.getElementById('releaseMessage');

releaseBtn.addEventListener('click', () => {
  const hasText = brainInput.value.trim().length > 0;

  if (!hasText) {
    releaseMessage.textContent = "There is nothing to release yet — or maybe that is a good thing. \u2733";
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
    const fallback = FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
    quoteText.textContent   = fallback.q;
    quoteAuthor.textContent = fallback.a;
  }

  quoteText.classList.add('fade-in');
}

newQuoteBtn.addEventListener('click', fetchCalmingQuote);
fetchCalmingQuote();

const petSelection = document.getElementById('petSelection');
const petInteractive = document.getElementById('petInteractive');
const petAvatar = document.getElementById('petAvatar');
const moodBar = document.getElementById('moodBar');
const hungerBar = document.getElementById('hungerBar');
const hygieneBar = document.getElementById('hygieneBar');
const moodVal = document.getElementById('moodVal');
const hungerVal = document.getElementById('hungerVal');
const hygieneVal = document.getElementById('hygieneVal');

let petStats = { mood: 100, hunger: 100, hygiene: 100 };
let petInterval;

const svgs = {
  cat: `<svg class="pet-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="60" r="30" fill="var(--ocean-deep)" />
          <path d="M25 40 L35 15 L50 35 Z" fill="var(--ocean-deep)" />
          <path d="M75 40 L65 15 L50 35 Z" fill="var(--ocean-deep)" />
          <path class="tail-wag" d="M20 75 Q 0 85 10 50" stroke="var(--ocean-deep)" stroke-width="6" stroke-linecap="round" fill="none" />
          <circle cx="40" cy="55" r="4" fill="var(--sand)" />
          <circle cx="60" cy="55" r="4" fill="var(--sand)" />
          <path d="M47 62 Q 50 65 53 62" stroke="var(--sand)" stroke-width="2" stroke-linecap="round" fill="none" />
        </svg>`,
  dog: `<svg class="pet-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="50" cy="65" rx="35" ry="25" fill="var(--sage-deep)" />
          <circle cx="50" cy="45" r="22" fill="var(--sage-deep)" />
          <ellipse cx="25" cy="50" rx="8" ry="20" fill="var(--sage-deep)" />
          <ellipse cx="75" cy="50" rx="8" ry="20" fill="var(--sage-deep)" />
          <path class="tail-wag" d="M80 70 Q 95 60 90 40" stroke="var(--sage-deep)" stroke-width="6" stroke-linecap="round" fill="none" />
          <circle cx="42" cy="40" r="3" fill="var(--sand)" />
          <circle cx="58" cy="40" r="3" fill="var(--sand)" />
          <circle cx="50" cy="48" r="4" fill="var(--ink)" />
        </svg>`
};

function initPet(type) {
  petSelection.classList.add('d-none');
  petInteractive.classList.remove('d-none');
  petInteractive.classList.add('d-flex');
  petAvatar.innerHTML = svgs[type];
  
  petInterval = setInterval(() => {
    petStats.mood = Math.max(0, petStats.mood - 1);
    petStats.hunger = Math.max(0, petStats.hunger - 2);
    petStats.hygiene = Math.max(0, petStats.hygiene - 0.5);
    updatePetUI();
  }, 3000);
}

function updatePetUI() {
  moodBar.style.width = petStats.mood + '%';
  hungerBar.style.width = petStats.hunger + '%';
  hygieneBar.style.width = petStats.hygiene + '%';
  
  moodVal.textContent = Math.round(petStats.mood) + '%';
  hungerVal.textContent = Math.round(petStats.hunger) + '%';
  hygieneVal.textContent = Math.round(petStats.hygiene) + '%';
}

document.getElementById('chooseCatBtn').addEventListener('click', () => initPet('cat'));
document.getElementById('chooseDogBtn').addEventListener('click', () => initPet('dog'));

document.getElementById('petBtn').addEventListener('click', () => {
  petStats.mood = Math.min(100, petStats.mood + 15);
  updatePetUI();
});
document.getElementById('feedBtn').addEventListener('click', () => {
  petStats.hunger = Math.min(100, petStats.hunger + 20);
  updatePetUI();
});
document.getElementById('batheBtn').addEventListener('click', () => {
  petStats.hygiene = Math.min(100, petStats.hygiene + 30);
  updatePetUI();
});

let hanoiState = [[4, 3, 2, 1], [], []];
let selectedPeg = null;

function renderHanoi() {
  for (let i = 0; i < 3; i++) {
    const pegEl = document.getElementById('peg-' + i);
    pegEl.innerHTML = '';
    hanoiState[i].forEach(diskSize => {
      const disk = document.createElement('div');
      disk.className = 'hanoi-disk hanoi-disk-' + diskSize;
      pegEl.appendChild(disk);
    });
  }
  
  document.querySelectorAll('.hanoi-peg-area').forEach(el => el.classList.remove('selected'));
  if (selectedPeg !== null) {
    document.querySelector(`[data-peg="${selectedPeg}"]`).classList.add('selected');
  }

  if (hanoiState[2].length === 4) {
    document.getElementById('hanoiMessage').classList.remove('opacity-0');
  } else {
    document.getElementById('hanoiMessage').classList.add('opacity-0');
  }
}

document.querySelectorAll('.hanoi-peg-area').forEach(peg => {
  peg.addEventListener('click', () => {
    const pegIndex = parseInt(peg.getAttribute('data-peg'));
    
    if (selectedPeg === null) {
      if (hanoiState[pegIndex].length > 0) {
        selectedPeg = pegIndex;
      }
    } else {
      if (selectedPeg === pegIndex) {
        selectedPeg = null;
      } else {
        const sourceTop = hanoiState[selectedPeg][hanoiState[selectedPeg].length - 1];
        const targetTop = hanoiState[pegIndex][hanoiState[pegIndex].length - 1];
        
        if (!targetTop || sourceTop < targetTop) {
          hanoiState[pegIndex].push(hanoiState[selectedPeg].pop());
        }
        selectedPeg = null;
      }
    }
    renderHanoi();
  });
});

document.getElementById('resetHanoiBtn').addEventListener('click', () => {
  hanoiState = [[4, 3, 2, 1], [], []];
  selectedPeg = null;
  renderHanoi();
});

renderHanoi();

const bookShelf = document.getElementById('bookShelf');
const CALM_BOOK_IDS = '2680,4507,45,46,16,10715,3600,74';

const FALLBACK_BOOKS = [
  { title: 'Meditations',          authors: 'Marcus Aurelius',     url: 'https://www.gutenberg.org/ebooks/2680' },
  { title: 'As a Man Thinketh',    authors: 'James Allen',         url: 'https://www.gutenberg.org/ebooks/4507' },
  { title: 'Anne of Green Gables', authors: 'L. M. Montgomery',    url: 'https://www.gutenberg.org/ebooks/45' },
  { title: 'The Book of Tea',      authors: 'Kakuzo Okakura',      url: 'https://www.gutenberg.org/ebooks/7001' },
];

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function renderBooks(books) {
  bookShelf.innerHTML = '';
  books.slice(0, 4).forEach((book) => {
    const readUrl = book.formats && (book.formats['text/html'] || book.formats['text/html; charset=utf-8']);
    const col = document.createElement('div');
    col.className = 'col-12 col-md-6 col-lg-3';
    
    const svgCover = `<svg class="book-svg-cover" viewBox="0 0 128 192" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="128" height="192" rx="8" fill="var(--sand)"/>
      <rect x="8" y="16" width="112" height="160" rx="4" fill="var(--white-warm)"/>
      <path d="M40 80 L88 80 M40 100 L88 100 M64 120 L88 120" stroke="var(--sage-deep)" stroke-width="4" stroke-linecap="round"/>
      <circle cx="64" cy="48" r="16" fill="var(--ocean-deep)" opacity="0.5"/>
    </svg>`;

    col.innerHTML = `
      <div class="book-card text-center">
        ${svgCover}
        <h3 class="book-title mb-1 mt-3">${escapeHtml(book.title)}</h3>
        <p class="text-muted-soft small mb-3 flex-grow-1">${escapeHtml(book.authors || 'Unknown')}</p>
        <a class="btn btn-soft btn-sm w-100 mt-auto" href="${readUrl || book.url || ('https://www.gutenberg.org/ebooks/' + book.id)}"
           target="_blank" rel="noopener noreferrer">Read</a>
      </div>`;
    bookShelf.appendChild(col);
  });
}

async function loadCalmingBooks() {
  try {
    const response = await fetch(`https://gutendex.com/books/?ids=${CALM_BOOK_IDS}`);
    if (!response.ok) throw new Error('Book service responded with ' + response.status);

    const data = await response.json();
    const books = data.results.map((b) => ({
      id: b.id,
      title: b.title,
      authors: b.authors.map((a) => a.name).join(', '),
      formats: b.formats,
    }));

    if (!books.length) throw new Error('No books returned');
    renderBooks(books);
  } catch (error) {
    renderBooks(FALLBACK_BOOKS);
  }
}

loadCalmingBooks();