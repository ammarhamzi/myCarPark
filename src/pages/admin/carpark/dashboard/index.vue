<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Car Park Dashboard</h1>
        <p class="text-muted-foreground">
          Real-time overview of parking operations
        </p>
      </div>
      <div class="flex items-center space-x-2">
        <Button variant="outline" @click="refreshData">
          <RefreshCwIcon class="w-4 h-4 mr-2" />
          Refresh
        </Button>
        <Button @click="createManualBooking">
          <PlusIcon class="w-4 h-4 mr-2" />
          Manual Booking
        </Button>
      </div>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <CarIcon class="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-muted-foreground">Total Spaces</p>
              <p class="text-2xl font-bold">{{ stats?.total_spaces || 150 }}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-6">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <CheckCircleIcon class="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-muted-foreground">Available</p>
              <p class="text-2xl font-bold">{{ stats?.available_spaces || 85 }}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-6">
          <div class="flex items-center">
            <div class="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <TrendingUpIcon class="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-muted-foreground">Occupancy Rate</p>
              <p class="text-2xl font-bold">{{ Math.round((stats?.occupancy_rate || 0.43) * 100) }}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-6">
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <DollarSignIcon class="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-muted-foreground">Today's Revenue</p>
              <p class="text-2xl font-bold">{{ formatCurrency(stats?.revenue_today || 1250) }}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Main Dashboard Content -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <!-- Left Column - Main Content -->
      <div class="xl:col-span-2 space-y-6">
        <!-- Today's Check-in List -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <LogInIcon class="w-5 h-5 text-green-600" />
              Today's Check-ins
              <Badge variant="secondary" class="ml-auto">{{ todaysCheckins.length }}</Badge>
            </CardTitle>
            <CardDescription>Vehicles that checked in today</CardDescription>
          </CardHeader>
          <CardContent>
            <div v-if="todaysCheckins.length === 0" class="text-center py-8 text-muted-foreground">
              <LogInIcon class="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No check-ins today</p>
            </div>
            <div v-else class="space-y-3">
              <div 
                v-for="booking in todaysCheckins" 
                :key="booking.id"
                class="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                @click="viewBookingDetails(booking)"
              >
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <CarIcon class="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p class="font-medium">{{ booking.vehicle?.plate_number || 'N/A' }}</p>
                    <p class="text-sm text-muted-foreground">
                      {{ booking.customer?.fullname || 'Customer' }}
                    </p>
                    <p class="text-xs text-muted-foreground">
                      Checked in: {{ formatTime(booking.actual_check_in) }}
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <Badge variant="default" class="mb-1">Checked In</Badge>
                  <p class="text-sm font-medium">
                    {{ formatCurrency(booking.total_amount) }}
                  </p>
                  <p class="text-xs text-muted-foreground">
                    Space {{ booking.parking_space?.space_number || 'N/A' }}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Today's Check-out List -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <LogOutIcon class="w-5 h-5 text-blue-600" />
              Today's Check-outs
              <Badge variant="secondary" class="ml-auto">{{ todaysCheckouts.length }}</Badge>
            </CardTitle>
            <CardDescription>Vehicles that checked out today</CardDescription>
          </CardHeader>
          <CardContent>
            <div v-if="todaysCheckouts.length === 0" class="text-center py-8 text-muted-foreground">
              <LogOutIcon class="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No check-outs today</p>
            </div>
            <div v-else class="space-y-3">
              <div 
                v-for="booking in todaysCheckouts" 
                :key="booking.id"
                class="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                @click="viewBookingDetails(booking)"
              >
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <CarIcon class="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p class="font-medium">{{ booking.vehicle?.plate_number || 'N/A' }}</p>
                    <p class="text-sm text-muted-foreground">
                      {{ booking.customer?.fullname || 'Customer' }}
                    </p>
                    <p class="text-xs text-muted-foreground">
                      Checked out: {{ formatTime(booking.actual_check_out) }}
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <Badge variant="secondary" class="mb-1">Checked Out</Badge>
                  <p class="text-sm font-medium">
                    {{ formatCurrency(booking.total_amount) }}
                  </p>
                  <p class="text-xs text-muted-foreground">
                    Duration: {{ calculateDuration(booking.actual_check_in, booking.actual_check_out) }}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Recent Bookings -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <CalendarIcon class="w-5 h-5 text-purple-600" />
              Recent Bookings
            </CardTitle>
            <CardDescription>Latest parking reservations and activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-3">
              <div 
                v-for="booking in recentBookings" 
                :key="booking.id"
                class="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                @click="viewBookingDetails(booking)"
              >
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                    <CalendarIcon class="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p class="font-medium">{{ booking.booking_reference }}</p>
                    <p class="text-sm text-muted-foreground">
                      {{ booking.customer?.fullname || 'Customer' }}
                    </p>
                    <p class="text-xs text-muted-foreground">
                      {{ formatDateTime(booking.scheduled_check_in) }}
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <Badge :variant="getBookingStatusVariant(booking.status)">
                    {{ booking.status.replace('_', ' ') }}
                  </Badge>
                  <p class="text-sm font-medium mt-1">
                    {{ formatCurrency(booking.total_amount) }}
                  </p>
                  <p class="text-xs text-muted-foreground">
                    {{ booking.parking_type?.replace('_', ' ') || 'N/A' }}
                  </p>
                </div>
              </div>
            </div>
            
            <Button variant="link" class="w-full mt-4" @click="goToBookings">
              View All Bookings
            </Button>
          </CardContent>
        </Card>
      </div>

      <!-- Right Column - Sidebar -->
      <div class="space-y-6">
        <!-- Revenue Overview -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <BarChartIcon class="w-5 h-5 text-green-600" />
              Revenue Overview
            </CardTitle>
            <CardDescription>Last 7 days performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div 
                v-for="day in revenueData" 
                :key="day.date"
                class="flex items-center justify-between"
              >
                <span class="text-sm font-medium">{{ day.date }}</span>
                <div class="flex items-center gap-2">
                  <div 
                    class="h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded"
                    :style="{ width: `${(day.amount / maxRevenue) * 120}px` }"
                  ></div>
                  <span class="text-sm font-medium w-16 text-right">
                    {{ formatCurrency(day.amount) }}
                  </span>
                </div>
              </div>
            </div>
            
            <div class="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border">
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium text-muted-foreground">Weekly Total</span>
                <span class="text-lg font-bold text-green-600">{{ formatCurrency(weeklyTotal) }}</span>
              </div>
              <div class="flex justify-between items-center mt-2">
                <span class="text-xs text-muted-foreground">Daily Average</span>
                <span class="text-sm font-medium">{{ formatCurrency(weeklyTotal / 7) }}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Quick Actions -->
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent class="space-y-2">
            <Button variant="outline" class="w-full justify-start" @click="goToBookings">
              <CalendarIcon class="w-4 h-4 mr-2" />
              Manage Bookings
            </Button>
            <Button variant="outline" class="w-full justify-start" @click="goToSpaces">
              <SettingsIcon class="w-4 h-4 mr-2" />
              Parking Spaces
            </Button>
            <Button variant="outline" class="w-full justify-start" @click="goToShuttle">
              <BusIcon class="w-4 h-4 mr-2" />
              Shuttle Management
            </Button>
            <Button variant="outline" class="w-full justify-start" @click="goToReports">
              <BarChartIcon class="w-4 h-4 mr-2" />
              View Reports
            </Button>
          </CardContent>
        </Card>

        <!-- Pending Actions -->
        <Card>
          <CardHeader>
            <CardTitle>Pending Actions</CardTitle>
          </CardHeader>
          <CardContent class="space-y-3">
            <div class="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div class="flex items-center">
                <ClockIcon class="w-4 h-4 text-yellow-600 mr-2" />
                <span class="text-sm">Check-ins pending</span>
              </div>
              <Badge variant="secondary">{{ stats?.pending_bookings || 3 }}</Badge>
            </div>
            
            <div class="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div class="flex items-center">
                <SparklesIcon class="w-4 h-4 text-blue-600 mr-2" />
                <span class="text-sm">Car wash orders</span>
              </div>
              <Badge variant="secondary">{{ stats?.car_wash_pending || 2 }}</Badge>
            </div>
            
            <div class="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div class="flex items-center">
                <BusIcon class="w-4 h-4 text-green-600 mr-2" />
                <span class="text-sm">Shuttle trips today</span>
              </div>
              <Badge variant="secondary">{{ stats?.shuttle_trips_today || 12 }}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CarIcon,
  CheckCircleIcon,
  TrendingUpIcon,
  DollarSignIcon,
  RefreshCwIcon,
  PlusIcon,
  ClockIcon,
  SparklesIcon,
  BusIcon,
  CalendarIcon,
  SettingsIcon,
  BarChartIcon,
  LogInIcon,
  LogOutIcon
} from 'lucide-vue-next';
import { useParkingStore } from '@/stores/parking';
import type { DashboardStats, Booking, ParkingSpace } from '@/types/carpark';

