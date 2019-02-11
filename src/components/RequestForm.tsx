import * as React from 'react';
import '../styles/App.scss';
import { connect } from 'react-redux';

import { Button, Container, Form, Header, Grid, Search } from 'semantic-ui-react';
import { Moment } from 'moment';
const moment = require('moment');
import { SingleDatePicker } from 'react-dates';

import DashboardNav from './DashboardNav';
import { Link } from 'react-router-dom';
import { handleFetchLocationsRequest } from '../redux/actions';
import { RideLocation } from '../types';

import { capitalize, debounce, escapeRegExp, filter, findIndex } from 'lodash';


interface IRequestFormProps {
  fetchLocations: () => any;
  locations: any[];
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
      date: moment().endOf("day"),
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
  }

  public componentDidMount() {
    this.props.fetchLocations();
  }

  public render() {
    return (
      <div>
        <DashboardNav />
        <Container>
          <Header as={"h1"}>Request a Ride</Header>
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
            <Grid stackable columns='equal'>
              <Grid.Column>
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
              </Grid.Column>
              <Grid.Column>
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
              </Grid.Column>
            </Grid>
            <Form.Checkbox
              label='Check this box if you are a wheelchair user.'
              checked={this.state.needsWheelchair}
              onChange={this.onWheelchairChange}
            />
            <Form.Checkbox
              label='Check this box if you need extra space (for example, if you have a leg injury and must use an additional seat to keep your leg straight).'
              checked={this.state.needsExtraSpace}
              onChange={this.onExtraSpaceChange}
            />
            <Button basic color='blue' as={Link} to={"/dashboard"}>Cancel Ride Request</Button>
            <Button basic color='green' disabled={!this.state.submitEnabled}>Submit Ride Request</Button>
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
        if (pickupDropoff == "pickup") {
          return this.resetPickupComponent();
        } else {
          return this.resetDropoffComponent();
        }
      }

      const re = new RegExp(escapeRegExp(this.state[targetField]), 'i')
      const isMatch = result => re.test(result.title)

      let matches = filter(this.props.locations, isMatch);
      if (matches.length == 0) {
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
    return (findIndex(conditions, (i) => { return i == false }) == -1);
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
  return {
    locations: convertLocationsToItems(locations)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchLocations: () => dispatch(handleFetchLocationsRequest())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestForm);
