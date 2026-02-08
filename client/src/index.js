import './global.css';
import app from './app';

const appEl = app();
const rootEl = document.querySelector('.root');
rootEl.appendChild(appEl);
