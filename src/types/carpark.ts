// Car Park Management System Types

export type ParkingSpaceType = 'open_air' | 'covered';
export type ParkingSpaceStatus = 'available' | 'occupied' | 'maintenance' | 'reserved';
export type CarType = 'sedan' | 'suv' | 'mpv' | 'hatchback' | 'coupe';
export type BookingStatus = 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled' | 'no_show';
export type ShuttleTerminal = 'T1' | 'T2';
export type PaymentMethod = 'fpx' | 'credit_card' | 'ewallet' | 'cash';
export type PaymentProvider = 'stripe' | 'billplz' | 'ipay88';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
export type WashType = 'basic' | 'premium' | 'deluxe';
export type WashStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type TripStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

// Core entities
export interface ParkingSpace {
  id: number;
  space_number: string;
  type: ParkingSpaceType;
  status: ParkingSpaceStatus;
  hourly_rate: number;
  daily_rate: number;
  is_active: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ParkConfig {
  id: number;
  key: string;
  value: string;
  type: 'string' | 'number' | 'boolean' | 'json';
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Vehicle {
  id: number;
  customer_id: number;
  plate_number: string;
  car_type: CarType;
  make?: string;
  model?: string;
  color?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
  
  // Relationships
  customer?: {
    id: number;
    fullname: string;
    email: string;
  };
}

export interface Booking {
  id: number;
  booking_reference: string;
  customer_id: number;
  space_id?: number;
  vehicle_id: number;
  scheduled_check_in: string;
  scheduled_check_out: string;
  actual_check_in?: string;
  actual_check_out?: string;
  parking_type: ParkingSpaceType;
  base_amount: number;
  service_amount: number;
  total_amount: number;
  currency: string;
  status: BookingStatus;
  shuttle_required: boolean;
  shuttle_terminal?: ShuttleTerminal;
  car_wash_requested: boolean;
  special_instructions?: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  
  // Relationships
  customer?: {
    id: number;
    fullname: string;
    email: string;
    phone?: string;
  };
  vehicle?: Vehicle;
  parking_space?: ParkingSpace;
  payment?: Payment;
  car_wash_order?: CarWashOrder;
}

export interface ShuttleSchedule {
  id: number;
  departure_time: string;
  terminal: ShuttleTerminal;
  capacity: number;
  driver_id?: number;
  is_active: boolean;
  day_of_week?: DayOfWeek;
  notes?: string;
  created_at: string;
  updated_at: string;
  
  // Relationships
  driver?: {
    id: number;
    fullname: string;
    email: string;
  };
}

export interface ShuttleTrip {
  id: number;
  schedule_id: number;
  trip_date: string;
  actual_departure?: string;
  actual_arrival?: string;
  passenger_count: number;
  status: TripStatus;
  trip_notes?: string;
  created_at: string;
  updated_at: string;
  
  // Relationships
  schedule?: ShuttleSchedule;
  passengers?: {
    booking_id: number;
    customer_name: string;
    terminal: ShuttleTerminal;
  }[];
}

export interface CarWashOrder {
  id: number;
  booking_id: number;
  car_type: CarType;
  price: number;
  wash_type: WashType;
  status: WashStatus;
  assigned_staff_id?: number;
  started_at?: string;
  completed_at?: string;
  instructions?: string;
  completion_notes?: string;
  created_at: string;
  updated_at: string;
  
  // Relationships
  booking?: Booking;
  assigned_staff?: {
    id: number;
    fullname: string;
    email: string;
  };
}

export interface Payment {
  id: number;
  booking_id: number;
  payment_reference?: string;
  payment_method: PaymentMethod;
  payment_provider: PaymentProvider;
  amount: number;
  currency: string;
  status: PaymentStatus;
  provider_transaction_id?: string;
  provider_response?: any;
  paid_at?: string;
  failure_reason?: string;
  created_at: string;
  updated_at: string;
  
  // Relationships
  booking?: Booking;
}

// Request/Response types for API
export interface CreateBookingRequest {
  scheduled_check_in: string;
  scheduled_check_out: string;
  parking_type: ParkingSpaceType;
  vehicle: {
    plate_number: string;
    car_type: CarType;
    make?: string;
    model?: string;
    color?: string;
  };
  shuttle_required: boolean;
  shuttle_terminal?: ShuttleTerminal;
  car_wash_requested: boolean;
  wash_type?: WashType;
  special_instructions?: string;
}

export interface BookingResponse {
  booking: Booking;
  pricing_breakdown: {
    parking_cost: number;
    car_wash_cost: number;
    total_cost: number;
    duration_hours: number;
  };
}

export interface AvailabilityRequest {
  check_in: string;
  check_out: string;
  parking_type?: ParkingSpaceType;
}

export interface AvailabilityResponse {
  available_spaces: {
    open_air: number;
    covered: number;
  };
  pricing: {
    open_air: {
      hourly_rate: number;
      daily_rate: number;
      estimated_cost: number;
    };
    covered: {
      hourly_rate: number;
      daily_rate: number;
      estimated_cost: number;
    };
  };
}

export interface DashboardStats {
  total_spaces: number;
  occupied_spaces: number;
  available_spaces: number;
  occupancy_rate: number;
  todays_bookings: number;
  pending_bookings: number;
  revenue_today: number;
  revenue_month: number;
  car_wash_pending: number;
  shuttle_trips_today: number;
}

export interface ParkingConfiguration {
  total_capacity: number;
  open_air_capacity: number;
  covered_capacity: number;
  open_air_hourly_rate: number;
  open_air_daily_rate: number;
  covered_hourly_rate: number;
  covered_daily_rate: number;
  car_wash_rates: {
    sedan: number;
    suv: number;
    mpv: number;
    hatchback: number;
    coupe: number;
  };
  grace_period_minutes: number;
  advance_booking_days: number;
  cancellation_hours: number;
}

// Form types for UI components
export interface BookingFormData {
  check_in_date: string;
  check_in_time: string;
  check_out_date: string;
  check_out_time: string;
  parking_type: ParkingSpaceType;
  vehicle_id?: number;
  new_vehicle?: {
    plate_number: string;
    car_type: CarType;
    make?: string;
    model?: string;
    color?: string;
  };
  shuttle_required: boolean;
  shuttle_terminal?: ShuttleTerminal;
  car_wash_requested: boolean;
  wash_type?: WashType;
  special_instructions?: string;
}

export interface PaymentFormData {
  payment_method: PaymentMethod;
  payment_provider: PaymentProvider;
  card_details?: {
    card_number: string;
    expiry_month: string;
    expiry_year: string;
    cvv: string;
    cardholder_name: string;
  };
  bank_fpx?: {
    bank_code: string;
  };
  ewallet?: {
    provider: string;
    phone_number?: string;
  };
}

// Filter and search types
export interface BookingFilters {
  status?: BookingStatus[];
  parking_type?: ParkingSpaceType[];
  date_from?: string;
  date_to?: string;
  customer_search?: string;
  plate_number?: string;
  shuttle_required?: boolean;
  car_wash_requested?: boolean;
}

export interface ParkingSpaceFilters {
  type?: ParkingSpaceType[];
  status?: ParkingSpaceStatus[];
  space_number?: string;
}

export interface ReportFilters {
  date_from: string;
  date_to: string;
  group_by: 'day' | 'week' | 'month';
  include_cancelled?: boolean;
} 