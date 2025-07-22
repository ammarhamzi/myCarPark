<script setup lang="ts">
import { ref } from 'vue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart } from 'lucide-vue-next';

const summary = ref({
  totalSpaces: 100,
  avgOccupancy: 72,
  peakOccupancy: 95,
  peakDay: 'Friday'
});

const dailyOccupancy = ref([
  { day: 'Mon', value: 65 },
  { day: 'Tue', value: 70 },
  { day: 'Wed', value: 68 },
  { day: 'Thu', value: 75 },
  { day: 'Fri', value: 95 },
  { day: 'Sat', value: 80 },
  { day: 'Sun', value: 60 },
]);
</script>

<template>
  <div class="p-8 space-y-8">
    <div class="text-center">
      <h1 class="text-3xl font-bold mb-2">Occupancy Report</h1>
      <p class="text-muted-foreground mb-6">Analyze your car park's space usage and occupancy rates.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">Total Spaces</CardTitle>
          <BarChart class="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ summary.totalSpaces }}</div>
          <div class="text-xs text-muted-foreground">In facility</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">Avg. Occupancy</CardTitle>
          <BarChart class="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ summary.avgOccupancy }}%</div>
          <div class="text-xs text-muted-foreground">This week</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">Peak Occupancy</CardTitle>
          <BarChart class="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-green-600">{{ summary.peakOccupancy }}%</div>
          <div class="text-xs text-muted-foreground">on {{ summary.peakDay }}</div>
        </CardContent>
      </Card>
    </div>
    <div class="max-w-4xl mx-auto mt-8">
      <Card>
        <CardHeader>
          <CardTitle>Daily Occupancy</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="h-64 flex items-end gap-2">
            <div v-for="item in dailyOccupancy" :key="item.day" class="flex flex-col items-center flex-1">
              <div class="bg-primary rounded w-6" :style="{ height: (item.value * 2) + 'px' }"></div>
              <span class="text-xs mt-1">{{ item.day }}</span>
              <span class="text-xs text-muted-foreground">{{ item.value }}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template> 