async function loadAdventures() {
  const res = await fetch("./src/data/adventures.json");
  if (!res.ok) throw new Error("Could not load adventures.json");
  return await res.json();
}

function formatDate(iso) {
  // simple formatting (SV)
  const [y, m, d] = iso.split("-").map(Number);
  return `${d}/${m}/${y}`;
}

function cardTemplate(a) {
  const full = a.spotsLeft <= 0;
  const interestText = full ? "Fullt" : `Intresserad (${a.spotsLeft} kvar)`;

  return `
    <article class="card">
      <div class="card__top">
        <h2 class="card__title">${a.title}</h2>
        <div class="badge">${a.language}</div>
      </div>

      <div class="card__meta">
        <div><strong>Datum:</strong> ${formatDate(a.date)} ${a.time}</div>
        <div><strong>DM:</strong> ${a.dm}</div>
        <div><strong>Plats:</strong> ${a.location}</div>
        <div><strong>Max:</strong> ${a.maxPlayers}</div>
      </div>

      <div class="card__actions">
        <a class="btn ${full ? "btn--disabled" : ""}"
           href="${full ? "#" : a.interestUrl}"
           target="_blank"
           rel="noreferrer"
           ${full ? 'aria-disabled="true" onclick="return false;"' : ""}>
          ${interestText}
        </a>

        <a class="btn btn--ghost"
           href="./feedback.html?adventure=${encodeURIComponent(a.id)}">
          Feedback
        </a>
      </div>
    </article>
  `;
}

(async () => {
  const grid = document.getElementById("adventureGrid");
  try {
    const adventures = await loadAdventures();
    grid.innerHTML = adventures.map(cardTemplate).join("");
  } catch (e) {
    grid.innerHTML = `<div class="card"><p>Kunde inte ladda äventyr just nu.</p></div>`;
    console.error(e);
  }
})();

fetch("./src/assets/data/adventures.json")
