import React, { Component } from 'react';
import './styles/App.scss';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from "./components/login";
import Dashboard from "./components/dashboard";
import Welcome from "./components/welcome";
import axios from 'axios';

interface IAppProps {

}
interface IAppState {
  loggedIn: boolean;
  user: any;
}

class App extends Component<IAppProps, IAppState> {

  public constructor(props: IAppProps) {
    super(props);
    this.state = {
      loggedIn: false,
      user: null
    }
  }

  public componentWillMount() {
    console.log("did mount");
    axios.get('/auth/user').then(response => {
      console.log(response.data);
      if (!!response.data.user) {
        console.log('THERE IS A USER')
        this.setState({
          loggedIn: true,
          user: response.data.user
        })
      } else {
        console.log('No user detected')
        this.setState({
          loggedIn: false,
          user: null
        })
      }
    })
  }

  public render() {
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route exact path="/" component={Welcome} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/dashboard" component={Dashboard} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
