let allShows = [];
let allEpisodes = [];
let episodeCache = {};

async function setup() {
  const statusMessage = document.querySelector("#status-message");
  statusMessage.textContent = "Loading TV Shows... Please wait.";

  try {
    const response = await fetch("https://api.tvmaze.com/shows");
    allShows = await response.json();

    allShows.sort((a, b) => a.name.localeCompare(b.name));

    setupShowSearch();
    setupEpisodeSelector();
    setupEpisodeSearch();
    setupNavigation();

    statusMessage.textContent = "";

    makePageForShows(allShows);
  } catch (error) {
    console.error("Fetch failed:", error);
    statusMessage.textContent = "Error loading TV Shows.";
  }
}

function setupNavigation() {
  const backBtn = document.querySelector("#back-to-shows-btn");

  backBtn.addEventListener("click", () => {
    document.querySelector("#episodes-view").style.display = "none";
    document.querySelector("#shows-view").style.display = "block";
  });
}

function switchToEpisodesView(showId) {
  document.querySelector("#shows-view").style.display = "none";
  document.querySelector("#episodes-view").style.display = "block";

  loadEpisodesForShow(showId);
}

async function loadEpisodesForShow(showId) {
  const statusMessage = document.querySelector("#status-message");

  if (episodeCache[showId]) {
    allEpisodes = episodeCache[showId];
    refreshEpisodeUI();
    return;
  }

  statusMessage.textContent = "Loading episodes...";

  try {
    const response = await fetch(
      `https://api.tvmaze.com/shows/${showId}/episodes`
    );
    const data = await response.json();

    allEpisodes = data;
    episodeCache[showId] = data;

    statusMessage.textContent = "";
    refreshEpisodeUI();
  } catch (error) {
    statusMessage.textContent = "Error loading episodes.";
  }
}

function refreshEpisodeUI() {
  document.querySelector("#episode-search-input").value = "";
  populateEpisodeDropdown();
  makePageForEpisodes(allEpisodes);
}

function makePageForShows(showList) {
  const container = document.querySelector("#shows-list");
  container.innerHTML = "";

  const countElem = document.querySelector("#show-search-count");
  countElem.textContent = `Found ${showList.length} shows`;

  for (const show of showList) {
    const card = document.createElement("article");
    card.classList.add("show-card");

    const title = document.createElement("h2");
    title.textContent = show.name;
    title.style.cursor = "pointer";
    title.style.color = "blue";
    title.addEventListener("click", () => {
      switchToEpisodesView(show.id);
    });

    const image = document.createElement("img");
    image.src = show.image
      ? show.image.medium
      : "https://via.placeholder.com/210x295?text=No+Image";

    const details = document.createElement("div");
    details.innerHTML = `
      <p><strong>Genres:</strong> ${show.genres.join(", ")}</p>
      <p><strong>Status:</strong> ${show.status}</p>
      <p><strong>Rating:</strong> ${show.rating.average || "N/A"}</p>
      <p><strong>Runtime:</strong> ${show.runtime} mins</p>
    `;

    const summary = document.createElement("div");
    summary.innerHTML = show.summary || "No summary available.";
    summary.classList.add("show-summary");

    card.appendChild(title);
    card.appendChild(image);
    card.appendChild(details);
    card.appendChild(summary);

    container.appendChild(card);
  }
}

function setupShowSearch() {
  const searchInput = document.querySelector("#show-search-input");

  searchInput.addEventListener("input", (event) => {
    // 1. You grabbed the value here...
    const searchTerm = event.target.value.toLowerCase();

    const filteredShows = allShows.filter((show) => {
      // 2. BUT you tried to use "userInput" here! Change it to searchTerm.
      const term = searchTerm;

      const nameMatch = show.name.toLowerCase().includes(term);

      // PRO TIP: Strip the HTML tags from the summary before searching
      // so users don't find shows by accidentally typing "p" or "div"
      const summaryMatch = (show.summary || "")
        .replace(/<[^>]+>/g, "")
        .toLowerCase()
        .includes(term);

      const genreMatch = show.genres.join(" ").toLowerCase().includes(term);

      return nameMatch || summaryMatch || genreMatch;
    });

    makePageForShows(filteredShows);
  });
}

function setupEpisodeSearch() {
  const searchInput = document.querySelector("#episode-search-input");
  const selector = document.querySelector("#episode-selector");

  searchInput.addEventListener("input", (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredEpisodes = allEpisodes.filter((episode) => {
      const name = episode.name.toLowerCase();
      const summary = episode.summary ? episode.summary.toLowerCase() : "";
      return name.includes(searchTerm) || summary.includes(searchTerm);
    });
    makePageForEpisodes(filteredEpisodes);
    selector.value = "all";
  });
}

function setupEpisodeSelector() {
  const selector = document.querySelector("#episode-selector");
  const searchInput = document.querySelector("#episode-search-input");

  selector.addEventListener("change", (event) => {
    if (event.target.value === "all") {
      makePageForEpisodes(allEpisodes);
    } else {
      const selectedId = Number(event.target.value);
      const filteredEpisodes = allEpisodes.filter((ep) => ep.id === selectedId);
      makePageForEpisodes(filteredEpisodes);
    }
    searchInput.value = "";
  });
}

function populateEpisodeDropdown() {
  const selector = document.querySelector("#episode-selector");
  selector.innerHTML = '<option value="all">All Episodes</option>';

  for (const episode of allEpisodes) {
    const season = String(episode.season).padStart(2, "0");
    const number = String(episode.number).padStart(2, "0");
    const option = document.createElement("option");
    option.value = episode.id;
    option.textContent = `S${season}E${number} - ${episode.name}`;
    selector.appendChild(option);
  }
}

function makePageForEpisodes(episodeList) {
  const container = document.querySelector("#episodes-list");
  container.innerHTML = "";

  const countElem = document.querySelector("#episode-search-count");
  countElem.textContent = `Displaying ${episodeList.length} / ${allEpisodes.length} episodes`;

  for (const episode of episodeList) {
    const season = String(episode.season).padStart(2, "0");
    const number = String(episode.number).padStart(2, "0");
    const fullCode = `S${season}E${number}`;

    const card = document.createElement("article");
    card.classList.add("episode-card");

    const title = document.createElement("h2");
    title.textContent = `${fullCode} - ${episode.name}`;

    const image = document.createElement("img");
    image.src = episode.image
      ? episode.image.medium
      : "https://via.placeholder.com/210x295?text=No+Image";

    const summary = document.createElement("p");
    summary.innerHTML = episode.summary || "No summary available.";

    card.appendChild(title);
    card.appendChild(image);
    card.appendChild(summary);
    container.appendChild(card);
  }
}

window.onload = setup;
