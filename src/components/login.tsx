import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Grid, Header, Form, Message } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import '../styles/components/login.scss';

import { handleLocalLoginRequest } from '../redux/actions';

interface ILoginProps {
  handleLoginRequest: (loginData: any) => any;
  errorMsg: string;
  checkingLogin: boolean;
}

interface ILoginState {
  username: string;
  password: string;
}

class Login extends React.Component<ILoginProps, ILoginState> {

  public constructor(props: any) {
    super(props);
    this.state = {
      username: '',
      password: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  public render() {
    return (
      <Grid container className={"page-container"}>
        <Grid.Column width={4} style={{ padding: 0 }}>
          <div className={"login-background"} />
        </Grid.Column>
        <Grid.Column width={12}>
          <Header as={"h1"}><Link to={"/"}>ADALift</Link></Header>
          <Header as={"h3"}>Login</Header>
          {
            (this.props.errorMsg == "") ? null :
              <Message negative>
                <Message.Header>There was a problem signing in</Message.Header>
                <p>{this.props.errorMsg}</p>
              </Message>
          }
          <Form>
            <Form.Field>
              <label>Cornell Email</label>
              <input
                placeholder='NetID@cornell.edu'
                value={this.state.username}
                name='username'
                onChange={this.handleChange}
              />
            </Form.Field>
            <Form.Field>
              <label>Password</label>
              <input
                type='password'
                placeholder='ADALift Password'
                value={this.state.password}
                name='password'
                onChange={this.handleChange}
              />
            </Form.Field>
            <Button type='submit' onClick={this.handleSubmit}>Login</Button>
          </Form>
          <Header as={"h3"}>Need to register?</Header>
          <p>
            <Link to={"/register"}>Register for an account here</Link>, which must be approved for the ADALift service by our dispatchers.
          </p>
        </Grid.Column>
      </Grid>
    )
  }

  private handleChange(event) {
    this.setState({
      ...this.state,
      [event.target.name]: event.target.value
    });
  }

  private handleSubmit(event) {
    this.props.handleLoginRequest({
      username: this.state.username,
      password: this.state.password
    })
  }
}

function mapStateToProps(state: any) {
  const { loginErrorMsg } = state.auth;
  return { errorMsg: loginErrorMsg };
}

function matchDispatchToProps(dispatch: any) {
  return {
    handleLoginRequest: (loginData) => dispatch(handleLocalLoginRequest(loginData))
  };
}

export default connect(mapStateToProps, matchDispatchToProps)(Login);
