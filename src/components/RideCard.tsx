import * as React from 'react';
import '../styles/App.scss';

import { Card, Item, SemanticCOLORS } from 'semantic-ui-react';

import '../styles/components/ridecard.scss';
import { RideStatus } from '../types';
import { capitalize } from 'lodash';
const moment = require('moment');

interface IRideCardProps {
  date: string;
  rideStatus: RideStatus;
  pickupTime: string;
  pickupLocation: string;
  dropoffTime: string;
  dropoffLocation: string;
  driverName?: string;
  driverPhone?: string;
}

class RideCard extends React.PureComponent<IRideCardProps> {

  public constructor(props) {
    super(props);
    this.statusColor = this.statusColor.bind(this);
    this.formatTime = this.formatTime.bind(this);
  }

  public render() {
    return (
      <Card color={this.statusColor(this.props.rideStatus)}>
        <Card.Content>
          <Card.Header content={moment(this.props.date).format("MMMM Do YY")} />
          <Card.Meta
            content={capitalize(this.props.rideStatus)}
            className={`${this.statusColor(this.props.rideStatus)} ride-status`} />
        </Card.Content>
        <Card.Content>
          <Card.Header content={`${this.formatTime(this.props.pickupTime)} pickup`} />
          <Card.Description content={this.props.pickupLocation} />
        </Card.Content>
        <Card.Content>
          <Card.Header content={`${this.formatTime(this.props.dropoffTime)} dropoff`} />
          <Card.Description content={this.props.dropoffLocation} />
        </Card.Content>
        {
          (this.props.driverName) ?
            <Card.Content>
              <Card.Header>Your Driver</Card.Header>
              <Card.Description>
                <Item.Group>
                  <Item>
                    <Item.Content verticalAlign='middle'>
                      <Item.Header>{this.props.driverName}</Item.Header>
                      <Item.Description>{this.props.driverPhone}</Item.Description>
                    </Item.Content>
                  </Item>
                </Item.Group>
              </Card.Description>
            </Card.Content> :
            <Card.Content>
              <Card.Description content={"Information about your driver will be posted here once your ride is confirmed."} />
            </Card.Content>
        }

      </Card>
    );
  }

  private formatTime(time: string) {
    moment(time).format("h:mm a");
  }

  private statusColor(status: RideStatus): SemanticCOLORS {
    switch (status) {
      default:
      case RideStatus.PENDING:
        return "blue";
      case RideStatus.CONFIRMED:
        return "olive";
      case RideStatus.REJECTED:
        return "red";
      case RideStatus.COMPLETED:
        return "green";
      case RideStatus.CANCELLED:
        return "orange";
    }
  }

}

export default RideCard;
