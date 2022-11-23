import './styles.scss';
import 'bootstrap';
import * as yup from 'yup';
import onChange from 'on-change';
import i18nIn from './init.js';
import render from './view.js';

console.log('HELLO');

const initialState = {
  form: {
    valid: true,
    errors: '',
    url: '',
  },
  feeds: [],
  language: '',
};

const state = onChange(initialState, render());

const schema = yup.string().required().url('Incorrecturl').notOneOf(state.feeds, 'Linkalreadyadded');

const btn = document.querySelector('button');
const input = document.querySelector('#url-input');
const form = document.querySelector('form');
btn.addEventListener('click', (e) => {
  e.preventDefault();
  const { value } = input;
  schema.validate(value)
    .then(() => {
      state.form.errors = '';
      state.form.valid = true;
      state.feeds.push(value);
      form.reset();
      input.focus();
      console.log(state.feeds);
    })
    .catch((err) => {
      console.log(err.message);
      const error = err.message;
      state.form.errors = i18nIn.t(`errors.${error}`);
      state.form.valid = false;
    });
});

state.language = 'ru';
