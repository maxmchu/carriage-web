import * as React from 'react';
import '../styles/App.scss';
import { connect } from 'react-redux';

import { Container, Divider, Header } from 'semantic-ui-react';
import { Moment } from 'moment';
const moment = require('moment');
import { SingleDatePicker } from 'react-dates';
import DashboardNav from '../components/DashboardNav';

interface IRequestsProps {

}

interface IRequestsState {
  currentDate: Moment;
  today: Moment;
}

class RideRequests extends React.Component<IRequestsProps, IRequestsState> {

  public constructor(props) {
    super(props);
    const currentTime = moment();
    this.state = {
      currentDate: currentTime,
      today: currentTime
    }
  }

  public render() {
    return (
      <div>
        <DashboardNav />
        <Container>
          <Divider horizontal>
            <Header as="h1" content="Ride Requests" />
          </Divider>
        </Container>
      </div>
    );
  }

}

function mapStatetoProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStatetoProps, mapDispatchToProps)(RideRequests);