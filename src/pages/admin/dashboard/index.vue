<template>
  <div class="space-y-8 p-8">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
      <div class="flex gap-2">
        <Button variant="default">
          <Plus class="mr-2 h-4 w-4" /> Add Booking
        </Button>
        <Button variant="outline">
          <Plus class="mr-2 h-4 w-4" /> Add Space
        </Button>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">Occupancy</CardTitle>
          <ParkingCircle class="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.occupiedSpaces }}/{{ stats.totalSpaces }}</div>
          <div class="text-xs text-muted-foreground">Spaces Used</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">Available Spaces</CardTitle>
          <ParkingCircle class="h-5 w-5 text-green-500" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.availableSpaces }}</div>
          <div class="text-xs text-muted-foreground">Spaces Available</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">Today's Bookings</CardTitle>
          <CalendarCheck class="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.todaysBookings }}</div>
          <div class="text-xs text-muted-foreground">Bookings Today</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">Revenue</CardTitle>
          <DollarSign class="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.revenue }}</div>
          <div class="text-xs text-muted-foreground">This Month</div>
        </CardContent>
      </Card>
    </div>
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Today's Upcoming Check-ins</CardTitle>
        </CardHeader>
        <CardContent>
          <div v-if="isLoadingCheckins" class="py-6 text-center text-muted-foreground">Loading...</div>
          <div v-else>
            <table v-if="upcomingCheckins.length" class="min-w-full border text-sm">
              <thead>
                <tr class="bg-muted">
                  <th class="px-4 py-2 text-left">Reference</th>
                  <th class="px-4 py-2 text-left">Customer</th>
                  <th class="px-4 py-2 text-left">Plate</th>
                  <th class="px-4 py-2 text-left">Check-in Time</th>
                  <th class="px-4 py-2 text-left">Space</th>
                  <th class="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="booking in upcomingCheckins" :key="booking.id" class="border-b">
                  <td class="px-4 py-2 font-mono">{{ booking.booking_reference }}</td>
                  <td class="px-4 py-2">{{ booking.customer?.fullname || 'Customer' }}</td>
                  <td class="px-4 py-2">{{ booking.vehicle?.plate_number }}</td>
                  <td class="px-4 py-2">{{ formatDate(booking.scheduled_check_in) }}</td>
                  <td class="px-4 py-2">{{ booking.parking_space?.space_number || '-' }}</td>
                  <td class="px-4 py-2">
                    <Button size="xs" variant="default" @click="handleCheckIn(booking)">Checked In</Button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-else class="py-6 text-center text-muted-foreground">
              No upcoming check-ins for today.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ul class="divide-y divide-muted-foreground/10">
            <li v-for="(item, idx) in recentActivity" :key="idx" class="py-3 flex items-center gap-4">
              <span v-if="item.type === 'checkin'" class="inline-flex items-center text-green-600"><ParkingCircle class="h-4 w-4 mr-1" />Checked In</span>
              <span v-else-if="item.type === 'checkout'" class="inline-flex items-center text-blue-600"><ParkingCircle class="h-4 w-4 mr-1" />Checked Out</span>
              <span v-else class="inline-flex items-center text-primary"><CalendarCheck class="h-4 w-4 mr-1" />Booking</span>
              <span class="ml-2 font-medium">{{ item.user }}</span>
              <span class="ml-2 text-muted-foreground">({{ item.space }})</span>
              <span class="ml-auto text-xs text-muted-foreground">{{ item.time }}</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, ParkingCircle, CalendarCheck, DollarSign, Plus } from 'lucide-vue-next';
import { useParkingStore } from '@/stores/parking';

const stats = ref({
  totalSpaces: 100,
  occupiedSpaces: 68,
  availableSpaces: 32,
  todaysBookings: 24,
  revenue: '$2,450',
});

const recentActivity = ref([
  { type: 'checkin', user: 'John Doe', space: 'A-01', time: '10 min ago' },
  { type: 'checkout', user: 'Jane Smith', space: 'B-02', time: '30 min ago' },
  { type: 'booking', user: 'Alice Lee', space: 'A-05', time: '1 hour ago' },
]);

// --- Check-in logic ---
const parkingStore = useParkingStore();
const isLoadingCheckins = ref(false);

onMounted(async () => {
  isLoadingCheckins.value = true;
  // Load only today's confirmed bookings (upcoming check-ins)
  const today = new Date().toISOString().split('T')[0];
  await parkingStore.loadBookings({ status: ['confirmed'], date_from: today, date_to: today });
  isLoadingCheckins.value = false;
});

const upcomingCheckins = computed(() =>
  parkingStore.todaysBookings.filter(b => b.status === 'confirmed')
);

async function handleCheckIn(booking: any) {
  isLoadingCheckins.value = true;
  await parkingStore.checkInBooking(booking.id, booking.space_id);
  isLoadingCheckins.value = false;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString('en-MY', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}
</script> 