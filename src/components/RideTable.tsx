import * as React from 'react';
import '../styles/App.scss';

import { Table, Icon, Tab, Segment, Message } from 'semantic-ui-react';
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
      <Table celled>
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
                  {
                    (ride.rider) ?
                      <Table.Cell collapsing>
                        {ride.rider.name} (<Icon name='phone' /> {ride.rider.phone})
                      </Table.Cell> :
                      <Table.Cell collapsing content="No rider info" />
                  }
                  {
                    (ride.driver) ?
                      <Table.Cell collapsing>
                        {ride.driver.name} (<Icon name='phone' /> {ride.driver.phone})
                      </Table.Cell> :
                      <Table.Cell collapsing content="No driver info" />
                  }
                  <Table.Cell collapsing content={ride.status} />
                </Table.Row>
              );
            })
          }
        </Table.Body>
      </Table>
    ) : (
        <Message warning>
          <Message.Header content="No rides were found." />
        </Message>
      )
  }

}

export default RideTable;