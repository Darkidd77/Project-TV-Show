let allEpisodes;

async function setup() {
  const statusMessage = document.querySelector("#status-message");
  statusMessage.textContent = "Loading episodes... Please wait.";

  try {
    const response = await fetch("https://api.tvmaze.com/shows/82/episodes");
    const data = await response.json();

    allEpisodes = data;
    statusMessage.textContent = "";

    setupEpisodeSelector();
    setupSearch();
    makePageForEpisodes(allEpisodes);
  } catch (error) {
    console.error("Fetch failed:", error);
    statusMessage.textContent =
      "Sorry, we couldn't load the episodes. Please try checking your internet connection.";
    statusMessage.style.color = "red";
  }
}

function setupEpisodeSelector() {
  const selector = document.querySelector("#episode-selector");

  for (const episode of allEpisodes) {
    const seasonCode = String(episode.season).padStart(2, "0");
    const episodeCode = String(episode.number).padStart(2, "0");
    const fullCode = `S${seasonCode}E${episodeCode}`;

    const option = document.createElement("option");
    option.value = episode.id;
    option.textContent = `${fullCode} - ${episode.name}`;
    selector.appendChild(option);
  }

  selector.addEventListener("change", function () {
    const searchInput = document.querySelector("#search-input");

    if (selector.value === "all") {
      makePageForEpisodes(allEpisodes);
      searchInput.value = "";
      return;
    }

    const selectedId = Number(selector.value);
    const filteredEpisodes = allEpisodes.filter((ep) => ep.id === selectedId);

    makePageForEpisodes(filteredEpisodes);
    searchInput.value = "";
  });
}

function setupSearch() {
  const searchInput = document.querySelector("#search-input");
  const selector = document.querySelector("#episode-selector");

  searchInput.addEventListener("input", function () {
    const term = searchInput.value.toLowerCase();

    if (term.trim() === "") {
      makePageForEpisodes(allEpisodes);
      return;
    }

    const filteredEpisodes = allEpisodes.filter((episode) => {
      const nameMatches = episode.name.toLowerCase().includes(term);
      const plainSummary = episode.summary
        ? episode.summary.replace(/<[^>]+>/g, "").toLowerCase()
        : "";
      const summaryMatches = plainSummary.includes(term);

      return nameMatches || summaryMatches;
    });

    makePageForEpisodes(filteredEpisodes);
    selector.value = "all";
  });
}

function makePageForEpisodes(episodeList) {
  const root = document.getElementById("root");

  root.innerHTML = "";

  const countDisplay = document.querySelector("#episode-count");
  countDisplay.textContent = `Showing ${episodeList.length} / ${allEpisodes.length} episodes`;

  // Handle empty search results
  if (episodeList.length === 0) {
    const message = document.createElement("p");
    message.className = "no-results";
    message.textContent =
      "No episodes match your search. Try a different term.";
    root.appendChild(message);
    return;
  }

  // Build the cards
  for (const episode of episodeList) {
    const seasonCode = String(episode.season).padStart(2, "0");
    const episodeCode = String(episode.number).padStart(2, "0");
    const fullCode = `S${seasonCode}E${episodeCode}`;

    const card = document.createElement("article");
    card.classList.add("episode-card");

    const title = document.createElement("h2");
    title.textContent = `${fullCode} - ${episode.name}`;

    const image = document.createElement("img");
    if (episode.image && episode.image.medium) {
      image.src = episode.image.medium;
      image.alt = episode.name;
    } else {
      image.src = "https://via.placeholder.com/210x295?text=No+Image";
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
  footer.classList.add("footer");
  const credit = document.createElement("p");
  credit.innerHTML = `Data sourced from <a href="https://www.tvmaze.com" target="_blank">TVMaze.com</a>`;
  footer.appendChild(credit);
  root.appendChild(footer);
}

window.addEventListener("load", setup);
