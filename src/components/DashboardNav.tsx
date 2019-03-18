import * as React from 'react';
import '../styles/App.scss';
import { connect } from 'react-redux';

import { Menu, Icon, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { AccountType } from '../types';
import Profile from '../containers/Profile';

interface IDashboardNavProps {
  firstName: string;
  accountType: AccountType;
}

interface IDashboardNavState {

}

class DashboardNavigation extends React.Component<IDashboardNavProps, IDashboardNavState> {

  public constructor(props) {
    super(props);
  }

  public render() {
    return (
      <Menu icon='labeled'>
        <Menu.Item className="middle-align">
          <Image src={require("../assets/carriage.svg")} size='tiny' />
        </Menu.Item>
        <Menu.Item as={Link} to={"/dashboard"} >
          <Icon name='car' />
          Rides
        </Menu.Item>
        <Menu.Item as={Link} to={"/dashboard/profile"}>
          <Icon name='user circle' />
          Profile
        </Menu.Item>
        <Menu.Menu position='right'>
          <Menu.Item className='middle-align'>
            <p>Logged in as <span style={{ fontWeight: "bold" }}>{this.props.firstName}</span></p>
          </Menu.Item>
          <Menu.Item as={Link} to={"/logout"}>
            <Icon name='log out' />
            Log out
          </Menu.Item>
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

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardNavigation);