import * as React from 'react';
import '../styles/App.scss';

import { Button, Form, Header, Icon, Modal, Item, Message, DropdownItemProps } from 'semantic-ui-react';

import { connect } from 'react-redux';
import { handleUpdateRidesRequest, clearUpdateSubmit, handleFetchAllDriversRequest } from '../redux/actions';
import { Ride, RideStatus, UserProfile } from '../types';
const moment = require('moment');

interface IRideTableEditProps {
  updateRides: (rides: Ride[]) => any;
  clearUpdateSubmit: () => any;
  fetchAllDrivers: () => any;
  updatingRide: boolean;
  updatingRideErrMsg: string;
  updateSubmitted: boolean;
  ride: Ride | null;
  open: any;
  onClose: any;
  fetchingAllDrivers: boolean;
  allDrivers: UserProfile[];
  fetchingAllDriversErrMsg: string;
}

interface IRideTableEditState {
  rideData: Ride | null,
  pickupTime?: any;
  dropoffTime?: any;
  rideStatus?: RideStatus;
  selectedDriver?: string;
  driverMap?: any;
  driverDropdownOptions?: DropdownItemProps[];
}

class RideTableEdit extends React.Component<IRideTableEditProps, IRideTableEditState> {

  private rideStatuses: DropdownItemProps[] = [
    {
      text: "Pending",
      value: RideStatus.PENDING,
      icon: "question circle outline"
    },
    {
      text: "Confirmed",
      value: RideStatus.CONFIRMED,
      icon: "check circle outline"
    },
    {
      text: "Rejected",
      value: RideStatus.REJECTED,
      icon: "times circle outline"
    }
  ];

  public constructor(props) {
    super(props);

    if (this.props.ride !== null) {
      this.state = {
        rideData: this.props.ride,
        pickupTime: this.props.ride.pickupTime.split(" ")[1],
        dropoffTime: this.props.ride.dropoffTime.split(" ")[1],
        rideStatus: this.props.ride.rideStatus,
        selectedDriver: this.props.ride.driverEmail,
        driverMap: this.driverListToMap(this.props.allDrivers),
        driverDropdownOptions: this.driverListToOptions(this.props.allDrivers)
      };
    } else {
      this.state = {
        rideData: this.props.ride
      }
    }
    this.onTimeChange = this.onTimeChange.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
    this.onStatusChange = this.onStatusChange.bind(this);
    this.onDriverChange = this.onDriverChange.bind(this);
    this.onClose = this.onClose.bind(this);
    this.driverListToMap = this.driverListToMap.bind(this);
    this.driverListToOptions = this.driverListToOptions.bind(this);
  }

  public componentWillMount() {
    this.props.fetchAllDrivers();
  }

  public componentDidUpdate(prevProps) {
    if (this.props.ride !== prevProps.ride) {
      if (this.props.ride !== null) {
        this.setState({
          rideData: this.props.ride,
          pickupTime: this.props.ride.pickupTime.split(" ")[1],
          dropoffTime: this.props.ride.dropoffTime.split(" ")[1],
          rideStatus: this.props.ride.rideStatus,
          selectedDriver: this.props.ride.driverEmail
        });
      } else {
        this.setState({
          rideData: this.props.ride
        });
      }
    }
    if (this.props.allDrivers !== prevProps.allDrivers) {
      this.setState({
        driverMap: this.driverListToMap(this.props.allDrivers),
        driverDropdownOptions: this.driverListToOptions(this.props.allDrivers)
      });
    }
  }

