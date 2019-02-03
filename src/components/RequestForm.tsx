import * as React from 'react';
import '../styles/App.scss';
import { connect } from 'react-redux';

interface IRequestFormProps {

}

interface IRequestFormState {

}

class RequestForm extends React.Component<IRequestFormProps, IRequestFormState> {

  public render() {
    return (
      <div></div>
    )
  }

}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestForm);
