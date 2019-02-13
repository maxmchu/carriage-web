export enum AccountType {
  RIDER = 'rider', DRIVER = 'driver', DISPATCHER = 'dispatcher'
}

export interface RideLocation {
  id: number;
  desc: string;
  location: string;
}

export interface RideRequest {
  id: number;
  userEmail: string;
  date: string;
  pickupTime: string;
  pickupLocationId: number;
  pickupLocationString: string;
  dropoffTime: string;
  dropoffLocationId: number;
  dropoffLocationString: string;
}