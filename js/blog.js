(() => {
  const input = document.getElementById('article-search');
  const items = [...document.querySelectorAll('.post-item')];
  const months = [...document.querySelectorAll('.month-label')];
  const buttons = [...document.querySelectorAll('[data-filter]')];
  let category = '';
  const params = new URLSearchParams(location.search);
  input.value = params.get('q') || '';
  const requestedCategory = params.get('category') || '';
  if (buttons.some(b => b.dataset.filter === requestedCategory)) category = requestedCategory;
  function update() {
    const query = input.value.trim().toLocaleLowerCase();
    const visibleMonths = new Set();
    let count = 0;
    for (const item of items) {
      item.hidden = !((!category || item.dataset.category === category) && (!query || item.dataset.search.includes(query)));
      if (!item.hidden) { count++; visibleMonths.add(item.dataset.month); }
    }
    for (const month of months) month.hidden = !visibleMonths.has(month.dataset.month);
    for (const button of buttons) button.setAttribute('aria-pressed', String(button.dataset.filter === category));
    document.getElementById('result-count').textContent = `共 ${count} 篇文章`;
    document.getElementById('empty-state').hidden = count !== 0;
    const url = new URL(location.href);
    query ? url.searchParams.set('q', input.value.trim()) : url.searchParams.delete('q');
    category ? url.searchParams.set('category', category) : url.searchParams.delete('category');
    history.replaceState(null, '', url);
  }
  input.addEventListener('input', update);
  for (const button of buttons) button.addEventListener('click', () => { category = button.dataset.filter; update(); });
  update();
})();
