import * as React from 'react';
import '../styles/App.scss';
import { connect } from 'react-redux';
import { Header, Icon, Loader, Segment } from 'semantic-ui-react';

import { handleFetchUpcomingRidesRequest } from '../redux/actions';
import { Ride, AccountType } from '../types';
import RideCard from './RideCard';

interface IUpcomingRidesProps {
  userEmail: string;
  fetchUpcomingRides: (userEmail, accountType) => any;
  upcomingRides: Ride[];
  accountType: AccountType;
  fetchingUpcomingRides: boolean;
}

class UpcomingRides extends React.PureComponent<IUpcomingRidesProps>{

  public constructor(props) {
    super(props);
    this.renderRideCount = this.renderRideCount.bind(this);
  }

  public componentDidMount() {
    this.props.fetchUpcomingRides(this.props.userEmail, this.props.accountType);
  }

  public render() {
    return (
      (this.props.fetchingUpcomingRides) ?
        <Loader active inline="centered">Loading upcoming rides</Loader>
        :
        <div>
          {
            this.renderRideCount()
          }
          {
            this.props.upcomingRides.map((ride) => {
              return (
                <RideCard {...ride}
                  key={"ride" + ride.id}
                  accountType={this.props.accountType} />
              );
            })
          }
        </div>
    );
  }

  private renderRideCount() {
    return (this.props.upcomingRides.length > 0) ?
      (
        <p>
          You have {this.props.upcomingRides.length} upcoming ride{(this.props.upcomingRides.length == 1) ? '' : 's'}.
        </p>
      ) :
      (
        <Segment placeholder>
          <Header icon>
            <Icon name='circle outline' />
            You have no upcoming rides.
          </Header>
        </Segment>
      )
  }
}

function mapStateToProps(state) {
  const { email, accountType } = state.auth.user;
  const { upcomingRides, fetchingUpcomingRides } = state.rides;
  return {
    "userEmail": email,
    accountType,
    upcomingRides,
    fetchingUpcomingRides
  };
}

function matchDispatchToProps(dispatch) {
  return {
    fetchUpcomingRides: (userEmail, accountType) => dispatch(handleFetchUpcomingRidesRequest({ userEmail, accountType }))
  }
}

export default connect(mapStateToProps, matchDispatchToProps)(UpcomingRides);
