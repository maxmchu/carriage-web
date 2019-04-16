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
  riderEmail: string;
  date: string;
  pickupTime: string;
  pickupLocationId: number;
  pickupLocationString: string;
  dropoffTime: string;
  dropoffLocationId: number;
  dropoffLocationString: string;
}

export enum RideStatus {
  PENDING = 'pending', CONFIRMED = 'confirmed', REJECTED = 'rejected',
  COMPLETED = 'completed', CANCELLED = 'cancelled'
}

export interface RideUserInfo {
  name: string;
  phone: string;
}

export interface Ride {
  id: number;
  userEmail: string;
  accountType: AccountType;
  date: string;
  pickupTime: string;
  pickupLocationId: number;
  pickupLocationString: string;
  dropoffTime: string;
  dropoffLocationId: number;
  dropoffLocationString: string;
  rideStatus: RideStatus;
  driver?: RideUserInfo;
  rider?: RideUserInfo;
}
