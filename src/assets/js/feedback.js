async function loadAdventures() {
  const res = await fetch("./src/data/adventures.json");
  if (!res.ok) throw new Error("Could not load adventures.json");
  return await res.json();
}

function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

(async () => {
  const adventureId = getParam("adventure");
  const info = document.getElementById("fbInfo");
  const frame = document.getElementById("fbFrame");

  try {
    const adventures = await loadAdventures();
    const a = adventures.find((x) => x.id === adventureId);

    if (!a) {
      info.textContent = "Hittade inte äventyret. Gå tillbaka till Adventures.";
      frame.remove();
      return;
    }

    info.textContent = `Feedback för: ${a.title}`;
    frame.src = a.feedbackUrl; // use embed link if you want nicer iframe
  } catch (e) {
    info.textContent = "Kunde inte ladda feedback just nu.";
    frame.remove();
    console.error(e);
  }
})();

fetch("./src/assets/data/adventures.json")
