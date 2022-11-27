import i18n from 'i18next';
import ru from './locales/ru.js';

const i18nIn = i18n.createInstance();
i18nIn.init({
  lng: 'ru',
  debug: false,
  resources: { ru },
});

const initialState = {
  form: {
    valid: true,
    errors: '',
    url: '',
    btnDisable: false,
  },
  feeds: [],
  language: '',
};

const feedsState = {
  feedsTitles: [],
  feedsPosts: [],
  feedsCounter: 0,
  postsCounter: 0,
  visitedPostList: [],
  modal: {
    status: 'close',
    postTitle: '',
    postLink: '',
    description: '',
  },
};

export { i18nIn, feedsState, initialState };
