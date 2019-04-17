import * as React from 'react';
import '..styles/App.scss';

import { Button, Form, Header, Modal } from 'semantic-ui-react';

import { Moment } from 'moment';
import { connect } from 'react-redux';
import { handleUpdateRidesRequest } from '../redux/actions';
import { Ride } from '../types';
const moment = require('moment');

interface IRideTableEditProps {
  updateRides: (rides: Ride[]) => any;
  updatingRide: boolean;
  updatingRideErrMsg: string;
  ride: Ride;
}

interface IRideTableEditState {
  rideData: Ride
}

class RideTableEdit extends React.Component<IRideTableEditProps, IRideTableEditState> {

  public constructor(props) {
    super(props);
    this.state = {
      rideData: this.props.ride
    };
  }

  public render(): JSX.Element {
    return (
      <Modal>
        <Modal.Header content={`Editing ride details on ${moment(this.props.ride.pickupTime).format("MMMM Do, YYYY")}`} />
        <Modal.Content>
          <Form>
            <Header as="h3" content="Rider Information" />

            <Header as="h3" content="Driver Information" />

            <Header as="h3" content="Pickup" />
            <Form.Group>
              <Form.Input label="Pickup Time" type='time' name='pickupTime'
                value={this.state.rideData.pickupTime} />
              <Form.Input label="Pickup Location" readOnly
                value={this.props.ride.pickupLocationString} />
            </Form.Group>
            <Header as="h3" content="Dropoff" />
            <Form.Group>
              <Form.Input label="Dropoff Time" type='time' name='dropoffTime'
                value={this.state.rideData.dropoffTime} />
              <Form.Input label="Dropoff Location" readOnly
                value={this.props.ride.dropoffLocationString} />
            </Form.Group>
            `
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button />
        </Modal.Actions>
      </Modal>
    );
  }

}

function mapStateToProps(state) {
  const { updatingRide, updatingRideErrMsg } = state.dispatcherRides;
  return { updatingRide, updatingRideErrMsg };
}

function mapDispatchToProps(dispatch) {
  return {
    updateRides: (rides: Ride[]) => dispatch(handleUpdateRidesRequest(rides));
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RideTableEdit);
