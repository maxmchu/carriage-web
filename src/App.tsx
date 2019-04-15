import React from 'react';
import './styles/App.scss';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import ConditionalRoute from "./components/ConditionalRoute";
import Login from "./containers/Login";
import Dashboard from "./containers/Dashboard";
import Welcome from "./containers/Welcome";
import RequestForm from "./containers/RequestForm";
import { handleCheckUserLoggedInRequest } from './redux/actions';
import Register from './containers/Register';
import { AccountType } from './types';
import Logout from './containers/Logout';
import Profile from './containers/Profile';
import Hours from './containers/Hours';
import Schedule from './components/Schedule';

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
              routeCondition={this.props.user && this.props.user.accountType === AccountType.RIDER}
              redirectTo={"/dashboard"} />
            <ConditionalRoute exact
              path={`/dashboard/profile`}
              component={Profile}
              routeCondition={this.props.user}
              redirectTo={"/dashboard"} />
            <ConditionalRoute exact
              path={'/dashboard/hours'}
              component={Hours}
              routeCondition={this.props.user && this.props.user.accountType === AccountType.DRIVER}
              redirectTo={"/dashboard"} />
            <ConditionalRoute exact
              path={'/dashboard/schedule'}
              component={Schedule}
              routeCondition={this.props.user && this.props.user.accountType === AccountType.DISPATCHER}
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
    checkingLogin,
    loggedIn,
    user
  };
}

function mapDispatchToProps(dispatch: any) {
  return {
    checkLoggedIn: () => dispatch(handleCheckUserLoggedInRequest())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
