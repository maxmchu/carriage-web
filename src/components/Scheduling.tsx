import * as React from 'react';
import '../styles/App.scss';
import { connect } from 'react-redux';

import { Divider, Header, Loader } from 'semantic-ui-react';
import { handleFetchDayUpcomingRidesRequest } from '../redux/actions';
import { Ride, RideStatus } from '../types';

import { Moment } from 'moment';
import RideTable from './RideTable';
const moment = require('moment');

interface ISchedulingProps {
  fetchUpcomingRidesForDay: () => Ride[],
  upcomingRidesForDay: Ride[],
  fetchingUpcomingRidesForDay: boolean,
  upcomingRidesForDayErrMsg: string
}

interface ISchedulingState {
  currentTime: Moment;
  ridesInProgress: Ride[];
  upcomingRides: Ride[];
}

class Scheduling extends React.Component<ISchedulingProps, ISchedulingState> {

  public constructor(props) {
    super(props);
    this.state = {
      currentTime: moment(),
      ridesInProgress: [],
      upcomingRides: []
    }
    this.getRidesInProgress = this.getRidesInProgress.bind(this);
    this.getUpcomingRides = this.getUpcomingRides.bind(this);
    this.renderRidesInProgress = this.renderRidesInProgress.bind(this);
    this.renderUpcomingRides = this.renderUpcomingRides.bind(this);
  }

  public componentDidMount() {
    this.props.fetchUpcomingRidesForDay();
  }

  public componentDidUpdate(prevProps: ISchedulingProps) {
    if (this.props.upcomingRidesForDay.length !== prevProps.upcomingRidesForDay.length) {
      console.log("changed!");
      this.setState({
        ridesInProgress: this.getRidesInProgress(),
        upcomingRides: this.getUpcomingRides()
      });
    }

  }

  public render(): JSX.Element {
    console.log(this.state);
    return (
      <div>
        <Header as="h1" content="Scheduling" />
        <Divider />
        <Header as="h2" content="Today's current and upcoming rides" />
        <Header as="h3" content="Confirmed rides in progress" />
        {
          (this.props.fetchingUpcomingRidesForDay) ?
            <Loader active inline="centered" content='Loading rides in progress' /> :
            this.renderRidesInProgress()
        }
        <Header as="h3" content="Upcoming confirmed rides" />
        {
          (this.props.fetchingUpcomingRidesForDay) ?
            <Loader active inline="centered" content='Loading upcoming rides' /> :
            this.renderUpcomingRides()
        }
        <Divider />
        <Header as="h2" content="Today's schedule" />
        <Divider />
        <Header as="h2" content="Pending requests" />

      </div>
    )
  }

  private getRidesInProgress(): Ride[] {
    console.log(this.props.upcomingRidesForDay);
    return this.props.upcomingRidesForDay.filter((ride) =>
      this.state.currentTime.isBetween(ride.pickupTime, ride.dropoffTime) && ride.status === RideStatus.CONFIRMED);
  }

  private getUpcomingRides(): Ride[] {
    return this.props.upcomingRidesForDay.filter((ride) =>
      this.state.currentTime.isBefore(ride.pickupTime) && ride.status === RideStatus.CONFIRMED);
  }

  private renderRidesInProgress(): JSX.Element {
    if (this.state.ridesInProgress.length <= 0) {
      return (
        <p>No confirmed rides are in progress.</p>
      );
    } else {
      return (
        <RideTable rides={this.state.ridesInProgress} />
      );
    }
  }

  private renderUpcomingRides(): JSX.Element {
    if (this.state.upcomingRides.length <= 0) {
      return (
        <p>No confirmed upcoming rides.</p>
      );
    } else {
      return (
        <RideTable rides={this.state.upcomingRides} />
      );
    }
  }

}

function mapStateToProps(state) {
  const { upcomingRidesForDay, fetchingUpcomingRidesForDay, upcomingRidesForDayErrMsg } = state.dispatcherRides;
  return {
    upcomingRidesForDay,
    fetchingUpcomingRidesForDay,
    upcomingRidesForDayErrMsg
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchUpcomingRidesForDay: () => dispatch(handleFetchDayUpcomingRidesRequest())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Scheduling);