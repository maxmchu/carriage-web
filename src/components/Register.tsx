import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Form, Grid, Header } from 'semantic-ui-react';

interface IRegisterProps {

}
interface IRegisterState {
  username: string;
  password: string;
  confirmPassword: string;
}

class Register extends React.Component<IRegisterProps, IRegisterState> {

  public constructor(props: any) {
    super(props);
    this.state = {
      username: '',
      password: '',
      confirmPassword: ''
    }
    this.handleChange = this.handleChange.bind(this);
  }

  public render(): JSX.Element {
    return (
      <Grid container fluid className={"page-container"}>
        <Grid.Column width={4} style={{ padding: 0 }}>
          <div className={"login-background"} />
        </Grid.Column>
        <Grid.Column width={12} className={""}>
          <Header as={"h1"}>ADALift</Header>
          <Header as={"h3"}>Registration</Header>
          {/* TODO: Add state to actually confirm password, and front-end validation */}
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
                name='password'
                onChange={this.handleChange}
              />
            </Form.Field>
            <Button type='submit'>Register</Button>
          </Form>
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

}

function mapStateToProps(state: any) {
  return {};
}

function matchDispatchToProps(dispatch: any) {
  return {};
}

export default connect(mapStateToProps, matchDispatchToProps)(Register);