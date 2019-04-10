import * as React from 'react';
import '../styles/App.scss';
import { connect } from 'react-redux';

import { Header } from 'semantic-ui-react';
import { Moment } from 'moment';
const moment = require('moment');

interface ISchedulingProps {

}

interface ISchedulingState {

}

class Scheduling extends React.Component<ISchedulingProps, ISchedulingState> {

  public constructor(props) {
    super(props);
  }

  public render(): JSX.Element {
    return (
      <div>
        <Header as="h1" content="Scheduling" />
        <Header as="h2" content="Today's current and upcoming rides" />
        <Header as="h3" content="Rides in progress" />

        <Header as="h3" content="Upcoming rides" />

        <Header as="h2" content="Today's schedule" />
        <Header as="h2" content="Pending requests" />

      </div>
    )
  }

}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Scheduling);