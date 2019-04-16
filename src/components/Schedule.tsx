import * as React from 'react';
import '../styles/App.scss';
import { connect } from 'react-redux';

import { Moment } from 'moment';
const moment = require('moment');
import { handleFetchAllRidesForDayRequest } from '../redux/actions';

import { Button, Divider, Grid, Header, Container, Form, Loader, Message } from 'semantic-ui-react';
import { SingleDatePicker } from 'react-dates';
import { sortBy } from 'lodash';

import { Ride, RideStatus } from '../types';
import DashboardNav from './DashboardNav';
import RideTable from './RideTable';


interface IScheduleProps {
  fetchAllRidesForDay: (requestedDate: string) => Ride[];
  allRidesForDay: Ride[];
  fetchingAllRidesForDay: boolean;
  allRidesForDayErrMsg: string;
}

interface IScheduleState {
  currentDate: Moment;
  today: Moment;
  showRequestsInSchedule: boolean;
  selectedDate: Moment;
  focused: boolean;
  submitEnabled: boolean;
  filteredRides: Ride[];
  pendingRides: Ride[];
  rejectedRides: Ride[];
}

class Schedule extends React.Component<IScheduleProps, IScheduleState> {

  public constructor(props) {
    super(props);
    const currentTime = moment();
    this.state = {
      currentDate: currentTime,
      today: currentTime,
      showRequestsInSchedule: false,
      selectedDate: currentTime,
      focused: false,
      submitEnabled: false,
      filteredRides: this.filterOutRequests(this.props.allRidesForDay),
      pendingRides: this.getPendingRequests(this.props.allRidesForDay),
      rejectedRides: this.getRejectedRequests(this.props.allRidesForDay)
    }
    this.onDateChange = this.onDateChange.bind(this);
    this.onFocusChange = this.onFocusChange.bind(this);
    this.handleDateSubmit = this.handleDateSubmit.bind(this);
    this.isOutsideRange = this.isOutsideRange.bind(this);
    this.filterOutRequests = this.filterOutRequests.bind(this);
    this.getPendingRequests = this.getPendingRequests.bind(this);
    this.getRejectedRequests = this.getRejectedRequests.bind(this);
    this.handleTomorrowSchedule = this.handleTomorrowSchedule.bind(this);
    this.handleTodaySchedule = this.handleTodaySchedule.bind(this);
  }

  public componentWillMount() {
    this.props.fetchAllRidesForDay(this.state.currentDate.format("YYYY-MM-DD"));
  }

  public componentDidUpdate(prevProps) {
    if (prevProps.allRidesForDay !== this.props.allRidesForDay) {
      this.setState({
        filteredRides: this.filterOutRequests(this.props.allRidesForDay),
        pendingRides: this.getPendingRequests(this.props.allRidesForDay),
        rejectedRides: this.getRejectedRequests(this.props.allRidesForDay)
      });
    }
  }

