<template>
  <div class="space-y-8 p-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Booking Management</h1>
        <p class="text-muted-foreground">
          Manage all parking reservations and bookings
        </p>
      </div>
      <Button @click="createBooking">
        <PlusIcon class="w-4 h-4 mr-2" />
        Create Booking
      </Button>
    </div>

    <!-- Filters -->
    <Card>
      <CardContent class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label for="status">Status</Label>
            <select v-model="filters.status" class="w-full border rounded px-2 py-1">
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="checked_in">Checked In</option>
              <option value="checked_out">Checked Out</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <Label for="type">Parking Type</Label>
            <select v-model="filters.parking_type" class="w-full border rounded px-2 py-1">
              <option value="">All Types</option>
              <option value="open_air">Open Air</option>
              <option value="covered">Covered</option>
            </select>
          </div>
          <div class="flex items-end">
            <Button variant="ghost" size="sm" @click="showAdvanced = !showAdvanced">
              <CalendarIcon class="w-4 h-4 mr-1" />
              {{ showAdvanced ? 'Hide' : 'Show' }} Advanced Filters
            </Button>
          </div>
        </div>
        <div v-if="showAdvanced" class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <Label for="date-from">Date From</Label>
            <Input id="date-from" v-model="filters.date_from" type="date" />
          </div>
          <div>
            <Label for="date-to">Date To</Label>
            <Input id="date-to" v-model="filters.date_to" type="date" />
          </div>
        </div>
        <div class="flex gap-2 mt-4">
          <Button @click="applyFilters">
            <SearchIcon class="w-4 h-4 mr-2" />
            Apply Filters
          </Button>
          <Button variant="outline" @click="clearFilters">
            <XIcon class="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- Bookings Table -->
    <Card>
      <CardHeader>
        <CardTitle>All Bookings</CardTitle>
        <CardDescription>
          {{ filteredBookings.length }} bookings found
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="overflow-x-auto">
          <table class="min-w-full border text-sm">
            <thead>
              <tr class="bg-muted">
                <th class="px-4 py-3 text-left">Reference</th>
                <th class="px-4 py-3 text-left">Customer</th>
                <th class="px-4 py-3 text-left">Plate</th>
                <th class="px-4 py-3 text-left">Check-in</th>
                <th class="px-4 py-3 text-left">Check-out</th>
                <th class="px-4 py-3 text-left">Type</th>
                <th class="px-4 py-3 text-left">Status</th>
                <th class="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="booking in filteredBookings" :key="booking.id" class="border-b hover:bg-muted/50">
                <td class="px-4 py-3 font-mono">{{ booking.booking_reference }}</td>
                <td class="px-4 py-3">{{ booking.customer?.fullname || 'Customer' }}</td>
                <td class="px-4 py-3">{{ booking.vehicle?.plate_number }}</td>
                <td class="px-4 py-3">{{ formatDate(booking.scheduled_check_in) }}</td>
                <td class="px-4 py-3">{{ formatDate(booking.scheduled_check_out) }}</td>
                <td class="px-4 py-3 capitalize">{{ booking.parking_type }}</td>
                <td class="px-4 py-3">
                  <Badge :variant="getStatusVariant(booking.status)">
                    {{ booking.status }}
                  </Badge>
                </td>
                <td class="px-4 py-3 flex gap-2">
                  <Button size="xs" variant="outline" @click="viewBooking(booking)">View</Button>
                  <Button size="xs" variant="destructive" @click="deleteBooking(booking)">Delete</Button>
                </td>
              </tr>
              <tr v-if="filteredBookings.length === 0">
                <td colspan="8" class="text-center py-12 text-muted-foreground">
                  <div class="flex flex-col items-center gap-2">
                    <span>No bookings found</span>
                    <Button variant="default" @click="createBooking">
                      <PlusIcon class="w-4 h-4 mr-2" /> Create your first booking
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { PlusIcon, SearchIcon, XIcon, CalendarIcon } from 'lucide-vue-next';
import type { Booking } from '@/types/carpark';

const router = useRouter();
const showAdvanced = ref(false);
const filters = ref({
  status: '',
  parking_type: '',
  date_from: '',
  date_to: ''
});

const bookings = ref<Booking[]>([{
  id: 1,
  booking_reference: 'BK001',
  status: 'confirmed',
  scheduled_check_in: new Date().toISOString(),
  scheduled_check_out: new Date(Date.now() + 86400000).toISOString(),
  total_amount: 45.50,
  base_amount: 40.00,
  service_amount: 5.50,
  currency: 'MYR',
  parking_type: 'open_air',
  customer_id: 1,
  vehicle_id: 1,
  shuttle_required: false,
  car_wash_requested: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  customer: { id: 1, fullname: 'Ahmad Rahman', email: 'ahmad@example.com' },
  vehicle: { id: 1, customer_id: 1, plate_number: 'ABC1234', car_type: 'sedan', is_default: true, created_at: '', updated_at: '' },
}, {
  id: 2,
  booking_reference: 'BK002',
  status: 'checked_in',
  scheduled_check_in: new Date(Date.now() - 3600000).toISOString(),
  scheduled_check_out: new Date(Date.now() + 7200000).toISOString(),
  total_amount: 67.00,
  base_amount: 60.00,
  service_amount: 7.00,
  currency: 'MYR',
  parking_type: 'covered',
  customer_id: 2,
  vehicle_id: 2,
  shuttle_required: true,
  car_wash_requested: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  customer: { id: 2, fullname: 'Sarah Lee', email: 'sarah@example.com' },
  vehicle: { id: 2, customer_id: 2, plate_number: 'XYZ5678', car_type: 'suv', is_default: true, created_at: '', updated_at: '' },
}]);

const filteredBookings = computed(() => {
  return bookings.value.filter(b => {
    const statusMatch = !filters.value.status || b.status === filters.value.status;
    const typeMatch = !filters.value.parking_type || b.parking_type === filters.value.parking_type;
    const fromMatch = !filters.value.date_from || b.scheduled_check_in >= filters.value.date_from;
    const toMatch = !filters.value.date_to || b.scheduled_check_out <= filters.value.date_to;
    return statusMatch && typeMatch && fromMatch && toMatch;
  });
});

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString('en-MY', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}
function getStatusVariant(status: string) {
  switch (status) {
    case 'confirmed': return 'default';
    case 'checked_in': return 'secondary';
    case 'pending': return 'outline';
    case 'cancelled': return 'destructive';
    default: return 'outline';
  }
}
function applyFilters() {}
function clearFilters() {
  filters.value = { status: '', parking_type: '', date_from: '', date_to: '' };
}
function createBooking() {
  router.push({ name: 'admin-carpark-booking-create' });
}
function viewBooking(booking: Booking) {
  router.push({ name: 'admin-carpark-booking-detail', params: { id: booking.id } });
}
function deleteBooking(booking: Booking) {
  if (confirm('Are you sure you want to delete this booking?')) {
    bookings.value = bookings.value.filter(b => b.id !== booking.id);
  }
}
</script> 