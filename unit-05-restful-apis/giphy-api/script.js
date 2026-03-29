const API_KEY = "YOUR_GIPHY_API_KEY";
const BASE_URL = "https://api.giphy.com/v1/gifs/search";
const GIF_LIMIT = 12;

const gifContainer = document.querySelector("#gif-container");
const fetchGifButton = document.querySelector("#fetch-gif-btn");
const searchInput = document.querySelector("#search-input");
const statusMessage = document.querySelector("#status-message");

let images = [];

const buildEndpoint = (query) => {
  const params = new URLSearchParams({
    api_key: API_KEY,
    q: query,
    limit: GIF_LIMIT.toString(),
    rating: "g",
    lang: "en",
  });

  return `${BASE_URL}?${params.toString()}`;
};

const setStatus = (message) => {
  statusMessage.textContent = message;
};

const validateApiKey = () => {
  if (API_KEY === "YOUR_GIPHY_API_KEY" || !API_KEY.trim()) {
    setStatus("Add your Giphy API key in script.js before fetching GIFs.");
    return false;
  }
  return true;
};

const fetchGifUrls = async (query) => {
  const endpoint = buildEndpoint(query);
  const response = await fetch(endpoint);

  if (!response.ok) throw new Error(`Request failed with status ${response.status}`);

  const payload = await response.json();
  return payload.data.map((gif) => gif.images.fixed_width.url);
};

const renderGifGrid = () => {
  gifContainer.innerHTML = "";

  if (images.length === 0) {
    gifContainer.innerHTML = '<p class="text-muted">No GIFs found for that search.</p>';
    return;
  }

  const fragment = document.createDocumentFragment();

  for (const imageUrl of images) {
    const col = document.createElement("div");
    col.className = "col-6 col-md-3 mb-3";

    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = "Giphy search result";
    img.loading = "lazy";

    col.appendChild(img);
    fragment.appendChild(col);
  }

  gifContainer.appendChild(fragment);
};

const handleFetchClick = async () => {
  if (!validateApiKey()) return;

  const query = searchInput.value.trim() || "cats";
  fetchGifButton.disabled = true;
  setStatus(`Loading GIFs for "${query}"...`);

  try {
    images = await fetchGifUrls(query);
    renderGifGrid();
    setStatus(`Showing ${images.length} GIFs for "${query}".`);
  } catch (error) {
    images = [];
    renderGifGrid();
    setStatus("Unable to load GIFs. Check API key and try again.");
  } finally {
    fetchGifButton.disabled = false;
  }
};

fetchGifButton.addEventListener("click", handleFetchClick);
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") handleFetchClick();
});
