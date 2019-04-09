import * as React from 'react';
import '../styles/App.scss';
import { connect } from 'react-redux';

import { Header } from 'semantic-ui-react';

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