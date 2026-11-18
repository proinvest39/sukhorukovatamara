(() => {
  'use strict';
  const root = document.getElementById('defamation');
  if (!root) return;
  const cards = [...root.querySelectorAll('.evidence-card')];
  const input = root.querySelector('#df-search');
  const buttons = [...root.querySelectorAll('[data-filter]')];
  const status = root.querySelector('#df-results');
  const empty = root.querySelector('#df-empty');
  if (!input || !status || !empty) return;
  const searchText = cards.map(card => card.textContent.toLocaleLowerCase('ru'));
  let active = 'all';
  function apply() {
    const query = input.value.trim().toLocaleLowerCase('ru');
    let count = 0;
    cards.forEach((card, i) => {
      const matchesFilter = active === 'all' || card.dataset.object.includes(active) || card.dataset.tags.includes(active);
      const visible = matchesFilter && (!query || searchText[i].includes(query));
      card.classList.toggle('hidden-card', !visible);
      if (visible) count++;
    });
    status.textContent = `Показано ${count} из ${cards.length} материалов`;
    empty.hidden = count !== 0;
    buttons.forEach(button => {
      const selected = button.dataset.filter === active;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  }
  input.addEventListener('input', apply);
  buttons.forEach(button => button.addEventListener('click', () => {
    active = button.dataset.filter;
    apply();
  }));
  root.querySelector('#df-reset').addEventListener('click', () => {
    input.value = '';
    active = 'all';
    apply();
    input.focus();
  });
  const header = document.querySelector('body > header');
  if (header) {
    const updateOffset = () => {
      const sticky = getComputedStyle(header).position === 'sticky';
      root.style.setProperty('--df-header-offset', `${sticky ? header.getBoundingClientRect().height : 0}px`);
    };
    if ('ResizeObserver' in window) new ResizeObserver(updateOffset).observe(header);
    window.addEventListener('resize', updateOffset);
    updateOffset();
  }
  apply();
})();
