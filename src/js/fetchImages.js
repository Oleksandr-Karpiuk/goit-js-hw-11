import axios from 'axios';

export { fetchImages };

const API_KEY = '34615368-0381629427ca9bb4715ff6b7d';
const BASE_URL = 'https://pixabay.com/api/';
const PER_PAGE = 40;
const properties = '&image_type=photo&orientation=horizontal&safesearch=true';

async function fetchImages(searchQuery, page) {
  const response = await axios.get(
    `${BASE_URL}?key=${API_KEY}&q=${searchQuery}${properties}&page=${page}&per_page=${PER_PAGE}`
  );

  return response;
}
