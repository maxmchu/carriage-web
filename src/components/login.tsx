import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Grid, Header, Form } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import '../styles/components/login.scss';

import { handleGoogleOauth2Request } from '../redux/actions';

interface ILoginProps {
  googleOauthLogin: () => any;
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
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  public render() {
    return (
      <Grid container className={"page-container"}>
        <Grid.Column width={4} style={{ padding: 0 }}>
          <div className={"login-background"} />
        </Grid.Column>
        <Grid.Column width={12}>
          <Header as={"h1"}>ADALift</Header>
          <Header as={"h3"}>Login</Header>
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
            <Button type='submit'>Login</Button>
          </Form>
          <Header as={"h3"}>Need to register?</Header>
          <p>
            <Link to={"/register"}>Register for an account here</Link>, which must be approved for the ADALift service by our dispatchers.
          </p>
        </Grid.Column>
      </Grid>
    )
  }

  private handleLoginClick(e: any) {
    this.props.googleOauthLogin();
  }

  private handleChange(event) {
    this.setState({
      ...this.state,
      [event.target.name]: event.target.value
    });
  }

  private handleSubmit(event) {
  }
}

function mapStateToProps(state: any) {
  return {};
}

function matchDispatchToProps(dispatch: any) {
  return {
    googleOauthLogin: () => dispatch(handleGoogleOauth2Request())
  };
}

export default connect(mapStateToProps, matchDispatchToProps)(Login);
