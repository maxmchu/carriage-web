import * as React from 'react';
import '../styles/App.scss';
import { connect } from 'react-redux';

import { Button, Checkbox, Container, Divider, Form, Header, Message } from 'semantic-ui-react';
import DashboardNav from '../components/DashboardNav';
import { AccountType } from '../types';
import { handleProfileUpdateRequest } from '../redux/actions';

interface IProfileRequest {
  userEmail: string;
  firstName: string;
  lastName: string;
  phone: string;
}

interface IProfileProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  accountType: AccountType;
  updateProfile: (IProfileRequest) => any;
  updateErrorMsg: string;
  updateSuccessMsg: string;
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
    this.handleUpdateSubmit = this.handleUpdateSubmit.bind(this);
  }

  public render(): JSX.Element {
    return (
      <div>
        <DashboardNav />
        <Container>
          {
            (this.props.updateErrorMsg !== "") ?
              <Message negative>
                <Message.Header content='An error occurred!' />
                <Message.Content content={this.props.updateErrorMsg} />
              </Message> : null
          }
          {
            (this.props.updateSuccessMsg !== "") ?
              <Message positive>
                <Message.Header content={this.props.updateSuccessMsg} />
              </Message> : null
          }
          <Header as={"h1"}>Your Profile ({this.props.email})</Header>
          <Form>
            <Form.Group>
              <Checkbox toggle
                onChange={this.toggleEnable}
                label="Enable changes"
                checked={this.state.enabled} />
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
            <Button basic color='blue' content='Save changes' disabled={!this.state.enabled} onClick={this.handleUpdateSubmit} />
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

  private handleUpdateSubmit(e) {
    const request: IProfileRequest = {
      userEmail: this.props.email,
      firstName: (this.state.firstName.length > 0) ? this.state.firstName : this.props.firstName,
      lastName: (this.state.lastName.length > 0) ? this.state.lastName : this.props.lastName,
      phone: (this.state.phone.length > 0) ? this.state.phone : this.props.phone
    }
    this.setState({
      enabled: false
    });
    this.props.updateProfile(request);
  }

}

function mapStatesToProps(state) {
  const { firstName, lastName, email, phone, accountType, loggedIn } = state.auth.user;
  const { updatingProfile, updateErrorMsg, updateSuccessMsg } = state.profile;
  return {
    firstName,
    lastName,
    email,
    phone,
    accountType,
    loggedIn,
    updatingProfile,
    updateErrorMsg,
    updateSuccessMsg
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateProfile: ({ userEmail, firstName, lastName, phone }) => dispatch(handleProfileUpdateRequest({ userEmail, firstName, lastName, phone }))
  }
}

export default connect(mapStatesToProps, mapDispatchToProps)(Profile);