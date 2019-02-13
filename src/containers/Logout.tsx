import * as React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { handleLogoutRequest } from '../redux/actions';

interface ILogoutProps {
  handleLogout: () => any;
}

class Logout extends React.Component<ILogoutProps> {

  public constructor(props) {
    super(props);
  }

  public componentDidMount() {
    this.props.handleLogout();
  }

  public render() {
    return (<Redirect to={"/"} />);
  }
}

function mapStateToProps(state) {
  return {};
}

function matchDispatchToProps(dispatch) {
  return {
    handleLogout: () => dispatch(handleLogoutRequest())
  };
}

export default connect(mapStateToProps, matchDispatchToProps)(Logout);