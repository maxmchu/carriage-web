import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';
import { handleLocalRegisterRequest } from '../redux/actions';
import { Link } from 'react-router-dom';
import { capitalize } from 'lodash';

interface IRegisterProps {
  handleRegisterRequest: (registerData: any) => any;
  errorMsg: string;
}
interface IRegisterState {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  confirmPassword: string;
  phone: string;
}

class Register extends React.Component<IRegisterProps, IRegisterState> {

  public constructor(props: any) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      username: '',
      password: '',
      confirmPassword: '',
      phone: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleName = this.handleName.bind(this);
  }

  public render(): JSX.Element {
    return (
      <Grid container className={"page-container"}>
        <Grid.Column width={4} style={{ padding: 0 }}>
          <div className={"login-background"} />
        </Grid.Column>
        <Grid.Column width={12} className={""}>
          <Image as={Link} to={"/"} src={require("../assets/carriage.svg")} size="small" />
          <Header as={"h2"}>Registration</Header>
          {/* TODO: Add state to actually confirm password, and front-end validation */}
          {
            (this.props.errorMsg === "") ? null :
              <Message negative>
                <Message.Header>There was a problem with your registration</Message.Header>
                <p>{this.props.errorMsg}</p>
              </Message>
          }
          <Form>
            <Form.Group widths='equal'>
              <Form.Input fluid
                label='Preferred first name'
                placeholder='First name'
                value={this.state.firstName}
                name='firstName'
                onChange={this.handleChange}
                required />
              <Form.Input fluid
                label='Last name'
                placeholder='Last name'
                value={this.state.lastName}
                name='lastName'
                onChange={this.handleChange}
                required />
            </Form.Group>
            <Form.Input
              label='Cornell Email'
              placeholder='NetID@cornell.edu'
              value={this.state.username}
              name='username'
              onChange={this.handleChange}
              required />
            <Form.Input
              label='Password'
              type='password'
              placeholder='ADALift Password'
              value={this.state.password}
              name='password'
              onChange={this.handleChange}
              required />
            <Form.Input
              label='Phone number'
              placeholder='xxx-xxx-xxxx'
              value={this.state.phone}
              type='tel'
              name='phone'
              onChange={this.handleChange}
              required />
            <Button type='submit' onClick={this.handleSubmit}>Register</Button>
          </Form>
          <Segment color='blue'>
            <p>
              Please note that you will have to wait for your account to be approved
              for rides by our dispatchers before you can request rides.
            </p>
          </Segment>
        </Grid.Column>
      </Grid>
    )
  }

  private handleChange(event) {
    this.setState({
      ...this.state,
      [event.target.name]: event.target.value
    })
  }

  private handleName(name) {
    if (name.split("-").length === 1) {
      return capitalize(name);
    } else {
      return (name.split("-").map(n => capitalize(n))).join('-');
    }
  }

  private handleSubmit(event) {
    this.props.handleRegisterRequest({
      username: this.state.username,
      password: this.state.password,
      firstName: this.handleName(this.state.firstName),
      lastName: capitalize(this.state.lastName),
      accountType: 'rider',
      phone: this.state.phone
    });
  }

}

function mapStateToProps(state: any) {
  const { registerErrorMsg } = state.auth;
  return { errorMsg: registerErrorMsg };
}

function mapDispatchToProps(dispatch: any) {
  return {
    handleRegisterRequest: (registerData) => dispatch(handleLocalRegisterRequest(registerData))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);