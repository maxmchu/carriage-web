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
  needsWheelchair?: boolean;
  needsExtraSpace?: boolean;
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
  driverEmail?: string;
  driver?: RideUserInfo;
  rider?: RideUserInfo;
  needsWheelchair: boolean;
  needsExtraSpace: boolean;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}