const router = useRouter();
const parkingStore = useParkingStore();

// State
const isLoading = ref(false);
const stats = ref<DashboardStats | null>(null);

// Mock data for demonstration
const mockSpaces = ref(
  Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    space_number: `A${String(i + 1).padStart(2, '0')}`,
    status: Math.random() > 0.6 ? 'available' : 
           Math.random() > 0.8 ? 'maintenance' :
           Math.random() > 0.5 ? 'reserved' : 'occupied',
    type: Math.random() > 0.7 ? 'covered' : 'open_air'
  }))
);

// Mock data for today's check-ins
const todaysCheckins = ref([
  {
    id: 1,
    booking_reference: 'BK001',
    status: 'checked_in',
    actual_check_in: new Date().toISOString(),
    total_amount: 45.50,
    customer: { fullname: 'Ahmad Rahman' },
    vehicle: { plate_number: 'ABC 1234' },
    parking_space: { space_number: 'A-01' }
  },
  {
    id: 2,
    booking_reference: 'BK002', 
    status: 'checked_in',
    actual_check_in: new Date(Date.now() - 3600000).toISOString(),
    total_amount: 67.00,
    customer: { fullname: 'Sarah Lee' },
    vehicle: { plate_number: 'XYZ 5678' },
    parking_space: { space_number: 'B-03' }
  },
  {
    id: 3,
    booking_reference: 'BK003',
    status: 'checked_in',
    actual_check_in: new Date(Date.now() - 7200000).toISOString(),
    total_amount: 32.25,
    customer: { fullname: 'David Tan' },
    vehicle: { plate_number: 'DEF 9012' },
    parking_space: { space_number: 'A-05' }
  }
]);

