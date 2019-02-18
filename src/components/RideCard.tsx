import * as React from 'react';
import '../styles/App.scss';

import { Card, Item, SemanticCOLORS } from 'semantic-ui-react';

import '../styles/components/ridecard.scss';
import { RideStatus, RideUserInfo, AccountType } from '../types';
import { capitalize } from 'lodash';
const moment = require('moment');

interface IRideCardProps {
  accountType: AccountType;
  status: RideStatus;
  pickupTime: string;
  pickupLocationString: string;
  dropoffTime: string;
  dropoffLocationString: string;
  driver?: RideUserInfo;
  rider?: RideUserInfo;
}

class RideCard extends React.PureComponent<IRideCardProps> {

  public constructor(props) {
    super(props);
    this.statusColor = this.statusColor.bind(this);
    this.formatTime = this.formatTime.bind(this);
    this.renderDriverInfo = this.renderDriverInfo.bind(this);
    this.renderRiderInfo = this.renderRiderInfo.bind(this);
  }

  public render() {
    return (
      <Card color={this.statusColor(this.props.status)}>
        <Card.Content>
          <Card.Header content={moment(this.props.pickupTime.split(" ")[0]).format("MMMM Do")} />
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
        {(this.props.accountType in [AccountType.DRIVER, AccountType.DISPATCHER]) ? this.renderRiderInfo() : null}
        {(this.props.accountType in [AccountType.RIDER, AccountType.DISPATCHER]) ? this.renderDriverInfo() : null}

      </Card>
    );
  }

  private renderDriverInfo() {
    return (this.props.driver) ?
      <Card.Content>
        <Card.Header>Driver Information</Card.Header>
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

  private renderRiderInfo() {
    return (this.props.rider) ?
      <Card.Content>
        <Card.Header>Rider Information</Card.Header>
        <Card.Description>
          <Item.Group>
            <Item>
              <Item.Content verticalAlign='middle'>
                <Item.Header>{this.props.rider.name}</Item.Header>
                <Item.Description>{this.props.rider.phone}</Item.Description>
              </Item.Content>
            </Item>
          </Item.Group>
        </Card.Description>
      </Card.Content> :
      <Card.Content>
        <Card.Description content={"Rider information is missing. Contact dispatchers for ride information."} />
      </Card.Content>
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
