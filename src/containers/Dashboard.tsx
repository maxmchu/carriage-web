import * as React from 'react';
import '../styles/App.scss';
import { connect } from 'react-redux';

import { Button, Card, Container, Header, Item } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import '../styles/containers/dashboard.scss';

import { AccountType } from '../types';
import DashboardNav from '../components/DashboardNav';

interface IDashboardProps {
  firstName: string;
  lastName: string;
  email: string;
  accountType: AccountType
  loggedIn: boolean;
  match: any
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
              <Button basic
                color='blue'
                style={{ marginBottom: "10px" }}
                as={Link}
                to={"/dashboard/request"}>
                Request a ride
              </Button> : null
          }
          <p>You have PLACEHOLDER upcoming rides.</p>
          <div className="dashboard-rides-container">
            <Card>
              <Card.Content>
                <Card.Header content={"February 2nd, 2019"} />
                <Card.Meta content={"Pending"} />
              </Card.Content>
              <Card.Content>
                <Card.Header content={"8:45 am pickup"} />
                <Card.Description content={"108 Eddy St"} />
              </Card.Content>
              <Card.Content>
                <Card.Header content={"9:00 am dropoff"} />
                <Card.Description content={"Gates Hall"} />
              </Card.Content>
              <Card.Content>
                <Card.Header>Your Driver</Card.Header>
                <Card.Description>
                  <Item.Group>
                    <Item>
                      <Item.Content verticalAlign='middle'>
                        <Item.Header>John Doe</Item.Header>
                        <Item.Description>(607) 555-5555</Item.Description>
                      </Item.Content>
                    </Item>
                  </Item.Group>
                </Card.Description>
              </Card.Content>
            </Card>
          </div>
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
  return {};
}

export default connect(mapStateToProps, matchDispatchToProps)(Dashboard);
