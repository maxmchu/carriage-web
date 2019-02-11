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

import { debounce, escapeRegExp, filter } from 'lodash';


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
  pickupLocationId: number;
}

class RequestForm extends React.Component<IRequestFormProps, IRequestFormState> {

  public constructor(props) {
    super(props);
    this.state = {
      date: moment(),
      focused: false,
      pickupTime: "08:00",
      dropoffTime: "08:30",
      pickupLocationString: "",
      dropoffLocationString: "",
      pickupLocationSuggestions: [],
      dropoffLocationSuggestions: [],
      loadingPickup: false,
      pickupLocationId: -1
    };
    this.onDateChange = this.onDateChange.bind(this);
    this.onFocusChange = this.onFocusChange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.resetPickupComponent = this.resetPickupComponent.bind(this);
    this.handlePickupResultSelect = this.handlePickupResultSelect.bind(this);
    this.handlePickupSearchChange = this.handlePickupSearchChange.bind(this);
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
                    onChange={this.onChange}
                  />
                  <Form.Field>
                    <label>Pickup Location</label>
                    <Search
                      loading={this.state.loadingPickup}
                      onResultSelect={this.handlePickupResultSelect}
                      onSearchChange={debounce(this.handlePickupSearchChange, 200, { leading: true })}
                      results={this.state.pickupLocationSuggestions}
                      value={this.state.pickupLocationString}
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
                    onChange={this.onChange}
                  />
                  <Form.Input
                    label='Dropoff Location'
                  />
                </Form.Group>
              </Grid.Column>
            </Grid>
            <Form.Checkbox
              label='Check this box if you are a wheelchair user.' />
            <Form.Checkbox
              label='Check this box if you need extra space (for example, if you have a leg injury and must use a seat to keep your leg straight).' />
            <Button basic color='blue' as={Link} to={"/dashboard"}>Cancel Ride Request</Button>
            <Button basic color='green'>Submit Ride Request</Button>
          </Form>
        </Container>
      </div>
    )
  }

  private onDateChange(date) {
    this.setState({ date });
  }

  private onFocusChange(focused) {
    this.setState(focused);
  }

  private onChange(event) {
    this.setState({
      ...this.state,
      [event.target.name]: event.target.value
    })
  }

  private resetPickupComponent() {
    this.setState({
      loadingPickup: false,
      pickupLocationSuggestions: [],
      pickupLocationString: ''
    });
  }

  private handlePickupResultSelect(e, { result }) {
    this.setState({
      ...this.state,
      pickupLocationId: result.id,
      pickupLocationString: result.title
    });
  }

  private handlePickupSearchChange(e, { value }) {
    this.setState({
      loadingPickup: true,
      pickupLocationString: value
    })
    setTimeout(() => {
      if (this.state.pickupLocationString.length < 1) return this.resetPickupComponent()

      const re = new RegExp(escapeRegExp(this.state.pickupLocationString), 'i')
      const isMatch = result => re.test(result.title)

      let matches = filter(this.props.locations, isMatch);
      if (matches.length == 0) {
        matches = [{
          title: this.state.pickupLocationString,
          description: this.state.pickupLocationString,
          id: -1
        }]
      }

      this.setState({
        loadingPickup: false,
        pickupLocationSuggestions: matches,
      })
    }, 100)
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
