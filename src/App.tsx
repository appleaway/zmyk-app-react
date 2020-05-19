import React from 'react';
import './App.css';

import routes from "./router/index"
import RouterView from './components/RouterView/RouterView';

function App() {
  return (
    <RouterView routes={routes} from="/" to="/home" />
  );
}

export default App;
