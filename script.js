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

    episodeElem.appendChild(episodeElem);
  }

  const footerElem = document.createElement("footer");
  footerElem.textContent = "© 2024 TV Show Episodes";
  footerElem.className = "footer";
}

window.onload = setup;
