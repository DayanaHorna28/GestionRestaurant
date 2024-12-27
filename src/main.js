import './app.css';
import '../src/lib/styles/app.css';

import App from './App.svelte';

let app;

  app = new App({ target: document.getElementById('app') });



export default app
