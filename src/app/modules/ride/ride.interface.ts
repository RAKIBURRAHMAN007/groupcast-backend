export enum RideStatus {
  REQUESTED = "requested",
  ACCEPTED = "accepted",
  PICKED_UP = "picked_up",
  IN_TRANSIT = "in_transit",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export interface ILocation {
  lat: number;
  lng: number;
  address?: string;
}

export interface IRide {
  id: string;
  riderId: string;
  driverId?: string;
  pickupLocation: ILocation;
  destination: ILocation;
  status: RideStatus;
  requestedAt: Date;
  acceptedAt?: Date;
  pickedUpAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  fare?: number;
  distance?: number;
  estimatedDuration?: number;
  riderRating?: number;
  driverRating?: number;
}
