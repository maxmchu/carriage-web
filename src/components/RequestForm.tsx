import * as React from 'react';
import '../styles/App.scss';
import { connect } from 'react-redux';

import { Button, Container, Form, Header, Grid } from 'semantic-ui-react';
import { Moment } from 'moment';
const moment = require('moment');
import { SingleDatePicker } from 'react-dates';

import DashboardNav from './DashboardNav';
import { Link } from 'react-router-dom';


interface IRequestFormProps {

}

interface IRequestFormState {
  date: Moment;
  focused: boolean;
  pickupTime: any;
  dropoffTime: any;
}

class RequestForm extends React.Component<IRequestFormProps, IRequestFormState> {

  public constructor(props) {
    super(props);
    this.state = {
      date: moment(),
      focused: false,
      pickupTime: "08:00",
      dropoffTime: "08:30"
    };
    this.onDateChange = this.onDateChange.bind(this);
    this.onFocusChange = this.onFocusChange.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  public render() {
    return (
      <div>
        <DashboardNav />
        <Container>
          <Header as={"h1"}>Request a Ride</Header>
          <Form>
            <Header as={"h2"}>Ride Details</Header>
            <Form.Field>
              <label>Date</label>
              <SingleDatePicker
                date={this.state.date}
                onDateChange={this.onDateChange}
                focused={this.state.focused}
                onFocusChange={this.onFocusChange}
                id="datepicker"
                noBorder={true}
                numberOfMonths={1}
              />
            </Form.Field>
            <Grid stackable columns='equal'>
              <Grid.Column>
                <Header as={"h3"}>Pickup</Header>
                <Form.Group>
                  <Form.Input
                    label='Time'
                    type='time'
                    name='pickupTime'
                    value={this.state.pickupTime}
                    onChange={this.onChange}
                  />
                  <Form.Input
                    label='Pickup Location'
                  />
                </Form.Group>
              </Grid.Column>
              <Grid.Column>
                <Header as={"h3"}>Dropoff</Header>
                <Form.Group>
                  <Form.Input
                    label='Time'
                    type='time'
                    name='dropoffTime'
                    value={this.state.dropoffTime}
                    onChange={this.onChange}
                  />
                  <Form.Input
                    label='Dropoff Location'
                  />
                </Form.Group>
              </Grid.Column>
            </Grid>
            <Form.Checkbox
              label='Check this box if you are a wheelchair user.' />
            <Form.Checkbox
              label='Check this box if you need extra space (for example, if you have a leg injury and must use a seat to keep your leg straight).' />
            <Button basic color='blue' as={Link} to={"/dashboard"}>Cancel Ride Request</Button>
            <Button basic color='green'>Submit Ride Request</Button>
          </Form>
        </Container>
      </div>
    )
  }

  private onDateChange(date) {
    this.setState({ date });
  }

  private onFocusChange(focused) {
    this.setState(focused);
  }

  private onChange(event) {
    this.setState({
      ...this.state,
      [event.target.name]: event.target.value
    })
  }

}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestForm);
