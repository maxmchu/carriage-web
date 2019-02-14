import * as React from 'react';
import '../styles/App.scss';
import { connect } from 'react-redux';

import { Button, Card, Container, Header, Item } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import '../styles/containers/dashboard.scss';

import { AccountType } from '../types';
import DashboardNav from '../components/DashboardNav';
import { resetRequestRideForm } from '../redux/actions';
import UpcomingRides from '../components/UpcomingRides';

interface IDashboardProps {
  firstName: string;
  lastName: string;
  email: string;
  accountType: AccountType
  loggedIn: boolean;
  resetRideForm: () => any;
}

interface IDashboardState {

}

class Dashboard extends React.Component<IDashboardProps, IDashboardState> {

  public componentDidMount() {
    this.props.resetRideForm();
  }

  public render() {
    return (
      <div>
        <DashboardNav />
        <Container>
          <Header as={"h1"}>Upcoming Rides</Header>
          {
            (this.props.accountType == AccountType.RIDER) ?
              <Button basic
                color='blue'
                style={{ marginBottom: "10px" }}
                as={Link}
                to={"/dashboard/request"}>
                Request a ride
              </Button> : null
          }
          <UpcomingRides />
        </Container>
      </div>

    )
  }
}

function mapStateToProps(state) {
  const { firstName, lastName, email, accountType, loggedIn } = state.auth.user;
  return {
    "firstName": firstName,
    "lastName": lastName,
    "email": email,
    "accountType": accountType,
    "loggedIn": loggedIn
  };
}

function matchDispatchToProps(dispatch) {
  return {
    resetRideForm: () => dispatch(resetRequestRideForm())
  };
}

export default connect(mapStateToProps, matchDispatchToProps)(Dashboard);
