//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");

  rootElem.innerHTML = "";

  for (let episode of episodeList) {
    const episodeElem = document.createElement("div");
    episodeElem.className = "episode-card";

    const nameElem = document.createElement("h2");
    nameElem.textContent = episode.name;
    episodeElem.className = "episode-name";

    const seasonEpisodeElem = document.createElement("p");
    seasonEpisodeElem.textContent = `S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")}`;
    seasonEpisodeElem.className = "season-episode";

    const imageElem = document.createElement("img");
    imageElem.src = episode.image
      ? episode.image.medium
      : "https://via.placeholder.com/210x295?text=No+Image";
    imageElem.alt = `${episode.name} Image`;
    imageElem.className = "episode-image";

    const summaryElem = document.createElement("p");
    summaryElem.innerHTML = episode.summary || "No summary available.";
    summaryElem.className = "episode-summary";

    episodeElem.appendChild(nameElem);
    episodeElem.appendChild(seasonEpisodeElem);
    episodeElem.appendChild(imageElem);
    episodeElem.appendChild(summaryElem);

    rootElem.appendChild(episodeElem);
  }

  const sourceElem = document.createElement("a");
  sourceElem.href = "https://api.tvmaze.com/";
  sourceElem.target = "_blank";
  sourceElem.textContent = "Data provided by TVMaze";
  sourceElem.className = "source-link";

  const footerElem = document.createElement("footer");
  footerElem.textContent = "© 2024 TV Show Episodes";
  footerElem.className = "footer";

  footerElem.appendChild(sourceElem);
  rootElem.appendChild(footerElem);
}

window.onload = setup;
