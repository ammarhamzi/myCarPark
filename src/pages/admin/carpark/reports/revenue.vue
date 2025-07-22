<script setup lang="ts">
import { ref } from 'vue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart } from 'lucide-vue-next';

const summary = ref({
  total: 24500,
  thisMonth: 3200,
  lastMonth: 2800,
  growth: 14.3
});

const monthlyRevenue = ref([
  { month: 'Jan', value: 1800 },
  { month: 'Feb', value: 2100 },
  { month: 'Mar', value: 1950 },
  { month: 'Apr', value: 2200 },
  { month: 'May', value: 2500 },
  { month: 'Jun', value: 2700 },
  { month: 'Jul', value: 3200 },
  { month: 'Aug', value: 2950 },
  { month: 'Sep', value: 3100 },
  { month: 'Oct', value: 3300 },
  { month: 'Nov', value: 3400 },
  { month: 'Dec', value: 3500 },
]);
</script>

<template>
  <div class="p-8 space-y-8">
    <div class="text-center">
      <h1 class="text-3xl font-bold mb-2">Revenue Report</h1>
      <p class="text-muted-foreground mb-6">Track your car park's revenue performance.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">Total Revenue</CardTitle>
          <BarChart class="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">RM {{ summary.total.toLocaleString() }}</div>
          <div class="text-xs text-muted-foreground">All time</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">This Month</CardTitle>
          <BarChart class="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">RM {{ summary.thisMonth.toLocaleString() }}</div>
          <div class="text-xs text-muted-foreground">vs RM {{ summary.lastMonth.toLocaleString() }} last month</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">Growth</CardTitle>
          <BarChart class="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-green-600">+{{ summary.growth }}%</div>
          <div class="text-xs text-muted-foreground">Month-over-month</div>
        </CardContent>
      </Card>
    </div>
    <div class="max-w-4xl mx-auto mt-8">
      <Card>
        <CardHeader>
          <CardTitle>Monthly Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="h-64 flex items-end gap-2">
            <div v-for="item in monthlyRevenue" :key="item.month" class="flex flex-col items-center flex-1">
              <div class="bg-primary rounded w-6" :style="{ height: (item.value / 40) + 'px' }"></div>
              <span class="text-xs mt-1">{{ item.month }}</span>
              <span class="text-xs text-muted-foreground">RM {{ item.value }}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template> 