  public render(): JSX.Element {
    if (this.props.ride === null || this.state.rideData === null) {
      return (
        <Modal open={this.props.open} onClose={this.onClose}>
          <Modal.Header content="No ride selected." />
          <Modal.Content content="No ride was selected, cannot fetch details!" />
          <Modal.Actions>
            <Button basic content="Close" onClick={this.onClose} />
          </Modal.Actions>
        </Modal>
      );
    }
    return (
      <Modal open={this.props.open} onClose={this.onClose}>
        <Modal.Header content={`Editing ride details on ${moment(this.props.ride.pickupTime).format("MMMM Do, YYYY")}`} />
        <Modal.Content>
          <Form loading={this.props.updatingRide}>
            <Header as="h3" content="Rider Information" />
            {
              (this.props.ride.rider) ?
                <div>
                  <p>{this.props.ride.rider.name}</p>
                  <Icon name="phone" color="green" /> {this.props.ride.rider.phone}
                </div> :
                <Message negative>
                  No rider information!
                </Message>
            }
            <Header as="h3" content="Driver Information" />
            <Form.Group>
              <Form.Dropdown search selection clearable
                options={this.state.driverDropdownOptions} name="selectedDriver"
                value={this.state.selectedDriver} onChange={this.onDriverChange} />
            </Form.Group>
            <Header as="h3" content="Pickup" />
            <Form.Group>
              <Form.Input label="Pickup Time" type='time' name='pickupTime'
                value={this.state.pickupTime}
                onChange={this.onTimeChange} />
              <Form.Input label="Pickup Location" readOnly
                value={this.props.ride.pickupLocationString} />
            </Form.Group>
            <Header as="h3" content="Dropoff" />
            <Form.Group>
              <Form.Input label="Dropoff Time" type='time' name='dropoffTime'
                value={this.state.dropoffTime}
                onChange={this.onTimeChange} />
              <Form.Input label="Dropoff Location" readOnly
                value={this.props.ride.dropoffLocationString} />
            </Form.Group>
            <Header as="h3" content="Ride Status" />
            <Form.Group>
              <Form.Dropdown options={this.rideStatuses} selection
                value={this.state.rideStatus} onChange={this.onStatusChange} />
            </Form.Group>
          </Form>
          {
            (this.props.updateSubmitted) ?
              <Message positive>
                <Message.Header content="Ride updated successfully!" />
                <Message.Content content="You can close this box safely now." />
              </Message> : null
          }
          {
            (this.props.updatingRideErrMsg !== "") ?
              <Message negative>
                <Message.Header content="An error occurred!" />
                <Message.Content content={this.props.updatingRideErrMsg} />
              </Message> : null
          }
        </Modal.Content>
        <Modal.Actions>
          <Button basic content="Close" onClick={this.onClose} />
          <Button basic content="Save Changes" color="green" onClick={this.saveChanges} />
        </Modal.Actions>
      </Modal>
    );
  }

  private onTimeChange(event) {
    this.setState({
      ...this.state,
      [event.target.name]: event.target.value
    });
  }

  private onDriverChange(event, data) {
    this.setState({
      selectedDriver: data.value
    });
  }

  private onStatusChange(event, statusData) {
    this.setState({
      rideStatus: statusData.value
    })
  }

  private onClose(event) {
    this.props.clearUpdateSubmit();
    this.props.onClose();
  }

  private saveChanges(event) {
    if (this.state.rideData !== null && this.props.ride !== null && this.state.rideStatus !== undefined) {
      const ride = this.state.rideData;
      ride.dropoffTime = this.props.ride.dropoffTime.split(" ")[0] + " " + this.state.dropoffTime
      ride.pickupTime = this.props.ride.pickupTime.split(" ")[0] + " " + this.state.pickupTime
      ride.rideStatus = this.state.rideStatus;
      ride.driverEmail = this.state.selectedDriver;
      this.props.updateRides([ride]);
    } else {
      return;
    }
  }

  private driverListToMap(drivers: UserProfile[]) {
    const map = {};
    drivers.forEach((driver) => {
      map[driver.email] = driver
    });
    return map;
  }

  private driverListToOptions(drivers: UserProfile[]) {
    return drivers.map((driver) => ({
      text: `${driver.firstName} ${driver.lastName} (${driver.phone})`,
      value: driver.email
    }));
  }

}

function mapStateToProps(state) {
  const { updatingRide, updatingRideErrMsg, updateSubmitted } = state.dispatcherRides;
  const { fetchingAllDrivers, allDrivers, fetchingAllDriversErrMsg } = state.profile;

  return {
    updatingRide, updatingRideErrMsg, updateSubmitted,
    fetchingAllDrivers, fetchingAllDriversErrMsg, allDrivers
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateRides: (rides: Ride[]) => dispatch(handleUpdateRidesRequest(rides)),
    clearUpdateSubmit: () => dispatch(clearUpdateSubmit()),
    fetchAllDrivers: () => dispatch(handleFetchAllDriversRequest())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RideTableEdit);
