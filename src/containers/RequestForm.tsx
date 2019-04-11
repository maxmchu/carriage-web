import * as React from 'react';
import '../styles/App.scss';
import '../styles/components/requestForm.scss';
import { connect } from 'react-redux';

import { Button, Container, Divider, Form, Header, Grid, Message, Search } from 'semantic-ui-react';
import { Moment } from 'moment';
const moment = require('moment');
import { SingleDatePicker } from 'react-dates';

import DashboardNav from '../components/DashboardNav';
import { Link } from 'react-router-dom';
import { handleFetchLocationsRequest, handleRequestRideRequest } from '../redux/actions';
import { RideLocation, RideRequest } from '../types';

import { capitalize, debounce, escapeRegExp, filter, findIndex } from 'lodash';


interface IRequestFormProps {
  fetchLocations: () => any;
  submitRequest: (request: RideRequest) => any;
  locations: any[];
  user: any;
  rideSubmitted: boolean;
  requestingRide: boolean;
  rideSubmitErrMsg: string;
}

interface IRequestFormState {
  date: Moment;
  focused: boolean;
  pickupTime: any;
  dropoffTime: any;
  pickupLocationString: string;
  dropoffLocationString: string;
  pickupLocationSuggestions: RideLocation[];
  dropoffLocationSuggestions: RideLocation[];
  loadingPickup: boolean;
  loadingDropoff: boolean;
  pickupLocationId: number;
  dropoffLocationId: number;
  needsWheelchair: boolean;
  needsExtraSpace: boolean;
  submitEnabled: boolean;
}

class RequestForm extends React.Component<IRequestFormProps, IRequestFormState> {

  public constructor(props) {
    super(props);
    this.state = {
      date: moment().endOf("day").add(1, "days"),
      focused: false,
      pickupTime: "08:00",
      dropoffTime: "08:30",
      pickupLocationString: "",
      dropoffLocationString: "",
      pickupLocationSuggestions: [],
      dropoffLocationSuggestions: [],
      loadingPickup: false,
      loadingDropoff: false,
      pickupLocationId: -1,
      dropoffLocationId: -1,
      needsWheelchair: false,
      needsExtraSpace: false,
      submitEnabled: false
    };
    this.onDateChange = this.onDateChange.bind(this);
    this.onFocusChange = this.onFocusChange.bind(this);
    this.onTimeChange = this.onTimeChange.bind(this);
    this.onWheelchairChange = this.onWheelchairChange.bind(this);
    this.onExtraSpaceChange = this.onExtraSpaceChange.bind(this);
    this.resetPickupComponent = this.resetPickupComponent.bind(this);
    this.handlePickupResultSelect = this.handlePickupResultSelect.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.resetDropoffComponent = this.resetDropoffComponent.bind(this);
    this.handleDropoffResultSelect = this.handleDropoffResultSelect.bind(this);
    this.isReadyToSubmit = this.isReadyToSubmit.bind(this);
    this.handleRideSubmit = this.handleRideSubmit.bind(this);
  }

  public componentDidMount() {
    this.props.fetchLocations();
  }

