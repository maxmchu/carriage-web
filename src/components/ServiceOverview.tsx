import * as React from 'react';
import '../styles/App.scss';
import { connect } from 'react-redux';

import { Button, Divider, Header, Icon, Loader, List } from 'semantic-ui-react';
import { handleFetchDayUpcomingRidesRequest, handleFetchAllRidesForDayRequest } from '../redux/actions';
import { Ride, RideStatus } from '../types';
import { Link } from 'react-router-dom';

import { Moment } from 'moment';
import RideTable from './RideTable';
const moment = require('moment');

interface DayStats {
  totalConfirmed: number;
  totalRequests: number;
  totalPending: number;
}

interface ISchedulingProps {
  fetchUpcomingRidesForDay: () => Ride[];
  fetchAllRidesForDay: (requestedDate: string) => Ride[];
  upcomingRidesForDay: Ride[];
  fetchingUpcomingRidesForDay: boolean;
  upcomingRidesForDayErrMsg: string;
  allRidesForDay: Ride[];
  fetchingAllRidesForDay: boolean;
  allRidesForDayErrMsg: string;
}

interface ISchedulingState {
  currentTime: Moment;
  ridesInProgress: Ride[];
  upcomingRides: Ride[];
  todayStats: DayStats;
}

class ServiceOverview extends React.Component<ISchedulingProps, ISchedulingState> {

  public constructor(props) {
    super(props);
    this.state = {
      currentTime: moment(),
      ridesInProgress: [],
      upcomingRides: [],
      todayStats: {
        totalConfirmed: 0,
        totalRequests: 0,
        totalPending: 0
      }
    }
    this.getRidesInProgress = this.getRidesInProgress.bind(this);
    this.getUpcomingRides = this.getUpcomingRides.bind(this);
    this.renderRidesInProgress = this.renderRidesInProgress.bind(this);
    this.renderUpcomingRides = this.renderUpcomingRides.bind(this);
    this.calculateStats = this.calculateStats.bind(this);
  }

  public componentDidMount() {
    this.props.fetchUpcomingRidesForDay();
    this.props.fetchAllRidesForDay(this.state.currentTime.format("YYYY-MM-DD"));
  }

  public componentDidUpdate(prevProps: ISchedulingProps) {
    if (this.props.upcomingRidesForDay.length !== prevProps.upcomingRidesForDay.length) {
      this.setState({
        ridesInProgress: this.getRidesInProgress(),
        upcomingRides: this.getUpcomingRides()
      });
    }
    if (this.props.allRidesForDay !== prevProps.allRidesForDay) {
      this.setState({
        todayStats: this.calculateStats(this.props.allRidesForDay)
      });
    }

  }

  public render(): JSX.Element {
    return (
      <div>
        <Divider horizontal>
          <Header as="h1" content={`Today's Service`} />
          {this.state.currentTime.format("MMMM Do, YYYY")}
        </Divider>

        <Header as="h2" content="Current and upcoming rides" />
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
        <Header as="h2" content="Summary and Actions" />
        <List horizontal divided relaxed>
          <List.Item>
            <List.Content>
              <List.Header>
                <Icon name='check circle outline' color="green" />
                Confirmed rides
              </List.Header>
              <List.Description content={(this.props.fetchingAllRidesForDay) ? "Loading" : this.state.todayStats.totalConfirmed + " rides"} />
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              <List.Header>
                <Icon name='inbox' color="blue" />
                Total requests received
              </List.Header>
              <List.Description content={(this.props.fetchingAllRidesForDay) ? "Loading" : this.state.todayStats.totalRequests + " requests"} />
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              <List.Header>
                <Icon name='question circle outline' color="blue" />
                Pending requests
              </List.Header>
              <List.Description content={(this.props.fetchingAllRidesForDay) ? "Loading" : this.state.todayStats.totalPending + " pending"} />
            </List.Content>
          </List.Item>
        </List>
        <Divider hidden />
        <Button primary basic
          content="View today's complete schedule"
          icon='calendar alternate outline'
          labelPosition='left'
          as={Link} to={"/dashboard/schedule"} />
        <Button primary basic
          content="View today's pending requests"
          icon='inbox'
          labelPosition='left'
          as={Link} to={"/dashboard/requests"} />
        <Divider />

      </div>
    )
  }

  private getRidesInProgress(): Ride[] {
    console.log(this.props.upcomingRidesForDay);
    return this.props.upcomingRidesForDay.filter((ride) =>
      this.state.currentTime.isBetween(ride.pickupTime, ride.dropoffTime) && ride.rideStatus === RideStatus.CONFIRMED);
  }

  private getUpcomingRides(): Ride[] {
    return this.props.upcomingRidesForDay.filter((ride) =>
      this.state.currentTime.isBefore(ride.pickupTime) && ride.rideStatus === RideStatus.CONFIRMED);
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

  private calculateStats(rides: Ride[]): DayStats {
    const stats = {
      totalRequests: rides.length,
      totalConfirmed: 0,
      totalPending: 0
    }
    for (const ride of rides) {
      switch (ride.rideStatus) {
        case RideStatus.CONFIRMED:
          stats.totalConfirmed++;
          break;
        case RideStatus.PENDING:
          stats.totalPending++;
          break;
        default:
          break;
      }
    }
    return stats;
  }

}

function mapStateToProps(state) {
  const {
    upcomingRidesForDay, fetchingUpcomingRidesForDay, upcomingRidesForDayErrMsg,
    allRidesForDay, fetchingAllRidesForDay, allRidesForDayErrMsg
  } = state.dispatcherRides;
  return {
    upcomingRidesForDay, fetchingUpcomingRidesForDay, upcomingRidesForDayErrMsg,
    allRidesForDay, fetchingAllRidesForDay, allRidesForDayErrMsg
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchUpcomingRidesForDay: () => dispatch(handleFetchDayUpcomingRidesRequest()),
    fetchAllRidesForDay: (requestedDate) => dispatch(handleFetchAllRidesForDayRequest(requestedDate))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ServiceOverview);