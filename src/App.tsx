import React from 'react';
import './styles/App.scss';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import ConditionalRoute from "./components/ConditionalRoute";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Welcome from "./components/Welcome";
import RequestForm from "./components/RequestForm";
import { handleCheckUserLoggedInRequest } from './redux/actions';
import Register from './components/Register';
import { AccountType } from './types';
import Logout from './components/Logout';

interface IAppProps {
  checkingLogin: boolean;
  loggedIn: boolean;
  user: any;
  checkLoggedIn: () => any;
}
interface IAppState {
}

class App extends React.Component<IAppProps, IAppState> {

  public constructor(props: IAppProps) {
    super(props);
  }

  public componentDidMount() {
    this.props.checkLoggedIn().then(() => { return; });
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
              redirectTo="/dashboard"
              componentProps={{ "checkingLogin": this.props.checkingLogin }}
            />
            <ConditionalRoute exact
              path="/register"
              component={Register}
              routeCondition={!this.props.loggedIn}
              redirectTo="/dashboard"
            />
            <ConditionalRoute exact
              path="/dashboard"
              component={Dashboard}
              routeCondition={this.props.loggedIn}
              redirectTo="/login" />
            <Route exact path="/logout" component={Logout} />
            <ConditionalRoute exact
              path={`/dashboard/request`}
              component={RequestForm}
              routeCondition={this.props.user && this.props.loggedIn && this.props.user.accountType == AccountType.RIDER}
              redirectTo={"/dashboard"} />
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
