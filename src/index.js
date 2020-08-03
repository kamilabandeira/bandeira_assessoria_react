import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import App from './App';
import Navbar from './components/Navbar'

ReactDOM.render(
  <React.StrictMode>
    <Navbar />
    <App />
    
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();
