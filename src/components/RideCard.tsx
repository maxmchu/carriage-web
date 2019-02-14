import * as React from 'react';
import '../styles/App.scss';

import { Card, Item, SemanticCOLORS } from 'semantic-ui-react';

import '../styles/components/ridecard.scss';
import { RideStatus, DriverInfo } from '../types';
import { capitalize } from 'lodash';
const moment = require('moment');

interface IRideCardProps {
  date: string;
  status: RideStatus;
  pickupTime: string;
  pickupLocationString: string;
  dropoffTime: string;
  dropoffLocationString: string;
  driver?: DriverInfo;
}

class RideCard extends React.PureComponent<IRideCardProps> {

  public constructor(props) {
    super(props);
    this.statusColor = this.statusColor.bind(this);
    this.formatTime = this.formatTime.bind(this);
  }

  public render() {
    return (
      <Card color={this.statusColor(this.props.status)}>
        <Card.Content>
          <Card.Header content={moment(this.props.date).format("MMMM Do")} />
          <Card.Meta
            content={capitalize(this.props.status)}
            className={`${this.statusColor(this.props.status)} ride-status`} />
        </Card.Content>
        <Card.Content>
          <Card.Header content={`${this.formatTime(this.props.pickupTime)} pickup`} />
          <Card.Description content={this.props.pickupLocationString} />
        </Card.Content>
        <Card.Content>
          <Card.Header content={`${this.formatTime(this.props.dropoffTime)} dropoff`} />
          <Card.Description content={this.props.dropoffLocationString} />
        </Card.Content>
        {
          (this.props.driver) ?
            <Card.Content>
              <Card.Header>Your Driver</Card.Header>
              <Card.Description>
                <Item.Group>
                  <Item>
                    <Item.Content verticalAlign='middle'>
                      <Item.Header>{this.props.driver.name}</Item.Header>
                      <Item.Description>{this.props.driver.phone}</Item.Description>
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
    return moment(time).format("h:mm a");
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