// Mock data for today's check-outs
const todaysCheckouts = ref([
  {
    id: 4,
    booking_reference: 'BK004',
    status: 'checked_out',
    actual_check_in: new Date(Date.now() - 28800000).toISOString(),
    actual_check_out: new Date(Date.now() - 3600000).toISOString(),
    total_amount: 89.75,
    customer: { fullname: 'Maria Garcia' },
    vehicle: { plate_number: 'GHI 3456' },
    parking_space: { space_number: 'C-02' }
  },
  {
    id: 5,
    booking_reference: 'BK005',
    status: 'checked_out',
    actual_check_in: new Date(Date.now() - 21600000).toISOString(),
    actual_check_out: new Date(Date.now() - 7200000).toISOString(),
    total_amount: 56.00,
    customer: { fullname: 'John Smith' },
    vehicle: { plate_number: 'JKL 7890' },
    parking_space: { space_number: 'B-01' }
  }
]);

const recentBookings = ref([
  {
    id: 6,
    booking_reference: 'BK006',
    status: 'confirmed',
    scheduled_check_in: new Date(Date.now() + 1800000).toISOString(),
    total_amount: 45.50,
    customer: { fullname: 'Ahmad Rahman' },
    parking_type: 'covered'
  },
  {
    id: 7,
    booking_reference: 'BK007', 
    status: 'checked_in',
    scheduled_check_in: new Date(Date.now() - 3600000).toISOString(),
    total_amount: 67.00,
    customer: { fullname: 'Sarah Lee' },
    parking_type: 'open_air'
  },
  {
    id: 8,
    booking_reference: 'BK008',
    status: 'pending',
    scheduled_check_in: new Date(Date.now() + 3600000).toISOString(),
    total_amount: 32.25,
    customer: { fullname: 'David Tan' },
    parking_type: 'covered'
  },
  {
    id: 9,
    booking_reference: 'BK009',
    status: 'checked_out',
    scheduled_check_in: new Date(Date.now() - 7200000).toISOString(),
    total_amount: 78.90,
    customer: { fullname: 'Lisa Wong' },
    parking_type: 'open_air'
  }
]);

const revenueData = ref([
  { date: 'Mon', amount: 1250 },
  { date: 'Tue', amount: 1450 },
  { date: 'Wed', amount: 1120 },
  { date: 'Thu', amount: 1680 },
  { date: 'Fri', amount: 1890 },
  { date: 'Sat', amount: 2100 },
  { date: 'Sun', amount: 1750 }
]);

// Computed
const maxRevenue = computed(() => Math.max(...revenueData.value.map(d => d.amount)));
const weeklyTotal = computed(() => revenueData.value.reduce((sum, d) => sum + d.amount, 0));

// Methods
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ms-MY', {
    style: 'currency',
    currency: 'MYR'
  }).format(amount);
};

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-MY', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('en-MY', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const calculateDuration = (checkIn: string, checkOut: string) => {
  const duration = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  const hours = Math.floor(duration / (1000 * 60 * 60));
  const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
};

const getBookingStatusVariant = (status: string) => {
  switch (status) {
    case 'confirmed': return 'default';
    case 'checked_in': return 'secondary';
    case 'checked_out': return 'outline';
    case 'pending': return 'outline';
    case 'cancelled': return 'destructive';
    default: return 'outline';
  }
};

const refreshData = async () => {
  isLoading.value = true;
  try {
    await Promise.all([
      parkingStore.loadDashboardStats(),
      parkingStore.loadBookings(),
      parkingStore.loadSpaces()
    ]);
    stats.value = parkingStore.dashboardStats;
  } catch (error) {
    console.error('Error refreshing data:', error);
  } finally {
    isLoading.value = false;
  }
};

const createManualBooking = () => {
  router.push({ name: 'admin-carpark-booking-create' });
};

const viewBookingDetails = (booking: any) => {
  router.push({ 
    name: 'admin-carpark-booking-detail', 
    params: { id: booking.id } 
  });
};

const goToBookings = () => {
  router.push({ name: 'admin-carpark-bookings' });
};

const goToSpaces = () => {
  router.push({ name: 'admin-carpark-spaces' });
};

const goToShuttle = () => {
  router.push({ name: 'admin-carpark-shuttle' });
};

const goToReports = () => {
  router.push({ name: 'admin-carpark-reports' });
};

// Lifecycle
onMounted(async () => {
  await refreshData();
});
</script> 