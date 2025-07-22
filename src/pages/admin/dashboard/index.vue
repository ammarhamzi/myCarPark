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
import { ref } from 'vue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, ParkingCircle, CalendarCheck, DollarSign, Plus } from 'lucide-vue-next';

// Mock stats
const stats = ref({
  totalSpaces: 100,
  occupiedSpaces: 68,
  availableSpaces: 32,
  todaysBookings: 24,
  revenue: '$2,450',
});

// Mock recent activity
const recentActivity = ref([
  { type: 'checkin', user: 'John Doe', space: 'A-01', time: '10 min ago' },
  { type: 'checkout', user: 'Jane Smith', space: 'B-02', time: '30 min ago' },
  { type: 'booking', user: 'Alice Lee', space: 'A-05', time: '1 hour ago' },
]);
</script> 