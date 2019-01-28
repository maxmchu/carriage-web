import React, { Component } from 'react';
import './styles/App.scss';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import ConditionalRoute from "./components/ConditionalRoute";
import Login from "./components/login";
import Dashboard from "./components/dashboard";
import Welcome from "./components/welcome";
import { handleCheckUserLoggedInRequest } from './redux/actions';

interface IAppProps {
  checkingLogin: boolean;
  loggedIn: boolean;
  user: any;
  checkLoggedIn: () => any;
}
interface IAppState {
}

class App extends Component<IAppProps, IAppState> {

  public constructor(props: IAppProps) {
    super(props);
  }

  public componentWillMount() {
    this.props.checkLoggedIn();
  }

  public render() {
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route exact path="/" component={Welcome} />
            <ConditionalRoute exact 
              path="/login" 
              component={Login} 
              routeCondition={!this.props.loggedIn}
              redirectTo="/dashboard" />
            <ConditionalRoute exact
              path="/dashboard"
              component={Dashboard}
              routeCondition={this.props.loggedIn}
              redirectTo="/login" />
          </Switch>
        </Router>
      </div>
    );
  }
}

function mapStateToProps(state: any) {
  const { checkingLogin, loggedIn, user } = state.auth;
  return {
    checkingLogin: checkingLogin,
    loggedIn: loggedIn,
    user: user
  };
}

function matchDispatchToProps(dispatch: any) {
  return {
    checkLoggedIn: () => dispatch(handleCheckUserLoggedInRequest())
  };
}

export default connect(mapStateToProps, matchDispatchToProps)(App);