  public render(): JSX.Element {
    return (
      <div>
        <DashboardNav />
        <Container>
          <Divider horizontal>
            <Header as="h1" content={`Ride Schedule`} />
          </Divider>
          <Grid stackable>
            <Grid.Column floated='left' width={3}>
              <Form>
                <Form.Group>
                  <Form.Field>
                    <label>Show rides for date</label>
                    <SingleDatePicker
                      id="datepicker"
                      date={this.state.selectedDate}
                      noBorder={true}
                      numberOfMonths={1}
                      onDateChange={this.onDateChange}
                      focused={this.state.focused}
                      onFocusChange={this.onFocusChange}
                      showDefaultInputIcon
                      inputIconPosition="after"
                      isOutsideRange={this.isOutsideRange}
                    />
                  </Form.Field>
                </Form.Group>
                <Form.Group>
                  <Form.Button basic color="green"
                    content="Change Date"
                    disabled={!this.state.submitEnabled}
                    onClick={this.handleDateSubmit} />
                </Form.Group>
              </Form>
              <Header as="h4" content="Quick links" />
              <Button.Group vertical basic>
                <Button color="green"
                  content={`View today's schedule (${this.state.today.format("MMM D")})`}
                  icon='calendar alternate outline'
                  labelPosition='left'
                  onClick={this.handleTodaySchedule} />
                <Button color="green"
                  content={`Assign today's requests (${this.state.today.format("MMM D")})`}
                  icon='inbox'
                  labelPosition='left' />
                <Button color="green"
                  content={`View tomorrow's schedule (${this.state.today.clone().add(1, 'day').format("MMM D")})`}
                  icon='calendar alternate outline'
                  labelPosition='left'
                  onClick={this.handleTomorrowSchedule} />
                <Button color="green"
                  content={`Assign tomorrow's requests (${this.state.today.clone().add(1, 'day').format("MMM D")})`}
                  icon='inbox'
                  labelPosition='left' />
              </Button.Group>
            </Grid.Column>
            <Grid.Column width={13}>
              <Header as="h3">
                All schduled rides for {this.state.currentDate.format("MMMM Do, YYYY")}
              </Header>
              {
                (this.props.fetchingAllRidesForDay) ?
                  <Message >
                    <Loader active inline="centered" content="Loading scheduled rides" />
                  </Message> :
                  <RideTable rides={this.state.filteredRides} />
              }

              <Header as="h3">
                Pending requests for {this.state.currentDate.format("MMMM Do, YYYY")}
              </Header>
              {
                (this.props.fetchingAllRidesForDay) ?
                  <Message>
                    <Loader active inline="centered" content="Loading pending requests" />
                  </Message> :
                  <RideTable rides={this.state.pendingRides} />
              }

              <Header as="h3">
                Rejected requests for {this.state.currentDate.format("MMMM Do, YYYY")}
              </Header>
              {
                (this.props.fetchingAllRidesForDay) ?
                  <Message>
                    <Loader active inline="centered" content="Loading rejected requests" />
                  </Message> :
                  <RideTable rides={this.state.rejectedRides} />
              }
            </Grid.Column>
          </Grid>
        </Container>
      </div>
    );
  }

  private onDateChange(selectedDate) {
    this.setState({
      selectedDate,
      submitEnabled: !selectedDate.isSame(this.state.currentDate, 'day')
    });
  }

  private onFocusChange(focused) {
    this.setState(focused);
  }

  private handleDateSubmit(event) {
    this.props.fetchAllRidesForDay(this.state.selectedDate.format("YYYY-MM-DD"));
    this.setState({
      currentDate: this.state.selectedDate
    });
  }

  private handleTomorrowSchedule(event) {
    const tomorrow = this.state.today.clone().add(1, 'day')
    this.props.fetchAllRidesForDay(tomorrow.format("YYYY-MM-DD"));
    this.setState({
      currentDate: tomorrow,
      selectedDate: tomorrow
    });
  }

  private handleTodaySchedule(event) {
    this.props.fetchAllRidesForDay(this.state.today.format("YYYY-MM-DD"));
    this.setState({
      currentDate: this.state.today,
      selectedDate: this.state.today
    });
  }

  private isOutsideRange = () => false;

  private filterOutRequests(rides: Ride[]) {
    const filtered = rides.filter((ride) =>
      ride.status !== RideStatus.CANCELLED && ride.status !== RideStatus.REJECTED);
    return sortBy(filtered, ['pickupTime', 'pickupLocationString']);
  }

  private getPendingRequests(rides: Ride[]) {
    const filtered = rides.filter((ride) => ride.status === RideStatus.PENDING);
    return sortBy(filtered, ['pickupTime', 'pickupLocationString']);
  }

  private getRejectedRequests(rides: Ride[]) {
    const filtered = rides.filter((ride) => ride.status === RideStatus.REJECTED);
    return sortBy(filtered, ['pickupTime', 'pickupLocationString']);
  }

}

function mapStateToProps(state) {
  const { allRidesForDay, fetchingAllRidesForDay, allRidesForDayErrMsg } = state.dispatcherRides;
  return {
    allRidesForDay, fetchingAllRidesForDay, allRidesForDayErrMsg
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchAllRidesForDay: (requestedDate) => dispatch(handleFetchAllRidesForDayRequest(requestedDate))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Schedule)