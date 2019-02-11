export enum AccountType {
  RIDER = 'rider', DRIVER = 'driver', DISPATCHER = 'dispatcher'
}
export interface RideLocation {
  id: number;
  desc: string;
  location: string;
}