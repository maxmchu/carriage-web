import * as React from 'react';
import '../styles/App.scss';
import { connect } from 'react-redux';

interface IWelcomeProps {

}

interface IWelcomeState {

}

class Welcome extends React.Component<IWelcomeProps, IWelcomeState> {
  public render() {
    return (
      <h1>Welcome!</h1>
    );
  }
}

export default Welcome;