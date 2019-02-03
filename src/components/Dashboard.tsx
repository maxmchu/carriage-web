import * as React from 'react';
import '../styles/App.scss';
import { connect } from 'react-redux';

import { Button, Container, Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { AccountType } from '../types';
import DashboardNav from './DashboardNav';

interface IDashboardProps {
  firstName: string;
  lastName: string;
  email: string;
  accountType: AccountType
}

interface IDashboardState {

}

class Dashboard extends React.Component<IDashboardProps, IDashboardState> {

  public render() {
    return (
      <div>
        <DashboardNav />
        <Container>
          <Header as={"h1"}>Upcoming Rides</Header>
          {
            (this.props.accountType == AccountType.RIDER) ?
              <Button basic color='blue' style={{ marginBottom: "10px" }}>Request a ride</Button> : null
          }
          <p>You have PLACEHOLDER upcoming rides.</p>
        </Container>
      </div>

    )
  }
}

function mapStateToProps(state) {
  const { firstName, lastName, email, accountType } = state.auth.user;
  return {
    "firstName": firstName,
    "lastName": lastName,
    "email": email,
    "accountType": accountType
  };
}

function matchDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, matchDispatchToProps)(Dashboard);
