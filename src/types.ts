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

export interface DriverInfo {
  name: string;
  phone: string;
}

export interface Ride {
  id: number;
  riderEmail: string;
  date: string;
  pickupTime: string;
  pickupLocationId: number;
  pickupLocationString: string;
  dropoffTime: string;
  dropoffLocationId: number;
  dropoffLocationString: string;
  status: RideStatus;
  driver?: DriverInfo;
}
