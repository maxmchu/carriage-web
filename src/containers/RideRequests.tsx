import * as React from 'react';
import '../styles/App.scss';
import { connect } from 'react-redux';

import { Button, Container, Divider, Form, Grid, Header } from 'semantic-ui-react';
import { Moment } from 'moment';
const moment = require('moment');
import { SingleDatePicker } from 'react-dates';
import DashboardNav from '../components/DashboardNav';
import RideTable from '../components/RideTable';
import { handleFetchAllRequestsForDayRequest } from '../redux/actions';

import { Ride } from '../types';

interface IRequestsProps {
  fetchAllRequestsForDay: (requestedDate: string) => Ride[];
  allRequestsForDay: Ride[];
  fetchingAllRequestsForDay: boolean;
  allRequestsForDayErrMsg: string;
}

interface IRequestsState {
  currentDate: Moment;
  today: Moment;
  selectedDate: Moment;
  focused: boolean;
  dateChangeEnabled: boolean;
  data: Ride[];
}

class RideRequests extends React.Component<IRequestsProps, IRequestsState> {

  public constructor(props) {
    super(props);
    const currentTime = moment();
    this.state = {
      currentDate: currentTime,
      today: currentTime,
      selectedDate: currentTime,
      focused: false,
      dateChangeEnabled: false,
      data: this.props.allRequestsForDay
    }
    this.onFocusChange = this.onFocusChange.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.isOutsideRange = this.isOutsideRange.bind(this);
    this.onDateSubmit = this.onDateSubmit.bind(this);
    this.viewTodaysRequests = this.viewTodaysRequests.bind(this);
    this.viewTomorrowsRequests = this.viewTomorrowsRequests.bind(this);
  }

  public componentWillMount() {
    this.props.fetchAllRequestsForDay(this.state.currentDate.format("YYYY-MM-DD"));
  }

  public componentDidUpdate(prevProps) {
    if (prevProps.allRequestsForDay !== this.props.allRequestsForDay) {
      this.setState({
        data: this.props.allRequestsForDay
      });
    }
  }

  public render() {
    return (
      <div>
        <DashboardNav />
        <Container>
          <Divider horizontal>
            <Header as="h1" content="Ride Requests" />
            {this.state.currentDate.format("MMMM Do, YYYY")}
          </Divider>
          <Grid>
            <Grid.Row columns={2}>
              <Grid.Column width={4}>
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
                      disabled={!this.state.dateChangeEnabled}
                      onClick={this.onDateSubmit} />
                  </Form.Group>
                </Form>
              </Grid.Column>
              <Grid.Column width={12}>
                <Header as="h4" content="Quick actions" />
                <Button.Group vertical>
                  <Button basic icon={'inbox'} labelPosition='left'
                    content={`View today's requests (${this.state.today.format("MMM D")})`}
                    onClick={this.viewTodaysRequests} />
                  <Button basic icon={'inbox'} labelPosition='left'
                    content={`View tomorrow's requests (${this.state.today.clone().add(1, 'day').format("MMM D")})`}
                    onClick={this.viewTomorrowsRequests} />
                </Button.Group>
                <Button.Group vertical>
                  <Button basic icon="setting" labelPosition="left"
                    content={`Auto-schedule today's requests (${this.state.today.format("MMM D")})`} />
                  <Button basic icon="setting" labelPosition="left"
                    content={`Auto-schedule tomorrow's requests (${this.state.today.clone().add(1, 'day').format("MMM D")})`} />
                </Button.Group>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Header as="h3" content="Pending requests" />
          <RideTable rides={this.state.data} />
        </Container>
      </div >
    );
  }

  private onDateChange(selectedDate) {
    this.setState({
      selectedDate,
      dateChangeEnabled: !selectedDate.isSame(this.state.currentDate, 'day')
    });
  }

  private onFocusChange(focused) {
    this.setState(focused);
  }

  private isOutsideRange = () => false;

  private onDateSubmit(event) {
    this.props.fetchAllRequestsForDay(this.state.selectedDate.format("YYYY-MM-DD"));
    this.setState({
      currentDate: this.state.selectedDate
    });
  }

  private viewTodaysRequests(event) {
    this.props.fetchAllRequestsForDay(this.state.today.format("YYYY-MM-DD"));
    this.setState({
      currentDate: this.state.today,
      selectedDate: this.state.today
    });
  }

  private viewTomorrowsRequests(event) {
    const tomorrow = this.state.today.clone().add(1, 'day')
    this.props.fetchAllRequestsForDay(tomorrow.format("YYYY-MM-DD"));
    this.setState({
      currentDate: tomorrow,
      selectedDate: tomorrow
    });
  }

}

function mapStatetoProps(state) {
  const {
    allRequestsForDay, fetchingAllRequestsForDay, allRequestsForDayErrMsg
  } = state.dispatcherRides;
  return {
    allRequestsForDay, fetchingAllRequestsForDay, allRequestsForDayErrMsg
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchAllRequestsForDay: (requestedDate) => dispatch(handleFetchAllRequestsForDayRequest(requestedDate))
  };
}

export default connect(mapStatetoProps, mapDispatchToProps)(RideRequests);