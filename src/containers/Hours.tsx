import * as React from 'react';
import '../styles/App.scss';
import { connect } from 'react-redux';

import { Form, Container, Header } from 'semantic-ui-react';
import DashboardNav from '../components/DashboardNav';

interface IHoursProps {

}

interface IHoursState {

}

class Hours extends React.Component<IHoursProps, IHoursState> {

  public constructor(props) {
    super(props);
  }

  public render(): JSX.Element {
    return (
      <div>
        <DashboardNav />
        <Container>
          <Header as="h1" content="Set shift hours" />
        </Container>
      </div>
    );
  }

}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Hours);