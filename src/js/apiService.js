import refs from './refs';
import imgTemplate from '../templates/imgTemplate.hbs';
import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basicLightbox.min.css';
const { gallery, loadMoreBtn } = refs;
import pnotifly from './pnotify';

export default {
  q: '',
  page: 1,
  per_page: 12,
  basicUrl: 'https://pixabay.com/api/',
  image_type: 'photo',
  orientation: 'horizontal',
  apiKey: '19685420-fed2cd4121ce12409727a9e3b',
  scroll: window.innerHeight - 50,

  get query() {
    return this.q;
  },
  set query(value) {
    return (this.q = value);
  },

  fetchQuery(value) {
    this.query = value;
    const params = `?q=${this.q}&image_type=${this.image_type}&orientation=${this.orientation}&page=${this.page}&per_page=${this.per_page}&key=${this.apiKey}`;
    const url = this.basicUrl + params;
    return fetch(url)
      .then(response => {
        return response.json();
      })
      .then(({ total, hits }) => {
        if (total === 0) pnotifly.error('Проблемка......');
        if (total > this.per_page) this.morePageBtn();

        return { hits };
      })

      .then(({ hits }) => {
        this.createImagesList(hits);
        this.scrollPage();
      })
      .then(() => {
        gallery.addEventListener('click', this.openModal);
      });
  },

  openModal(e) {
    if (e.target.nodeName !== 'IMG') {
      return;
    }
    const largeImg = e.target.getAttribute('data-large-img');
    const instance = basicLightbox.create(
      ` <img class="image" src="${largeImg}" alt="{{largeImageURL}}"  />`,
    );
    instance.show();
  },

  createImagesList(obj) {
    gallery.insertAdjacentHTML('beforeend', imgTemplate(obj));
  },

  clearListImages() {
    gallery.innerHTML = '';
  },

  morePageBtn() {
    loadMoreBtn.classList.remove('is-hidden');
  },

  hideMorePageBtn() {
    loadMoreBtn.classList.add('is-hidden');
  },

  nextPage() {
    this.page += 1;
  },

  resetPage() {
    this.page = 1;
  },

  scrollPage() {
    if (this.page > 1)
      window.scrollBy({
        top: this.scroll,
        behavior: 'smooth',
      });
  },
};
