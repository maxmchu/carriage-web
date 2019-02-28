import * as React from 'react';
import '../styles/App.scss';
import { connect } from 'react-redux';
import { Header, Icon, Loader, Segment, Table } from 'semantic-ui-react';

import { Ride, AccountType } from '../types';
import { handleFetchPastRidesRequest } from '../redux/actions';

const moment = require('moment');

interface IPastRidesProps {
  userEmail: string;
  accountType: AccountType;
  fetchPastRides: (userEmail, accountType) => any;
  pastRides: Ride[];
  fetchingPastRides: boolean;
}

class PastRides extends React.PureComponent<IPastRidesProps> {

  public constructor(props) {
    super(props);
    this.renderTable = this.renderTable.bind(this);
  }

  public componentDidMount() {
    this.props.fetchPastRides(this.props.userEmail, this.props.accountType);
  }

  public render() {
    return (
      (this.props.fetchingPastRides) ?
        <Loader active inline="centered">Loading past rides</Loader> :
        this.renderTable()
    );
  }

  private renderTable() {
    return (this.props.pastRides.length > 0) ?
      <Table celled padded striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Date</Table.HeaderCell>
            <Table.HeaderCell>Time</Table.HeaderCell>
            <Table.HeaderCell>Locations</Table.HeaderCell>
            {/* <Table.HeaderCell>Details</Table.HeaderCell> */}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {
            this.props.pastRides.map((ride) => {
              return (
                <Table.Row key={"past-ride-" + ride.id}>
                  <Table.Cell collapsing>
                    {moment(ride.pickupTime.split(" ")[0]).format("MMMM Do, YYYY")}
                  </Table.Cell>
                  <Table.Cell collapsing>
                    {moment(ride.pickupTime).format("h:mm a")}
                    <Icon name='arrow right' />
                    {moment(ride.dropoffTime).format("h:mm a")}
                  </Table.Cell>
                  <Table.Cell>
                    {ride.pickupLocationString}
                    <Icon name='arrow right' />
                    {ride.dropoffLocationString}
                  </Table.Cell>
                  {/* <Table.Cell collapsing></Table.Cell> */}
                </Table.Row>
              )
            })
          }
        </Table.Body>
      </Table> :
      <Segment placeholder>
        <Header icon>
          <Icon name='circle outline' />
          You have no past rides.
          </Header>
      </Segment>
  }

}

function mapStateToProps(state) {
  const { email, accountType } = state.auth.user;
  const { pastRides, fetchingPastRides } = state.rides;
  return {
    "userEmail": email,
    accountType,
    pastRides,
    fetchingPastRides
  };
}

function matchDispatchToProps(dispatch) {
  return {
    fetchPastRides: (userEmail, accountType) =>
      dispatch(handleFetchPastRidesRequest({ userEmail, accountType }))
  };
}

export default connect(mapStateToProps, matchDispatchToProps)(PastRides);
