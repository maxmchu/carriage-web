import React, { Component } from 'react';
import './styles/App.scss';

import { BrowserRouter as Router, Route } from 'react-router-dom';
import Login from "./components/login";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <div>
            <Route exact path="/" component={Login} />
            <Route exact path="/login" component={Login} />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
