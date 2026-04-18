// LEVEL 200: Add live search and episode selector
// This file uses getAllEpisodes() from episodes.js — no fetch needed yet

// Load all episodes once at the start — never call getAllEpisodes() more than once
const allEpisodes = getAllEpisodes();

// This function runs when the page loads
function setup() {
  makeControls();
  makePageForEpisodes(allEpisodes);
}

// makeControls() builds the search input and episode selector drop-down
function makeControls() {
  const root = document.getElementById("root");

  // --- Search label and input ---
  const searchLabel = document.createElement("label");
  searchLabel.setAttribute("for", "search-input");
  searchLabel.textContent = "Search episodes: ";

  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.id = "search-input";
  searchInput.placeholder = "Type to search...";

  // --- Episode count display ---
  const countDisplay = document.createElement("p");
  countDisplay.id = "episode-count";
  countDisplay.textContent = `Showing ${allEpisodes.length} / ${allEpisodes.length} episodes`;

  // --- Episode selector label and drop-down ---
  const selectorLabel = document.createElement("label");
  selectorLabel.setAttribute("for", "episode-selector");
  selectorLabel.textContent = "Jump to episode: ";

  const selector = document.createElement("select");
  selector.id = "episode-selector";

  // Default "show all" option
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "-- Show all episodes --";
  selector.appendChild(defaultOption);

  // Add one option per episode in format S01E01 - Winter is Coming
  for (const episode of allEpisodes) {
    const seasonCode = String(episode.season).padStart(2, "0");
    const episodeCode = String(episode.number).padStart(2, "0");
    const fullCode = `S${seasonCode}E${episodeCode}`;
    const option = document.createElement("option");
    option.value = episode.id;
    option.textContent = `${fullCode} - ${episode.name}`;
    selector.appendChild(option);
  }

  // --- Controls container ---
  const controls = document.createElement("nav");
  controls.setAttribute("aria-label", "Episode controls");
  controls.appendChild(searchLabel);
  controls.appendChild(searchInput);
  controls.appendChild(countDisplay);
  controls.appendChild(selectorLabel);
  controls.appendChild(selector);
  root.appendChild(controls);

  // --- Event: search box updates on every keystroke ---
  searchInput.addEventListener("input", function () {
    const term = searchInput.value;
    const matched = filterEpisodes(term);
    makePageForEpisodes(matched);
    document.getElementById("episode-count").textContent =
      `Showing ${matched.length} / ${allEpisodes.length} episodes`;
    selector.value = "";
  });

  // --- Event: episode selector scrolls to selected episode ---
  selector.addEventListener("change", function () {
    if (selector.value === "") {
      makePageForEpisodes(allEpisodes);
      searchInput.value = "";
      document.getElementById("episode-count").textContent =
        `Showing ${allEpisodes.length} / ${allEpisodes.length} episodes`;
      return;
    }
    const selectedId = Number(selector.value);
    const card = document.getElementById(`episode-${selectedId}`);
    if (card) {
      card.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

// filterEpisodes() returns only episodes matching the search term
function filterEpisodes(term) {
  if (term.trim() === "") return allEpisodes;
  const lowerTerm = term.toLowerCase();
  return allEpisodes.filter(function (episode) {
    const nameMatches = episode.name.toLowerCase().includes(lowerTerm);
    const plainSummary = episode.summary
      ? episode.summary.replace(/<[^>]+>/g, "")
      : "";
    const summaryMatches = plainSummary.toLowerCase().includes(lowerTerm);
    return nameMatches || summaryMatches;
  });
}

// makePageForEpisodes() draws one card per episode
function makePageForEpisodes(episodeList) {
  const root = document.getElementById("root");

  // Remove existing cards, footer, and no-results message
  for (const card of root.querySelectorAll("article")) card.remove();
  const oldFooter = root.querySelector("footer");
  if (oldFooter) oldFooter.remove();
  const oldMsg = root.querySelector(".no-results");
  if (oldMsg) oldMsg.remove();

  if (episodeList.length === 0) {
    const message = document.createElement("p");
    message.className = "no-results";
    message.textContent = "No episodes match your search. Try a different term.";
    root.appendChild(message);
    return;
  }

  for (const episode of episodeList) {
    const seasonCode = String(episode.season).padStart(2, "0");
    const episodeCode = String(episode.number).padStart(2, "0");
    const fullCode = `S${seasonCode}E${episodeCode}`;

    const card = document.createElement("article");
    card.id = `episode-${episode.id}`;

    const title = document.createElement("h2");
    title.textContent = `${fullCode} - ${episode.name}`;

    const image = document.createElement("img");
    if (episode.image && episode.image.medium) {
      image.src = episode.image.medium;
      image.alt = episode.name;
    } else {
      image.alt = "No image available";
    }

    const summary = document.createElement("p");
    summary.innerHTML = episode.summary || "No summary available.";

    card.appendChild(title);
    card.appendChild(image);
    card.appendChild(summary);
    root.appendChild(card);
  }

  // TVMaze credit
  const footer = document.createElement("footer");
  const credit = document.createElement("p");
  credit.innerHTML = `Data sourced from <a href="https://www.tvmaze.com">TVMaze.com</a>`;
  footer.appendChild(credit);
  root.appendChild(footer);
}

window.addEventListener("load", setup);
