import * as React from 'react';
import '../styles/App.scss';
import { connect } from 'react-redux';

import { Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { AccountType } from '../types';

interface IDashboardNavProps {
  firstName: string;
  accountType: AccountType;
}

interface IDashboardStateProps {

}

class DashboardNavigation extends React.Component<IDashboardNavProps, IDashboardStateProps> {

  public render() {
    return (
      <Menu size='huge'>
        <Menu.Item>
          <Link to={"/dashboard"}>CULift</Link>
        </Menu.Item>
        <Menu.Menu position='right'>
          <Menu.Item>
            <p>Logged in as <span style={{ fontWeight: "bold" }}>{this.props.firstName}</span></p>
          </Menu.Item>
          <Menu.Item>Log off</Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }

}

function mapStateToProps(state) {
  const { firstName, accountType } = state.auth.user;
  return {
    "firstName": firstName,
    "accountType": accountType
  };
}

function matchDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, matchDispatchToProps)(DashboardNavigation);