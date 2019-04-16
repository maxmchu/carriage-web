import * as React from 'react';
import '../styles/App.scss';
import { connect } from 'react-redux';

import { Menu, Icon, Image, Responsive, Dropdown, DropdownItem } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { AccountType } from '../types';

interface IDashboardNavProps {
  firstName: string;
  accountType: AccountType;
}

interface IDashboardNavState {
  width: number;
}

class DashboardNavigation extends React.Component<IDashboardNavProps, IDashboardNavState> {

  public constructor(props) {
    super(props);
    this.state = {
      width: document.documentElement.clientWidth
    }
    this.updateWidth = this.updateWidth.bind(this);
  }

  public componentWillMount() {
    this.updateWidth();
  }

  public componentDidMount() {
    window.addEventListener("resize", this.updateWidth);
  }

  public componentWillUnmount() {
    window.removeEventListener("resize", this.updateWidth);
  }

  public render() {
    return (this.state.width >= 768) ?
      (
        <Responsive as={Menu} icon='labeled' minWidth={768}>
          <Menu.Item className="middle-align" as={Link} to={"/dashboard"}>
            <Image src={require("../assets/carriage.svg")} size='tiny' />
          </Menu.Item>
          {
            (this.props.accountType === AccountType.DISPATCHER) ?
              <Menu.Item as={Link} to={"/dashboard"} icon='dashboard' content='Dashboard' /> :
              <Menu.Item as={Link} to={"/dashboard"} icon='car' content='Rides' />
          }
          <Menu.Item as={Link} to={"/dashboard/profile"} icon='user circle' content='Profile' />
          {
            (this.props.accountType === AccountType.DRIVER) ?
              <Menu.Item as={Link} to={"/dashboard/hours"} icon='clock outline' content='Shift hours' /> :
              null
          }
          {
            (this.props.accountType === AccountType.DISPATCHER) ?
              <Menu.Item as={Link} to={"/dashboard/schedule"} icon='alternate calendar outline' content='Schedules' /> :
              null
          }
          {
            (this.props.accountType === AccountType.DISPATCHER) ?
              <Menu.Item as={Link} to={"/dashboard/requests"} icon='inbox' content='Requests' /> :
              null
          }
          <Menu.Menu position='right'>
            <Menu.Item className='middle-align'>
              <p>Logged in as <span style={{ fontWeight: "bold" }}>{this.props.firstName}</span></p>
            </Menu.Item>
            <Menu.Item as={Link} to={"/logout"} icon='log out' content='Log out' />
          </Menu.Menu>
        </Responsive>
      )
      : (
        <Responsive as={Menu} maxWidth={767}>
          <Menu.Item className="middle-align" as={Link} to={"/dashboard"}>
            <Image src={require("../assets/carriage.svg")} size='tiny' />
          </Menu.Item>
          <Menu.Menu position='right'>
            <Menu.Item className='middle-align'>
              <p>Logged in as <span style={{ fontWeight: "bold" }}>{this.props.firstName}</span></p>
            </Menu.Item>
            <Dropdown icon='bars' item>
              <Dropdown.Menu>
                {
                  (this.props.accountType === AccountType.DISPATCHER) ?
                    <Dropdown.Item as={Link} to={"/dashboard"} icon='dashboard' text='Dashboard' /> :
                    <Dropdown.Item as={Link} to={"/dashboard"} icon='car' text='Rides' />
                }
                <Dropdown.Item as={Link} to={"/dashboard/profile"} icon='user circle' text='Profile' />
                {
                  (this.props.accountType === AccountType.DRIVER) ?
                    <Dropdown.Item as={Link} to={"/dashboard/hours"} icon='clock outline' text='Shift hours' /> :
                    null
                }
                {
                  (this.props.accountType === AccountType.DISPATCHER) ?
                    <Dropdown.Item as={Link} to={"/dashboard/schedule"} icon="alternate calendar outline" content="Schedules" /> :
                    null
                }
                {
                  (this.props.accountType === AccountType.DISPATCHER) ?
                    <Dropdown.Item as={Link} to={"/dashboard/requests"} icon="inbox" content="Requests" /> :
                    null
                }
                <Dropdown.Item as={Link} to={"/logout"} icon='log out' text='Log out' />
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Menu>
        </Responsive>
      )
  }

  private updateWidth() {
    this.setState({
      width: document.documentElement.clientWidth
    });
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