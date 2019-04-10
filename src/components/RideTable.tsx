import * as React from 'react';
import '../styles/App.scss';

import { Table } from 'semantic-ui-react';
import { Ride } from '../types';

const moment = require('moment');

interface IRideTableProps {
  rides: Ride[];
}


class RideTable extends React.PureComponent<IRideTableProps> {

  public constructor(props) {
    super(props);
  }

  public render(): JSX.Element {
    return (this.props.rides.length > 0) ? (
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell content="Pickup Time" />
            <Table.HeaderCell content="Dropoff Time" />
            <Table.HeaderCell content="Pickup Location" />
            <Table.HeaderCell content="Dropoff Location" />
            <Table.HeaderCell content="Rider" />
            <Table.HeaderCell content="Driver" />
            <Table.HeaderCell content="Status" />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {
            this.props.rides.map((ride) => {
              return (
                <Table.Row key={"ride-" + ride.id}>
                  <Table.Cell collapsing content={moment(ride.pickupTime).format("h:mm a")} />
                  <Table.Cell collapsing content={moment(ride.dropoffTime).format("h:mm a")} />
                  <Table.Cell collapsing content={ride.pickupLocationString} />
                  <Table.Cell collapsing content={ride.dropoffLocationString} />
                  <Table.Cell collapsing content={(ride.rider) ? ride.rider.name : "No rider info"} />
                  <Table.Cell collapsing content={(ride.driver) ? ride.driver.name : "No driver info"} />
                  <Table.Cell collapsing content={ride.status} />
                </Table.Row>
              );
            })
          }
        </Table.Body>
      </Table>
    ) : (<div>
      No rides found.
    </div>)
  }

}

export default RideTable;