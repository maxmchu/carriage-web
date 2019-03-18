import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Grid, Header } from 'semantic-ui-react';

import "../styles/containers/welcome.scss";
import { Link } from 'react-router-dom';

interface IWelcomeProps {

}

interface IWelcomeState {

}

class Welcome extends React.Component<IWelcomeProps, IWelcomeState> {
  public render() {
    return (
      <Grid container className={"page-container"}>
        <Grid.Column width={4} style={{ padding: 0 }}>
          <div className={"login-background"} />
        </Grid.Column>
        <Grid.Column width={12}>
          <div className={"text-container"}>
            <Header as={"h1"}><Link to={"/"}>ADALift</Link></Header>
            <Header as={"h3"}>What is ADALift?</Header>
            <p>
              ADALift is a pre-arranged shuttle service designed to help provide
              access to classes and on-campus activities for students with
              temporary and permanent disabilities that affect mobility.
              It runs on and near campus.
            </p>
            <p>
              Hours of operation for spring/fall semester when classes are in
              session are <b>7:45am–10:00pm, Monday–Friday</b>. When classes are not in
              session and during the summer, the hours are 7:45am –4:45pm.
              The ADALift does not operate on the weekends.
            </p>
            <Header as={"h3"}>Need to Login?</Header>
            <Button as={Link} to="/login/" color='blue' basic>Sign into ADALift here</Button>
            <Header as={"h3"}>Need an Account?</Header>
            <Button as={Link} to="/register/" color='blue' basic>Register for ADALift here</Button>
          </div>
        </Grid.Column>
      </Grid>

    );
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Welcome);
