import * as React from 'react';
import '../styles/App.scss';
import { connect } from 'react-redux';

import { Moment } from 'moment';
const moment = require('moment');
import { handleFetchAllRidesForDayRequest } from '../redux/actions';

import { Button, Divider, Grid, Header, Container, Form, Rail } from 'semantic-ui-react';
import { SingleDatePicker } from 'react-dates';
import { sortBy } from 'lodash';

import { Ride } from '../types';
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
  showRequestsInSchedule: boolean;
  selectedDate: Moment;
  focused: boolean;
  submitEnabled: boolean;
}

class Schedule extends React.Component<IScheduleProps, IScheduleState> {

  public constructor(props) {
    super(props);
    const currentTime = moment();
    this.state = {
      currentDate: currentTime,
      showRequestsInSchedule: false,
      selectedDate: currentTime,
      focused: false,
      submitEnabled: false
    }
    this.onDateChange = this.onDateChange.bind(this);
    this.onFocusChange = this.onFocusChange.bind(this);
    this.handleDateSubmit = this.handleDateSubmit.bind(this);
    this.isOutsideRange = this.isOutsideRange.bind(this);
  }

  public componentWillMount() {
    this.props.fetchAllRidesForDay(this.state.currentDate.format("YYYY-MM-DD"));
  }

  public render(): JSX.Element {
    return (
      <div>
        <DashboardNav />
        <Container>
          <Divider horizontal>
            <Header as="h1" content={`Ride Schedule and Requests`} />
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
            </Grid.Column>
            <Grid.Column width={13}>
              <Header as="h3">
                All schduled rides for {this.state.currentDate.format("MMMM Do, YYYY")}
              </Header>
              <RideTable rides={this.props.allRidesForDay} />
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

  private isOutsideRange = () => false;

  private sortAscendingPickup(rides: Ride[]) {
    return sortBy(rides, ['pickupTime', 'pickupLocationString'])
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