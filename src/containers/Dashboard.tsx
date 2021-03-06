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
import PastRides from '../components/PastRides';
import ServiceOverview from '../components/ServiceOverview';

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
    this.renderRider = this.renderRider.bind(this);
    this.renderDriver = this.renderDriver.bind(this);
    this.renderDispatcher = this.renderDispatcher.bind(this);
  }

  public render() {

    switch (this.props.accountType) {
      case AccountType.RIDER:
        return this.renderRider();
      case AccountType.DRIVER:
        return this.renderDriver();
      case AccountType.DISPATCHER:
        return this.renderDispatcher();
    }

  }

  private renderRider(): JSX.Element {
    return (
      <div>
        <DashboardNav />
        <Container>
          <Header as={"h1"}>Upcoming Rides</Header>
          <Button basic
            color='blue'
            style={{ marginBottom: "10px" }}
            as={Link}
            to={"/dashboard/request"}
            content='Request a ride' />
          <UpcomingRides />
          <Header as={"h1"}>Past Rides</Header>
          <PastRides />
        </Container>
      </div>
    )
  }

  private renderDriver(): JSX.Element {
    return (
      <div>
        <DashboardNav />
        <Container>
          <Header as={"h1"}>Upcoming Rides</Header>
          <UpcomingRides />
          <Header as={"h1"}>Past Rides</Header>
          <PastRides />
        </Container>
      </div>
    );
  }

  private renderDispatcher(): JSX.Element {
    return (
      <div>
        <DashboardNav />
        <Container>
          <ServiceOverview />
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

function mapDispatchToProps(dispatch) {
  return {
    resetRideForm: () => dispatch(resetRequestRideForm())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
