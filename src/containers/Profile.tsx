import * as React from 'react';
import '../styles/App.scss';
import { connect } from 'react-redux';

import { Button, Checkbox, Container, Divider, Form, Header } from 'semantic-ui-react';
import DashboardNav from '../components/DashboardNav';
import { AccountType } from '../types';

interface IProfileProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  accountType: AccountType
}

interface IProfileState {
  enabled: boolean;
  firstName: string;
  lastName: string;
  phone: string;
}

class Profile extends React.Component<IProfileProps, IProfileState> {

  public constructor(props) {
    super(props);
    this.state = {
      enabled: false,
      firstName: this.props.firstName,
      lastName: this.props.lastName,
      phone: this.props.phone
    }
    this.handleChange = this.handleChange.bind(this);
    this.toggleEnable = this.toggleEnable.bind(this);
  }

  public render(): JSX.Element {
    return (
      <div>
        <DashboardNav />
        <Container>
          <Header as={"h1"}>Your Profile ({this.props.email})</Header>
          <Form>
            <Form.Group>
              <Checkbox toggle
                onChange={this.toggleEnable}
                label="Enable changes" />
            </Form.Group>
            <Form.Group>
              <Form.Input
                label='First name' name='firstName'
                readOnly={!this.state.enabled} onChange={this.handleChange}
                value={this.state.firstName} />
              <Form.Input
                label='Last name' name='lastName'
                readOnly={!this.state.enabled} onChange={this.handleChange}
                value={this.state.lastName} />
            </Form.Group>
            <Form.Group>
              <Form.Input
                label='Phone number' name='phone'
                readOnly={!this.state.enabled} onChange={this.handleChange}
                value={this.state.phone} />
            </Form.Group>
            <Divider hidden />
            <Button basic color='blue' content='Save changes' disabled={!this.state.enabled} />
          </Form>
        </Container>
      </div>
    )
  }

  private handleChange(event) {
    this.setState({
      ...this.state,
      [event.target.name]: event.target.value
    });
  }

  private toggleEnable(event) {
    this.setState({
      enabled: !this.state.enabled
    });
  }

}

function mapStatesToProps(state) {
  const { firstName, lastName, email, phone, accountType, loggedIn } = state.auth.user;
  return {
    "firstName": firstName,
    "lastName": lastName,
    "email": email,
    "phone": phone,
    "accountType": accountType,
    "loggedIn": loggedIn
  };
}

function mapDispatchToProps(dispatch) {

}

export default connect(mapStatesToProps, mapDispatchToProps)(Profile);