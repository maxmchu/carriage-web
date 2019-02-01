import * as H from 'history';
import * as React from 'react';
import { connect, MapStateToPropsParam } from 'react-redux';
import { Redirect, Route, RouteComponentProps, RouteProps } from 'react-router';

export interface ConditionalRouteProps extends RouteProps {
  routeCondition: boolean;
  redirectTo: H.LocationDescriptor;
  componentProps?: any
}

export default class ConditionalRoute extends React.Component<ConditionalRouteProps> {
  public render() {
    // Extract RouteProps without component property to rest.
    const { component: Component, routeCondition, redirectTo, ...rest } = this.props;
    return <Route {...rest} render={this.renderFn} />
  }

  private renderFn = (renderProps: RouteComponentProps<any>) => {
    if (this.props.routeCondition) {
      const { component: Component } = this.props; // JSX accepts only upprcase.
      if (!Component) {
        return null;
      }
      const mergedProps = { ...renderProps, ...this.props.componentProps }
      return <Component {...mergedProps} />
    }

    return <Redirect to={this.props.redirectTo} />;
  };
}

export function connectConditionalRoute<S>(mapStateToProps: MapStateToPropsParam<ConditionalRouteProps, RouteProps, S>) {
  return connect<ConditionalRouteProps, {}, RouteProps, S>(mapStateToProps)(ConditionalRoute);
}
