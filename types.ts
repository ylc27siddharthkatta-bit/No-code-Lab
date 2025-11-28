export enum UserRole {
  OWNER = 'OWNER',
  LOVER = 'LOVER',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  location: string;
}

export interface SOPItem {
  id: string;
  title: string;
  instruction: string;
}

export interface Pet {
  id: string;
  ownerId: string;
  name: string;
  species: string; // Dog, Cat, etc.
  breed: string;
  age: number;
  description: string;
  imageUrl: string;
  sops: SOPItem[];
}

export enum BookingStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
}

export interface Booking {
  id: string;
  petId: string;
  ownerId: string;
  loverId: string; // The person who requested/booked
  startDate: string;
  endDate: string;
  status: BookingStatus;
  totalPrice: number;
}

export interface Message {
  id: string;
  bookingId: string;
  senderId: string;
  text: string;
  timestamp: number;
}

export interface Review {
  id: string;
  bookingId: string;
  reviewerId: string;
  targetId: string; // The User ID being reviewed
  rating: number;
  comment: string;
  createdAt: string;
}