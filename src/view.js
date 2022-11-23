import i18nIn from './init';

const feedback = document.querySelector('.feedback');
const btn = document.querySelector('button');
const h1 = document.querySelector('h1');
const lead = document.querySelector('p[class="lead"]');
const label = document.querySelector('label');
const mt2 = document.querySelector('p[class="mt-2"]');

const render = () => (path, value) => {
  switch (path) {
    case 'form.errors':
      feedback.innerHTML = value;
      break;
    case 'form.language':
      i18nIn.changeLanguage(value).then(() => {
        btn.textContent = i18nIn.t('btn');
        h1.textContent = i18nIn.t('h1');
        lead.textContent = i18nIn.t('lead');
        label.textContent = i18nIn.t('label');
        mt2.textContent = `${i18nIn.t('mt2')} https://ru.hexlet.io/lessons.rss`;
      });
      break;
    default:
      break;
  }
};

export default render;