  public render() {
    return (
      (this.props.rideSubmitted && this.props.rideSubmitErrMsg === "") ?
        <div>
          <DashboardNav />
          <Container>
            <Header as={"h1"}>Request a Ride</Header>
            <Divider />
            <Message positive>
              <Message.Header>Ride request submitted successfully!</Message.Header>
              Requests must be approved by our dispatchers. You can return to the dashboard now.
            </Message>
            <Button basic color='blue' as={Link} to={"/dashboard"}>Return to Dashboard</Button>
          </Container>
        </div>
        :
        <div>
          <DashboardNav />
          <Container>
            <Header as={"h1"}>Request a Ride</Header>
            <Divider />
            {
              (this.props.rideSubmitErrMsg === "") ? null :
                <Message negative>
                  <Message.Header>An error occurred with your request!</Message.Header>
                  Please try submitting again.
              </Message>
            }
            <Form>
              <Header as={"h2"}>Ride Details</Header>
              <Form.Field>
                <h3>Date</h3>
                <SingleDatePicker
                  date={this.state.date}
                  onDateChange={this.onDateChange}
                  focused={this.state.focused}
                  onFocusChange={this.onFocusChange}
                  id="datepicker"
                  noBorder={true}
                  numberOfMonths={1}
                />
              </Form.Field>

              <Header as={"h3"}>Pickup</Header>
              <Form.Group>
                <Form.Input
                  label='Time'
                  type='time'
                  name='pickupTime'
                  value={this.state.pickupTime}
                  onChange={this.onTimeChange}
                />
                <Form.Field>
                  <label>Pickup Location</label>
                  <Search
                    loading={this.state.loadingPickup}
                    onResultSelect={this.handlePickupResultSelect}
                    onSearchChange={debounce(this.handleSearchChange, 200, { leading: true })}
                    results={this.state.pickupLocationSuggestions}
                    value={this.state.pickupLocationString}
                    name="pickupLocationString"
                  />
                </Form.Field>
              </Form.Group>


              <Header as={"h3"}>Dropoff</Header>
              <Form.Group>
                <Form.Input
                  label='Time'
                  type='time'
                  name='dropoffTime'
                  value={this.state.dropoffTime}
                  onChange={this.onTimeChange}
                />
                <Form.Field>
                  <label>Dropoff Location</label>
                  <Search
                    loading={this.state.loadingDropoff}
                    onResultSelect={this.handleDropoffResultSelect}
                    onSearchChange={debounce(this.handleSearchChange, 200, { leading: true })}
                    results={this.state.dropoffLocationSuggestions}
                    value={this.state.dropoffLocationString}
                    name="dropoffLocationString"
                  />
                </Form.Field>
              </Form.Group>

              <Header as={"h3"} content="Additional Options" />
              <Form.Group>
                <Form.Checkbox
                  label='Check this box if you are a wheelchair user.'
                  checked={this.state.needsWheelchair}
                  onChange={this.onWheelchairChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Checkbox
                  label='Check this box if you need extra space (for example, if you have a leg injury and must use an additional seat to keep your leg straight).'
                  checked={this.state.needsExtraSpace}
                  onChange={this.onExtraSpaceChange}
                />
              </Form.Group>
              <Divider hidden />
              <Form.Group>
                <Button basic color='blue' as={Link} to={"/dashboard"}>Cancel Ride Request</Button>
                <Button basic color='green'
                  disabled={!this.state.submitEnabled}
                  onClick={this.handleRideSubmit}
                  content="Submit Ride Request" />
              </Form.Group>
            </Form>
          </Container>
        </div>
    )
  }

  private onDateChange(date) {
    this.setState({
      date,
      submitEnabled: this.isReadyToSubmit()
    });
  }

  private onFocusChange(focused) {
    this.setState(focused);
  }

  private onTimeChange(event) {
    this.setState({
      ...this.state,
      [event.target.name]: event.target.value,
      submitEnabled: this.isReadyToSubmit()
    })
  }

  private onWheelchairChange(e) {
    this.setState({
      needsWheelchair: !this.state.needsWheelchair,
    });
  }

  private onExtraSpaceChange(e) {
    this.setState({
      needsExtraSpace: !this.state.needsExtraSpace
    });
  }

  private resetPickupComponent() {
    this.setState({
      loadingPickup: false,
      pickupLocationSuggestions: [],
      pickupLocationString: '',
      pickupLocationId: -1,
      submitEnabled: this.isReadyToSubmit()
    });
  }

  private handlePickupResultSelect(e, { result }) {
    this.setState({
      pickupLocationId: result.id,
      pickupLocationString: result.title,
      submitEnabled: this.isReadyToSubmit()
    });
  }

  private resetDropoffComponent() {
    this.setState({
      loadingDropoff: false,
      dropoffLocationSuggestions: [],
      dropoffLocationString: '',
      dropoffLocationId: -1,
      submitEnabled: this.isReadyToSubmit()
    });
  }

  private handleDropoffResultSelect(e, { result }) {
    this.setState({
      dropoffLocationId: result.id,
      dropoffLocationString: result.title,
      submitEnabled: this.isReadyToSubmit()
    })
  }

  private handleSearchChange(e, { value }) {
    const targetField = e.target.name;
    const pickupDropoff = targetField.replace("LocationString", "");
    const loadingString = "loading" + capitalize(pickupDropoff);
    const idString = pickupDropoff + "LocationId";
    this.setState({
      ...this.state,
      [loadingString]: true,
      [targetField]: value,
      [idString]: -1,
      submitEnabled: this.isReadyToSubmit()
    })
    setTimeout(() => {
      if (this.state[targetField].length < 1) {
        if (pickupDropoff === "pickup") {
          return this.resetPickupComponent();
        } else {
          return this.resetDropoffComponent();
        }
      }

      const re = new RegExp(escapeRegExp(this.state[targetField]), 'i')
      const isMatch = result => re.test(result.title)

      let matches = filter(this.props.locations, isMatch);
      if (matches.length === 0) {
        matches = [{
          title: this.state[targetField],
          description: this.state[targetField],
          id: -1
        }]
      }

      const suggestionsString = pickupDropoff + "LocationSuggestions";
      this.setState({
        ...this.state,
        [loadingString]: false,
        [suggestionsString]: matches,
        submitEnabled: this.isReadyToSubmit()
      });
    }, 100)
  }

  private isReadyToSubmit() {
    const timeRe = new RegExp(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/);
    const conditions = [
      this.state.date.diff(moment()) > 0,
      timeRe.test(this.state.pickupTime),
      timeRe.test(this.state.dropoffTime),
      this.state.pickupLocationString.length > 0,
      this.state.dropoffLocationString.length > 0
    ];
    return (findIndex(conditions, (i) => i === false) === -1);
  }

  private handleRideSubmit(e) {
    if (this.isReadyToSubmit()) {
      const request: RideRequest = {
        id: -1,
        riderEmail: this.props.user.email,
        date: this.state.date.format("YYYY-MM-DD"),
        pickupTime: this.state.pickupTime,
        pickupLocationId: this.state.pickupLocationId,
        pickupLocationString: this.state.pickupLocationString,
        dropoffTime: this.state.dropoffTime,
        dropoffLocationId: this.state.dropoffLocationId,
        dropoffLocationString: this.state.dropoffLocationString
      }
      this.setState({
        submitEnabled: false
      });
      this.props.submitRequest(request);
    }
  }
}

function convertLocationsToItems(locations: RideLocation[]) {
  return locations.map(l => {
    return {
      title: l.location,
      description: l.desc,
      id: l.id
    }
  });
}

function mapStateToProps(state) {
  const { locations } = state.db;
  const { user } = state.auth;
  const { rideSubmitted, requestingRide, rideSubmitErrMsg } = state.rides;
  return {
    locations: convertLocationsToItems(locations),
    user,
    rideSubmitted,
    requestingRide,
    rideSubmitErrMsg
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchLocations: () => dispatch(handleFetchLocationsRequest()),
    submitRequest: (request: RideRequest) => dispatch(handleRequestRideRequest(request))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestForm);
