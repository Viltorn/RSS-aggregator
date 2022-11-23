import i18n from 'i18next';
import ru from './locales/ru.js';

const i18nIn = i18n.createInstance();
i18nIn.init({
  lng: 'ru',
  debug: false,
  resources: { ru },
});

export default i18nIn;
