const year = document.getElementById("year");
year.textContent = new Date().getFullYear();

document.getElementById("mainBtn").addEventListener("click", () => {
  alert("Explore clicked ✅");
});

document.getElementById("ctaBtn").addEventListener("click", () => {
  alert("Get Started clicked ✅");
});
