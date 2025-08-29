import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import Project from './pages/Project';
import Admin from './pages/Admin';
import WalletConnect from './components/WalletConnect';
import './styles/App.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <WalletConnect />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/project" component={Project} />
          <Route path="/admin" component={Admin} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;