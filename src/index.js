/* eslint-disable object-curly-newline */
import './styles.scss';
import 'bootstrap';
import * as yup from 'yup';
import onChange from 'on-change';
import _ from 'lodash';
import axios from 'axios';
import i18nIn from './init.js';
import { render, feedsRender } from './view.js';

console.log('HELLO');

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
  postsCounter: 0,
};

const feeds = onChange(feedsState, feedsRender());
const state = onChange(initialState, render());

const makeParse = (data) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'text/xml');
  const errorNode = doc.querySelector('parsererror');
  return errorNode ? 'error' : doc;
};

const makeRSS = (html, url) => {
  if (html !== 'error') {
    console.log(html);
    state.form.errors = 'noerror';
    state.form.valid = true;
    state.feeds.push(url);
    const feedId = _.uniqueId();
    const titleElement = html.querySelector('channel > title');
    const title = titleElement.textContent;
    const descriptionElement = html.querySelector('channel > description');
    const description = descriptionElement.textContent;
    feeds.feedsTitles.push({ feedId, title, description });
    console.log(feeds.feedsTitles);
    const items = [...html.querySelectorAll('item')];
    const posts = items.map((item) => {
      const postTitleElement = item.querySelector('title');
      const postTitle = postTitleElement.textContent;
      const postLinkElement = item.querySelector('link');
      const postLink = postLinkElement.textContent;
      feeds.postsCounter += 1;
      const postId = feeds.postsCounter;
      return { feedId, postTitle, postLink, postId };
    });
    feeds.feedsPosts.push(...posts);
    console.log(feeds.feedsPosts);
  } else {
    state.form.errors = i18nIn.t('errors.ParsingError');
  }
};

const schema = yup.string().required().url('Incorrecturl').notOneOf(state.feeds, 'Linkalreadyadded');
const makeRequest = (url) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${url}`)
  .catch(() => {
    state.form.errors = i18nIn.t('errors.NetworkError');
    throw Error('Networkerror');
  });

const btn = document.querySelector('button');
const input = document.querySelector('#url-input');
const form = document.querySelector('form');
btn.addEventListener('click', (e) => {
  e.preventDefault();
  state.form.btnDisable = true;
  const { value } = input;
  schema.validate(value)
    .then(() => makeRequest(value))
    .then((response) => {
      console.log(response.data.contents);
      const html = makeParse(response.data.contents);
      makeRSS(html, value);
      form.reset();
      input.focus();
      state.form.btnDisable = false;
      console.log(state.feeds);
    })
    .catch((err) => {
      console.log(err.message);
      const error = err.message;
      state.form.errors = i18nIn.t(`errors.${error}`);
      state.form.valid = false;
      state.form.btnDisable = false;
    });
});

state.language = 'ru';
