document.getElementById('year').textContent = new Date().getFullYear();

// Subtle pointer glow for desktop
document.addEventListener('pointermove', (event) => {
  const x = (event.clientX / window.innerWidth) * 100;
  const y = (event.clientY / window.innerHeight) * 100;
  document.documentElement.style.setProperty('--pointer-x', `${x}%`);
  document.documentElement.style.setProperty('--pointer-y', `${y}%`);
});
