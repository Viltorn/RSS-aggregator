/* eslint-disable object-curly-newline */
import './styles.scss';
import 'bootstrap';
import * as yup from 'yup';
import onChange from 'on-change';
import _ from 'lodash';
import axios from 'axios';
import { i18nIn, uiState, initialState } from './init.js';
import { renderError, uiRender } from './view.js';

const whatchedUi = onChange(uiState, uiRender());
const whatchedState = onChange(initialState, renderError());

const makeRequest = (url) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${url}`)
  .catch(() => {
    whatchedState.form.errors = i18nIn.t('errors.NetworkError');
    throw Error('Networkerror');
  });

const makeParse = (data) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'text/xml');
  const errorNode = doc.querySelector('parsererror');
  if (errorNode) {
    whatchedState.form.errors = i18nIn.t('errors.ParsingError');
    throw Error('ParsingError');
  }
  return doc;
};

const makeFeeds = (html) => {
  whatchedUi.feedsCounter += 1;
  const feedId = whatchedUi.feedsCounter;
  const titleElement = html.querySelector('channel > title');
  const title = titleElement.textContent;
  const descriptionElement = html.querySelector('channel > description');
  const description = descriptionElement.textContent;
  whatchedUi.feedsTitles.push({ feedId, title, description });
};

const makePosts = (html, feedId) => {
  const items = [...html.querySelectorAll('item')];
  const posts = items.map((item) => {
    const postTitleElement = item.querySelector('title');
    const postTitle = postTitleElement.textContent;
    const postLinkElement = item.querySelector('link');
    const postLink = postLinkElement.textContent;
    const visited = whatchedState.visitedPostList.includes(postLink);
    const postDescription = item.querySelector('description');
    const description = postDescription.textContent;
    whatchedUi.postsCounter += 1;
    const postId = `${whatchedUi.postsCounter}`;
    return { feedId, postTitle, postLink, postId, visited, description };
  });
  whatchedUi.feedsPosts.push(...posts);
};

const showModalWindow = (event) => {
  const { target } = event;
  const { id } = target.dataset;
  const currentPost = _.find(whatchedUi.feedsPosts, { postId: id });
  const { postLink } = currentPost;
  const { description } = currentPost;
  const { postTitle } = currentPost;
  whatchedUi.modal = { status: 'show', postTitle, description, postLink };
  whatchedUi.feedsPosts.forEach((post) => {
    if (post.postId === id && !whatchedState.visitedPostList.includes(post.postLink)) {
      post.visited = true;
      whatchedState.visitedPostList.push(post.postLink);
    }
  });
  console.log(whatchedState.visitedPostList);
};

const refreshPosts = () => {
  new Promise((resolve) => {
    setTimeout(() => {
      const currentFeeds = whatchedState.feeds;
      const initial = Promise.resolve([]);
      currentFeeds.reduce((acc, feed) => acc.then((content) => makeRequest(feed)
        .then((response) => [...content, response.data.contents])), initial)
        .then((data) => {
          whatchedUi.postsCounter = 0;
          whatchedUi.feedsPosts = [];
          let feedId = 1;
          data.forEach((doc) => {
            const html = makeParse(doc);
            makePosts(html, feedId);
            feedId += 1;
          });
          resolve();
        })
        .catch(() => {
          resolve();
          throw Error('Refresh posts error');
        });
    }, 5000);
  }).then(() => refreshPosts());
};

const schema = yup.string().required('Required').url('Incorrecturl').notOneOf(whatchedState.feeds, 'LinkAlreadyAdded');
const btn = document.querySelector('button[aria-label="add"]');
const input = document.querySelector('#url-input');
const form = document.querySelector('form');
btn.addEventListener('click', (e) => {
  e.preventDefault();
  whatchedUi.btnDisable = true;
  const { value } = input;
  schema.validate(value)
    .then(() => makeRequest(value))
    .then((response) => {
      const html = makeParse(response.data.contents);
      makeFeeds(html, value);
      makePosts(html, whatchedUi.feedsCounter);
      whatchedState.form.errors = 'noerror';
      whatchedState.feeds.push(value);
      form.reset();
      input.focus();
      whatchedUi.btnDisable = false;
      refreshPosts();
      console.log(whatchedState.feeds);
    })
    .catch((err) => {
      const error = err.message;
      whatchedState.form.errors = i18nIn.t(`errors.${error}`);
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

whatchedUi.language = 'ru';
