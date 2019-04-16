import * as React from 'react';
import '../styles/App.scss';
import { connect } from 'react-redux';

import { Header } from 'semantic-ui-react';
import { Moment } from 'moment';
const moment = require('moment');
import { SingleDatePicker } from 'react-dates';
import DashboardNav from '../components/DashboardNav';

interface IRequestsProps {

}

interface IRequestsState {

}

class RideRequests extends React.Component<IRequestsProps, IRequestsState> {

  public constructor(props) {
    super(props);
  }

  public render() {
    return (
      <div>
        <DashboardNav />
        <Header as="h1" content="Scheduling" />
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