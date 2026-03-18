function filterNav(query) {
  const q = query.toLowerCase();
  document.querySelectorAll('nav a').forEach(a => {
    a.style.display = a.textContent.toLowerCase().includes(q) ? 'flex' : 'none';
  });
  document.querySelectorAll('.nav-section').forEach(s => {
    s.style.display = q ? 'none' : 'block';
  });
}
