import * as React from 'react';
import '../styles/App.scss';

import { Table, Icon, Tab, Segment, Message, StrictTableHeaderCellProps } from 'semantic-ui-react';
import { Ride } from '../types';
import { sortBy } from 'lodash';

const moment = require('moment');

interface IRideTableProps {
  rides: Ride[];
}

interface IRideTableState {
  data: Ride[]
  column: string;
  direction: StrictTableHeaderCellProps["sorted"];
}


class RideTable extends React.Component<IRideTableProps, IRideTableState> {

  public constructor(props) {
    super(props);
    this.state = {
      column: "",
      direction: undefined,
      data: this.props.rides
    };
    this.handleSort = this.handleSort.bind(this);
  }

  public componentDidUpdate(prevProps) {
    if (this.props.rides !== prevProps.rides) {
      this.setState({
        data: this.props.rides
      });
    }
  }

  public render(): JSX.Element {
    return (this.state.data.length > 0) ? (
      <Table celled sortable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell content="Pickup Time" name="pickupTime"
              onClick={this.handleSort} sorted={this.state.column === "pickupTime" ? this.state.direction : undefined} />
            <Table.HeaderCell content="Dropoff Time" name="dropoffTime"
              onClick={this.handleSort} sorted={this.state.column === "dropoffTime" ? this.state.direction : undefined} />
            <Table.HeaderCell content="Pickup Location" name="pickupLocationString"
              onClick={this.handleSort} sorted={this.state.column === "pickupLocationString" ? this.state.direction : undefined} />
            <Table.HeaderCell content="Dropoff Location" name="dropoffLocationString"
              onClick={this.handleSort} sorted={this.state.column === "dropoffLocationString" ? this.state.direction : undefined} />
            <Table.HeaderCell content="Rider" name="rider.name"
              onClick={this.handleSort} sorted={this.state.column === "rider.name" ? this.state.direction : undefined} />
            <Table.HeaderCell content="Driver" name="driver.name"
              onClick={this.handleSort} sorted={this.state.column === "driver.name" ? this.state.direction : undefined} />
            <Table.HeaderCell content="Status" name="status"
              onClick={this.handleSort} sorted={this.state.column === "status" ? this.state.direction : undefined} />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {
            this.state.data.map((ride) => {
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

  private handleSort(event) {
    const clickedColumn = event.target.getAttribute('name');
    if (this.state.column !== clickedColumn) {
      this.setState({
        column: clickedColumn,
        direction: 'ascending',
        data: sortBy(this.state.data, [clickedColumn, 'pickupLocationString'])
      });
    } else {
      this.setState({
        data: this.state.data.reverse(),
        direction: this.state.direction === 'ascending' ? 'descending' : 'ascending'
      })
    }
  }

}

export default RideTable;