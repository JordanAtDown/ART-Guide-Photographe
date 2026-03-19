function filterNav(query) {
  const q = query.toLowerCase();
  document.querySelectorAll('nav a').forEach(a => {
    a.style.display = a.textContent.toLowerCase().includes(q) ? 'flex' : 'none';
  });
  document.querySelectorAll('.nav-section').forEach(s => {
    s.style.display = q ? 'none' : 'block';
  });
}

function toggleNav() {
  document.querySelector('nav').classList.toggle('open');
  document.getElementById('navOverlay').classList.toggle('open');
}

function closeNav() {
  document.querySelector('nav').classList.remove('open');
  document.getElementById('navOverlay').classList.remove('open');
}

document.querySelectorAll('nav a').forEach(a => a.addEventListener('click', closeNav));
