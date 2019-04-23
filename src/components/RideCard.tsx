import * as React from 'react';
import '../styles/App.scss';

import { Card, Header, SemanticCOLORS } from 'semantic-ui-react';

import '../styles/components/ridecard.scss';
import { RideStatus, RideUserInfo, AccountType } from '../types';
import { capitalize } from 'lodash';
const moment = require('moment');

interface IRideCardProps {
  accountType: AccountType;
  rideStatus: RideStatus;
  pickupTime: string;
  pickupLocationString: string;
  dropoffTime: string;
  dropoffLocationString: string;
  pickupLocationDesc?: string;
  dropoffLocationDesc?: string;
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
      <Card color={this.statusColor(this.props.rideStatus)}>
        <Card.Content>
          <Card.Header
            content={moment(this.props.pickupTime.split(" ")[0]).format("MMMM Do")}
            className="ride-card-date" />
          <Card.Meta
            content={capitalize(this.props.rideStatus)}
            className={`${this.statusColor(this.props.rideStatus)} ride-status`} />
        </Card.Content>
        <Card.Content className="ride-card-dest">
          <Card.Header content={`${this.formatTime(this.props.pickupTime)} pickup`} />
          <Card.Meta
            content={this.props.pickupLocationString}
            className="ride-card-location" />
          {(this.props.pickupLocationDesc) ?
            <Card.Description
              content={this.props.pickupLocationDesc}
              className={"ride-card-location-desc"} /> :
            null
          }
        </Card.Content>
        <Card.Content className="ride-card-dest">
          <Card.Header content={`${this.formatTime(this.props.dropoffTime)} dropoff`} />
          <Card.Meta
            content={this.props.dropoffLocationString}
            className="ride-card-location" />
          {(this.props.dropoffLocationDesc) ?
            <Card.Description
              content={this.props.dropoffLocationDesc}
              className={"ride-card-location-desc"} /> :
            null
          }
        </Card.Content>
        {([AccountType.DRIVER, AccountType.DISPATCHER].includes(this.props.accountType)) ? this.renderRiderInfo() : null}
        {([AccountType.RIDER, AccountType.DISPATCHER].includes(this.props.accountType)) ? this.renderDriverInfo() : null}

      </Card>
    );
  }

  private renderDriverInfo() {
    return (this.props.driver) ?
      <Card.Content className="ride-card-match">
        <Card.Header>Driver Information</Card.Header>
        <Card.Description>
          <Header as="h4" content={this.props.driver.name} />
          {this.props.driver.phone}
        </Card.Description>
      </Card.Content> :
      <Card.Content className="ride-card-match">
        <Card.Description content={"Information about your driver will be posted here once your ride is confirmed."} />
      </Card.Content>
  }

  private renderRiderInfo() {
    return (this.props.rider) ?
      <Card.Content className="ride-card-match">
        <Card.Header>Rider Information</Card.Header>
        <Card.Description>
          <Header as="h4" content={this.props.rider.name} />
          {this.props.rider.phone}
        </Card.Description>
      </Card.Content > :
      <Card.Content className="ride-card-match">
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
        return "green";
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
