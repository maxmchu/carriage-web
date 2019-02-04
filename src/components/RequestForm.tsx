import * as React from 'react';
import '../styles/App.scss';
import { connect } from 'react-redux';

import { Container, Header } from 'semantic-ui-react';

import DashboardNav from './DashboardNav';

interface IRequestFormProps {

}

interface IRequestFormState {

}

class RequestForm extends React.Component<IRequestFormProps, IRequestFormState> {

  public render() {
    return (
      <div>
        <DashboardNav />
        <Container>
          <Header as={"h1"}>Request a Ride</Header>
        </Container>
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

export default connect(mapStateToProps, mapDispatchToProps)(RequestForm);
