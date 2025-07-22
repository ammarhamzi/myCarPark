import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { 
  ParkingSpace, 
  Booking, 
  Vehicle, 
  DashboardStats, 
  ParkingConfiguration,
  AvailabilityRequest,
  AvailabilityResponse,
  CreateBookingRequest,
  BookingResponse,
  BookingFilters,
  ParkingSpaceFilters
} from '@/types/carpark';
import { apiPost, apiGet, apiPut, apiDelete } from '@/services/api';

export const useParkingStore = defineStore('parking', () => {
  // State
  const spaces = ref<ParkingSpace[]>([]);
  const bookings = ref<Booking[]>([]);
  const currentBooking = ref<Booking | null>(null);
  const vehicles = ref<Vehicle[]>([]);
  const config = ref<ParkingConfiguration | null>(null);
  const dashboardStats = ref<DashboardStats | null>(null);
  
  // Loading states
  const isLoading = ref(false);
  const isBookingLoading = ref(false);
  const isConfigLoading = ref(false);
  
  // Error state
  const error = ref<string | null>(null);
  
  // Computed getters
  const availableSpaces = computed(() => 
    spaces.value.filter(space => space.status === 'available' && space.is_active)
  );
  
  const occupiedSpaces = computed(() => 
    spaces.value.filter(space => space.status === 'occupied')
  );
  
  const openAirSpaces = computed(() => 
    spaces.value.filter(space => space.type === 'open_air')
  );
  
  const coveredSpaces = computed(() => 
    spaces.value.filter(space => space.type === 'covered')
  );
  
  const activeBookings = computed(() => 
    bookings.value.filter(booking => 
      ['pending', 'confirmed', 'checked_in'].includes(booking.status)
    )
  );
  
  const todaysBookings = computed(() => {
    const today = new Date().toISOString().split('T')[0];
    return bookings.value.filter(booking => 
      booking.scheduled_check_in.startsWith(today)
    );
  });
  
  // Robust mock system for bookings
  const USE_MOCK_BOOKINGS = true; // Set to false to use real API

  const MOCK_BOOKINGS: Booking[] = [
    {
      id: 1,
      booking_reference: 'ABC123',
      customer_id: 101,
      space_id: 5,
      vehicle_id: 201,
      scheduled_check_in: '2024-07-01T10:00:00Z',
      scheduled_check_out: '2024-07-01T18:00:00Z',
      parking_type: 'covered',
      base_amount: 20,
      service_amount: 5,
      total_amount: 25,
      currency: 'USD',
      status: 'confirmed',
      shuttle_required: true,
      shuttle_terminal: 'T1',
      car_wash_requested: false,
      special_instructions: 'Please park near the elevator.',
      admin_notes: 'VIP customer',
      created_at: '2024-06-20T09:00:00Z',
      updated_at: '2024-06-20T09:00:00Z',
      customer: {
        id: 101,
        fullname: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
      },
      vehicle: {
        id: 201,
        customer_id: 101,
        plate_number: 'XYZ 1234',
        car_type: 'sedan',
        make: 'Toyota',
        model: 'Camry',
        color: 'Black',
        is_default: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        customer: {
          id: 101,
          fullname: 'John Doe',
          email: 'john@example.com',
        },
      },
      parking_space: {
        id: 5,
        space_number: 'A-05',
        type: 'covered',
        status: 'available',
        hourly_rate: 2.5,
        daily_rate: 20,
        is_active: true,
        notes: 'Near entrance',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    },
    {
      id: 2,
      booking_reference: 'DEF456',
      customer_id: 102,
      space_id: 6,
      vehicle_id: 202,
      scheduled_check_in: '2024-07-02T09:00:00Z',
      scheduled_check_out: '2024-07-02T17:00:00Z',
      parking_type: 'open_air',
      base_amount: 15,
      service_amount: 0,
      total_amount: 15,
      currency: 'USD',
      status: 'pending',
      shuttle_required: false,
      car_wash_requested: true,
      special_instructions: '',
      admin_notes: '',
      created_at: '2024-06-21T08:00:00Z',
      updated_at: '2024-06-21T08:00:00Z',
      customer: {
        id: 102,
        fullname: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1987654321',
      },
      vehicle: {
        id: 202,
        customer_id: 102,
        plate_number: 'ABC 5678',
        car_type: 'suv',
        make: 'Honda',
        model: 'CR-V',
        color: 'White',
        is_default: true,
        created_at: '2024-01-02T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
        customer: {
          id: 102,
          fullname: 'Jane Smith',
          email: 'jane@example.com',
        },
      },
      parking_space: {
        id: 6,
        space_number: 'B-10',
        type: 'open_air',
        status: 'available',
        hourly_rate: 2.0,
        daily_rate: 15,
        is_active: true,
        notes: '',
        created_at: '2024-01-02T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
      },
    },
  ];
  
  // Robust mock system for parking spaces
  const USE_MOCK_SPACES = true; // Set to false to use real API

  const MOCK_SPACES: ParkingSpace[] = [
    {
      id: 1,
      space_number: 'A-01',
      type: 'covered',
      status: 'available',
      hourly_rate: 2.5,
      daily_rate: 20,
      is_active: true,
      notes: 'Near entrance',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 2,
      space_number: 'A-02',
      type: 'covered',
      status: 'occupied',
      hourly_rate: 2.5,
      daily_rate: 20,
      is_active: true,
      notes: '',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 3,
      space_number: 'B-01',
      type: 'open_air',
      status: 'maintenance',
      hourly_rate: 2.0,
      daily_rate: 15,
      is_active: false,
      notes: 'Needs repair',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 4,
      space_number: 'B-02',
      type: 'open_air',
      status: 'reserved',
      hourly_rate: 2.0,
      daily_rate: 15,
      is_active: true,
      notes: 'Reserved for VIP',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
  ];
  
  // Actions
  
  /**
   * Load all parking spaces
   */
  const loadSpaces = async (filters?: ParkingSpaceFilters) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      if (USE_MOCK_SPACES) {
        spaces.value = MOCK_SPACES;
        return;
      }
      const endpoint = '/parking/spaces';
      const response = filters 
        ? await apiPost<ParkingSpace[]>(`${endpoint}/search`, filters)
        : await apiGet<ParkingSpace[]>(endpoint);
      if (Array.isArray(response.data) && response.data.length > 0) {
        spaces.value = response.data;
      } else {
        spaces.value = MOCK_SPACES;
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to load parking spaces';
      console.error('Error loading spaces:', err);
      spaces.value = MOCK_SPACES;
    } finally {
      isLoading.value = false;
    }
  };
  
  /**
   * Load bookings with optional filtering
   */
  const loadBookings = async (filters?: BookingFilters) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      if (USE_MOCK_BOOKINGS) {
        bookings.value = MOCK_BOOKINGS;
        return;
      }
      const endpoint = '/parking/bookings';
      const response = filters 
        ? await apiPost<Booking[]>(`${endpoint}/search`, filters)
        : await apiGet<Booking[]>(endpoint);
      
      if (Array.isArray(response.data) && response.data.length > 0) {
        bookings.value = response.data;
      } else {
        bookings.value = MOCK_BOOKINGS;
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to load bookings';
      console.error('Error loading bookings:', err);
      bookings.value = MOCK_BOOKINGS;
    } finally {
      isLoading.value = false;
    }
  };
  
  /**
   * Load dashboard statistics
   */
  const loadDashboardStats = async () => {
    try {
      const response = await apiGet<DashboardStats>('/parking/dashboard-stats');
      dashboardStats.value = response.data;
    } catch (err: any) {
      console.error('Error loading dashboard stats:', err);
    }
  };
  
  /**
   * Check availability for given dates and parking type
   */
  const checkAvailability = async (request: AvailabilityRequest): Promise<AvailabilityResponse | null> => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await apiPost<AvailabilityResponse>('/parking/availability', request);
      return response.data;
    } catch (err: any) {
      error.value = err.message || 'Failed to check availability';
      console.error('Error checking availability:', err);
      return null;
    } finally {
      isLoading.value = false;
    }
  };
  
  /**
   * Create a new booking
   */
  const createBooking = async (request: CreateBookingRequest): Promise<BookingResponse | null> => {
    isBookingLoading.value = true;
    error.value = null;
    
    try {
      const response = await apiPost<BookingResponse>('/parking/bookings', request);
      
      // Add the new booking to our store
      if (response.data.booking) {
        bookings.value.unshift(response.data.booking);
        currentBooking.value = response.data.booking;
      }
      
      // Refresh spaces to update availability
      await loadSpaces();
      
      return response.data;
    } catch (err: any) {
      error.value = err.message || 'Failed to create booking';
      console.error('Error creating booking:', err);
      return null;
    } finally {
      isBookingLoading.value = false;
    }
  };
  
  /**
   * Update an existing booking
   */
  const updateBooking = async (id: number, updates: Partial<Booking>): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await apiPut<Booking>(`/parking/bookings/${id}`, updates);
      
      // Update the booking in our store
      const index = bookings.value.findIndex(b => b.id === id);
      if (index !== -1) {
        bookings.value[index] = { ...bookings.value[index], ...response.data };
      }
      
      // Update current booking if it's the same one
      if (currentBooking.value?.id === id) {
        currentBooking.value = { ...currentBooking.value, ...response.data };
      }
      
      return true;
    } catch (err: any) {
      error.value = err.message || 'Failed to update booking';
      console.error('Error updating booking:', err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };
  
  /**
   * Cancel a booking
   */
  const cancelBooking = async (id: number, reason?: string): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;
    
    try {
      await apiPut(`/parking/bookings/${id}/cancel`, { reason });
      
      // Update the booking status in our store
      const index = bookings.value.findIndex(b => b.id === id);
      if (index !== -1) {
        bookings.value[index].status = 'cancelled';
      }
      
      // Refresh spaces to update availability
      await loadSpaces();
      
      return true;
    } catch (err: any) {
      error.value = err.message || 'Failed to cancel booking';
      console.error('Error cancelling booking:', err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };
  
  /**
   * Check in a booking
   */
  const checkInBooking = async (id: number, spaceId?: number): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await apiPut<Booking>(`/parking/bookings/${id}/checkin`, { 
        space_id: spaceId,
        actual_check_in: new Date().toISOString()
      });
      
      // Update the booking in our store
      const index = bookings.value.findIndex(b => b.id === id);
      if (index !== -1) {
        bookings.value[index] = response.data;
      }
      
      // Refresh spaces and stats
      await Promise.all([loadSpaces(), loadDashboardStats()]);
      
      return true;
    } catch (err: any) {
      error.value = err.message || 'Failed to check in';
      console.error('Error checking in:', err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };
  
  /**
   * Check out a booking
   */
  const checkOutBooking = async (id: number): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await apiPut<Booking>(`/parking/bookings/${id}/checkout`, { 
        actual_check_out: new Date().toISOString()
      });
      
      // Update the booking in our store
      const index = bookings.value.findIndex(b => b.id === id);
      if (index !== -1) {
        bookings.value[index] = response.data;
      }
      
      // Refresh spaces and stats
      await Promise.all([loadSpaces(), loadDashboardStats()]);
      
      return true;
    } catch (err: any) {
      error.value = err.message || 'Failed to check out';
      console.error('Error checking out:', err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };
  
  /**
   * Load user's vehicles
   */
  const loadUserVehicles = async (userId?: number) => {
    try {
      const endpoint = userId ? `/parking/vehicles?user_id=${userId}` : '/parking/vehicles/my';
      const response = await apiGet<Vehicle[]>(endpoint);
      vehicles.value = response.data;
    } catch (err: any) {
      console.error('Error loading vehicles:', err);
    }
  };
  
  /**
   * Add a new vehicle
   */
  const addVehicle = async (vehicle: Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>): Promise<boolean> => {
    try {
      const response = await apiPost<Vehicle>('/parking/vehicles', vehicle);
      vehicles.value.push(response.data);
      return true;
    } catch (err: any) {
      error.value = err.message || 'Failed to add vehicle';
      console.error('Error adding vehicle:', err);
      return false;
    }
  };
  
  /**
   * Load parking configuration
   */
  const loadConfig = async () => {
    isConfigLoading.value = true;
    
    try {
      const response = await apiGet<ParkingConfiguration>('/parking/config');
      config.value = response.data;
    } catch (err: any) {
      console.error('Error loading config:', err);
    } finally {
      isConfigLoading.value = false;
    }
  };
  
  /**
   * Update parking configuration (admin only)
   */
  const updateConfig = async (newConfig: Partial<ParkingConfiguration>): Promise<boolean> => {
    isConfigLoading.value = true;
    error.value = null;
    
    try {
      const response = await apiPut<ParkingConfiguration>('/parking/config', newConfig);
      config.value = response.data;
      return true;
    } catch (err: any) {
      error.value = err.message || 'Failed to update configuration';
      console.error('Error updating config:', err);
      return false;
    } finally {
      isConfigLoading.value = false;
    }
  };
  
  /**
   * Get booking by ID
   */
  const getBookingById = (id: number): Booking | undefined => {
    return bookings.value.find(booking => booking.id === id);
  };
  
  /**
   * Get space by ID
   */
  const getSpaceById = (id: number): ParkingSpace | undefined => {
    return spaces.value.find(space => space.id === id);
  };
  
  /**
   * Clear all data (for logout)
   */
  const clearData = () => {
    spaces.value = [];
    bookings.value = [];
    currentBooking.value = null;
    vehicles.value = [];
    config.value = null;
    dashboardStats.value = null;
    error.value = null;
  };
  
  return {
    // State
    spaces,
    bookings,
    currentBooking,
    vehicles,
    config,
    dashboardStats,
    isLoading,
    isBookingLoading,
    isConfigLoading,
    error,
    
    // Computed
    availableSpaces,
    occupiedSpaces,
    openAirSpaces,
    coveredSpaces,
    activeBookings,
    todaysBookings,
    
    // Actions
    loadSpaces,
    loadBookings,
    loadDashboardStats,
    checkAvailability,
    createBooking,
    updateBooking,
    cancelBooking,
    checkInBooking,
    checkOutBooking,
    loadUserVehicles,
    addVehicle,
    loadConfig,
    updateConfig,
    getBookingById,
    getSpaceById,
    clearData
  };
}); 