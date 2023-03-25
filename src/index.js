import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './js/fetchImages';
import { renderGallery } from './js/renderGallery';

const searchFormRef = document.querySelector('#search-form');
const galleryRef = document.querySelector('.gallery');
const loadMoreRef = document.querySelector('.load-btn');
const PER_PAGE = 40;
let searchQuery = '';
let page = 1;
let lightBox;

searchFormRef.addEventListener('submit', onSearchForm);
loadMoreRef.addEventListener('click', onLoadMoreClick);

async function onSearchForm(e) {
  e.preventDefault();

  galleryRef.innerHTML = '';
  loadMoreRef.classList.add('is-hidden');

  searchQuery = e.currentTarget.searchQuery.value.trim();
  page = 1;

  if (!searchQuery) {
    Notiflix.Notify.failure(
      'The search string cannot be empty. Please specify your search query.'
    );
    searchFormRef.reset();
    return;
  }

  try {
    const { data } = await fetchImages(searchQuery, page);

    if (data.totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      renderGallery(data.hits);

      lightBox = new SimpleLightbox('.gallery a', {
        captionsData: 'alt',
        captionDelay: 250,
      }).refresh();

      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);

      if (data.totalHits > PER_PAGE) {
        loadMoreRef.classList.remove('is-hidden');
      }
    }
  } catch (error) {
    console.log(error);
  } finally {
    searchFormRef.reset();
  }
}

async function onLoadMoreClick() {
  page += 1;
  lightBox.destroy();

  try {
    const { data } = await fetchImages(searchQuery, page);

    renderGallery(data.hits);

    const totalPages = Math.ceil(data.totalHits / PER_PAGE);
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    lightBox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    }).refresh();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });

    if (page === totalPages) {
      loadMoreRef.classList.add('is-hidden');

      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    console.log(error);
  }
}
