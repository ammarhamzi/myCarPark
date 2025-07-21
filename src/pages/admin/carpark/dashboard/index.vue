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

    <!-- Real-time Status and Actions -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Current Status -->
      <div class="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Parking Space Status</CardTitle>
            <CardDescription>Real-time view of all parking spaces</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-10 gap-2">
              <div 
                v-for="space in mockSpaces" 
                :key="space.id"
                class="aspect-square rounded border-2 flex items-center justify-center text-xs font-medium cursor-pointer transition-colors"
                :class="getSpaceStatusClass(space.status)"
                @click="viewSpaceDetails(space)"
                :title="`Space ${space.space_number} - ${space.status}`"
              >
                {{ space.space_number }}
              </div>
            </div>
            
            <!-- Legend -->
            <div class="flex flex-wrap gap-4 mt-4 text-sm">
              <div class="flex items-center">
                <div class="w-4 h-4 bg-green-500 rounded mr-2"></div>
                <span>Available</span>
              </div>
              <div class="flex items-center">
                <div class="w-4 h-4 bg-red-500 rounded mr-2"></div>
                <span>Occupied</span>
              </div>
              <div class="flex items-center">
                <div class="w-4 h-4 bg-blue-500 rounded mr-2"></div>
                <span>Reserved</span>
              </div>
              <div class="flex items-center">
                <div class="w-4 h-4 bg-gray-500 rounded mr-2"></div>
                <span>Maintenance</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Quick Actions -->
      <div class="space-y-6">
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
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Bookings -->
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>Latest parking reservations</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div 
              v-for="booking in recentBookings" 
              :key="booking.id"
              class="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              @click="viewBookingDetails(booking)"
            >
              <div>
                <p class="font-medium">{{ booking.booking_reference }}</p>
                <p class="text-sm text-muted-foreground">
                  {{ booking.customer?.fullname || 'Customer' }}
                </p>
                <p class="text-xs text-muted-foreground">
                  {{ formatDateTime(booking.scheduled_check_in) }}
                </p>
              </div>
              <div class="text-right">
                <Badge :variant="getBookingStatusVariant(booking.status)">
                  {{ booking.status }}
                </Badge>
                <p class="text-sm font-medium mt-1">
                  {{ formatCurrency(booking.total_amount) }}
                </p>
              </div>
            </div>
          </div>
          
          <Button variant="link" class="w-full mt-4" @click="goToBookings">
            View All Bookings
          </Button>
        </CardContent>
      </Card>

      <!-- Revenue Chart -->
      <Card>
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>Last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div 
              v-for="day in revenueData" 
              :key="day.date"
              class="flex items-center justify-between"
            >
              <span class="text-sm">{{ day.date }}</span>
              <div class="flex items-center">
                <div 
                  class="h-2 bg-blue-500 rounded mr-2"
                  :style="{ width: `${(day.amount / maxRevenue) * 100}px` }"
                ></div>
                <span class="text-sm font-medium w-16 text-right">
                  {{ formatCurrency(day.amount) }}
                </span>
              </div>
            </div>
          </div>
          
          <div class="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div class="flex justify-between items-center">
              <span class="text-sm text-muted-foreground">Weekly Total</span>
              <span class="font-bold">{{ formatCurrency(weeklyTotal) }}</span>
            </div>
          </div>
        </CardContent>
      </Card>
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
  BarChartIcon
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

const recentBookings = ref([
  {
    id: 1,
    booking_reference: 'BK001',
    status: 'confirmed',
    scheduled_check_in: new Date().toISOString(),
    total_amount: 45.50,
    customer: { fullname: 'Ahmad Rahman' }
  },
  {
    id: 2,
    booking_reference: 'BK002', 
    status: 'checked_in',
    scheduled_check_in: new Date(Date.now() - 3600000).toISOString(),
    total_amount: 67.00,
    customer: { fullname: 'Sarah Lee' }
  },
  {
    id: 3,
    booking_reference: 'BK003',
    status: 'pending',
    scheduled_check_in: new Date(Date.now() + 1800000).toISOString(),
    total_amount: 32.25,
    customer: { fullname: 'David Tan' }
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

const getSpaceStatusClass = (status: string) => {
  switch (status) {
    case 'available':
      return 'border-green-500 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300';
    case 'occupied':
      return 'border-red-500 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300';
    case 'reserved':
      return 'border-blue-500 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300';
    case 'maintenance':
      return 'border-gray-500 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300';
    default:
      return 'border-gray-300 bg-gray-50 dark:bg-gray-800 text-gray-500';
  }
};

const getBookingStatusVariant = (status: string) => {
  switch (status) {
    case 'confirmed': return 'default';
    case 'checked_in': return 'secondary';
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

const viewSpaceDetails = (space: any) => {
  router.push({ 
    name: 'admin-carpark-space-detail', 
    params: { id: space.id } 
  });
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