import i18n from 'i18next';
import axios from 'axios';
import _ from 'lodash';
import onChange from 'on-change';
import * as yup from 'yup';
import ru from './locales/ru.js';
import { renderError, uiRender } from './view.js';

export default () => {
  const i18nIn = i18n.createInstance();
  const defaultLanguage = 'ru';
  i18nIn.init({
    lng: '',
    debug: false,
    resources: { ru },
  }).then(() => {
    const initialState = {
      form: {
        success: '',
        errors: '',
        url: '',
      },
      visitedPostList: [],
      feedsLinks: [],
      postLinks: [],
    };

    const uiState = {
      feedsTitles: [],
      feedsPosts: [],
      modal: {
        status: 'close',
        postTitle: '',
        postLink: '',
        description: '',
      },
      btnDisable: false,
      interface: {},
      language: '',
    };

    const whatchedUi = onChange(uiState, uiRender(uiState));
    const whatchedState = onChange(initialState, renderError());

    const makeURL = (link) => {
      const url = new URL('/get', 'https://allorigins.hexlet.app');
      url.searchParams.append('disableCache', 'true');
      const newLink = encodeURI(link); // encodeURIComponent encodeURI
      url.searchParams.append('url', newLink);
      return url.toString();
    };

    const makeRequest = (link) => axios.get(link)
      .catch(() => {
        throw Error('NetworkError');
      });

    const makeParse = (data) => {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/xml');
        const feedId = whatchedUi.feedsTitles.length + 1;
        const titleElement = doc.querySelector('channel > title');
        const title = titleElement.textContent;
        const descriptionElement = doc.querySelector('channel > description');
        const feedDescription = descriptionElement.textContent;
        const items = [...doc.querySelectorAll('item')];
        const feed = { feedId, title, feedDescription };
        let postCounter = whatchedUi.feedsPosts.length + 1;
        const posts = items.map((item) => {
          const postTitleElement = item.querySelector('title');
          const postTitle = postTitleElement.textContent;
          const postLinkElement = item.querySelector('link');
          const postLink = postLinkElement.textContent;
          const visited = whatchedState.visitedPostList.includes(postLink);
          const postDescription = item.querySelector('description');
          const description = postDescription.textContent;
          const postId = `${postCounter}`;
          postCounter += 1;
          return {
            feedId,
            postTitle,
            postLink,
            postId,
            visited,
            description,
          };
        });
        return { feed, posts };
      } catch (error) {
        throw Error('ParsingError');
      }
    };

    const showModalWindow = (event) => {
      const { target } = event;
      const { id } = target.dataset;
      const currentPost = _.find(whatchedUi.feedsPosts, { postId: id });
      const { postLink } = currentPost;
      const { description } = currentPost;
      const { postTitle } = currentPost;
      whatchedUi.modal = {
        status: 'open',
        postTitle,
        description,
        postLink,
      };
      whatchedUi.feedsPosts.forEach((post) => {
        if (post.postId === id && !whatchedState.visitedPostList.includes(post.postLink)) {
          post.visited = true;
          whatchedState.visitedPostList.push(post.postLink);
        }
      });
    };

    const refreshPosts = () => {
      const currentFeeds = whatchedState.feedsLinks;
      const promises = currentFeeds.map((feed) => makeRequest(makeURL(feed))
        .then((response) => {
          const { posts } = makeParse(response.data.contents);
          posts.forEach((post) => {
            if (!whatchedState.postLinks.includes(post.postLink)) {
              post.postId = whatchedUi.feedsPosts.length + 1;
              whatchedState.postLinks.push(post.postLink);
              whatchedUi.feedsPosts.push(post);
            }
          });
        }));
      Promise.all(promises).then(() => setTimeout(() => refreshPosts(), 5000));
    };

    const btn = document.querySelector('button[aria-label="add"]');
    const input = document.querySelector('#url-input');
    const form = document.querySelector('form');
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      whatchedState.form.errors = '';
      whatchedState.form.success = '';
      const schema = yup.string().required('Required').url('Incorrecturl').notOneOf(whatchedState.feedsLinks, 'LinkAlreadyAdded');
      whatchedUi.btnDisable = true;
      const { value } = input;
      schema.validate(value)
        .then(() => makeRequest(makeURL(value)))
        .then((response) => {
          const { feed, posts } = makeParse(response.data.contents);
          whatchedUi.feedsTitles.push(feed);
          posts.forEach((post) => {
            whatchedUi.feedsPosts.push(post);
            whatchedState.postLinks.push(post.postLink);
          });
          whatchedState.form.success = i18nIn.t('successLoad');
          whatchedState.feedsLinks.push(value);
          form.reset();
          input.focus();
          whatchedUi.btnDisable = false;
          refreshPosts();
        })
        .catch((err) => {
          whatchedState.form.success = '';
          whatchedState.form.errors = i18nIn.t(`errors.${err.message}`);
          whatchedUi.btnDisable = false;
          input.focus();
        });
    });

    const posts = document.querySelector('.posts');
    posts.addEventListener('click', (event) => {
      event.preventDefault();
      if (event.target.tagName === 'BUTTON') {
        showModalWindow(event);
      }
    });

    const closeButtons = document.querySelectorAll('[data-bs-dismiss="modal"]');
    closeButtons.forEach((closeBtn) => {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        whatchedUi.modal = { ...whatchedUi.modal, status: 'close' };
      });
    });

    const makeTranslation = (val) => {
      i18nIn.changeLanguage(val).then(() => {
        const addBtn = i18nIn.t('btn');
        const h1 = i18nIn.t('h1');
        const feedsTitle = i18nIn.t('feedsTitle');
        const postsTitle = i18nIn.t('postsTitle');
        const lead = i18nIn.t('lead');
        const label = i18nIn.t('label');
        const example = i18nIn.t('example');
        const modalOpen = i18nIn.t('modalOpen');
        const modalRefBtn = i18nIn.t('modalRef');
        const modalCloseBtn = i18nIn.t('modalClose');
        whatchedUi.language = val;
        whatchedUi.interface = {
          addBtn,
          h1,
          feedsTitle,
          postsTitle,
          lead,
          label,
          example,
          modalOpen,
          modalRefBtn,
          modalCloseBtn,
        };
      });
    };
    makeTranslation(defaultLanguage);
  });
};
