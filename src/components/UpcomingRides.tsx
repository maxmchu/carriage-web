import * as React from 'react';
import '../styles/App.scss';
import { connect } from 'react-redux';

import { handleFetchUpcomingRidesRequest } from '../redux/actions';
import { Ride } from '../types';
import RideCard from './RideCard';

interface IUpcomingRidesProps {
  riderEmail: string;
  fetchUpcomingRides: (riderEmail) => any;
  upcomingRides: Ride[];
}

interface IUpcomingRidesState {

}

class UpcomingRides extends React.Component<IUpcomingRidesProps, IUpcomingRidesState>{

  public constructor(props) {
    super(props);
  }

  public componentDidMount() {
    this.props.fetchUpcomingRides(this.props.riderEmail);
  }

  public render() {
    return (
      <div>
        <p>
          You have {this.props.upcomingRides.length} upcoming ride{(this.props.upcomingRides.length == 1) ? '' : 's'}.
        </p>
        {
          this.props.upcomingRides.map((ride) => {
            return <RideCard {...ride} key={"ride" + ride.id} />;
          })
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { email } = state.auth.user;
  const { upcomingRides } = state.rides;
  return {
    "riderEmail": email,
    "upcomingRides": upcomingRides
  };
}

function matchDispatchToProps(dispatch) {
  return {
    fetchUpcomingRides: (riderEmail) => dispatch(handleFetchUpcomingRidesRequest({ riderEmail }))
  };
}

export default connect(mapStateToProps, matchDispatchToProps)(UpcomingRides);
