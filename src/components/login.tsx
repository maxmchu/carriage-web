import * as React from 'react';
import '../styles/App.scss';
import './login.scss';

import { Grid, Paper, Typography } from '@material-ui/core';

class Login extends React.Component {
  public render() {
    return (
      <div>
        <Grid container>
          <Grid item md={4}>
            <div className={"login-background"} />
          </Grid>
          <Grid item md={8} className={"login-container"}>
            <Grid container
              direction={"column"}
              justify={"center"}
              alignItems={"flex-start"}>
              <Grid item md={12}>
                <Typography variant={"h2"}>ADALift</Typography>
                <Typography variant={"h5"}>Rider Login</Typography>
              </Grid>
              <Grid item md={12}>

              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default Login;
