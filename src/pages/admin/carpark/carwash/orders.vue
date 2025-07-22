<script setup lang="ts">
import { ref } from 'vue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2 } from 'lucide-vue-next';

const orders = ref([
  {
    id: 2,
    booking_reference: 'DEF456',
    customer: { fullname: 'Jane Smith' },
    vehicle: { plate_number: 'ABC 5678' },
    check_in: '2024-07-02T09:00:00Z',
    status: 'pending',
  },
]);

function editOrder(order: any) {
  alert(`Edit Car Wash Order for ${order.booking_reference} feature coming soon!`);
}
function deleteOrder(order: any) {
  if (confirm(`Delete Car Wash Order for ${order.booking_reference}?`)) {
    orders.value = orders.value.filter(o => o.id !== order.id);
  }
}
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString('en-MY', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}
</script>

<template>
  <div class="p-8 space-y-8">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold">Car Wash Schedule</h1>
    </div>
    <Card>
      <CardHeader>
        <CardTitle>All Car Wash Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="overflow-x-auto">
          <table class="min-w-full border text-sm">
            <thead>
              <tr class="bg-muted">
                <th class="px-4 py-3 text-left">Booking Ref</th>
                <th class="px-4 py-3 text-left">Customer</th>
                <th class="px-4 py-3 text-left">Vehicle</th>
                <th class="px-4 py-3 text-left">Check-in</th>
                <th class="px-4 py-3 text-left">Status</th>
                <th class="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in orders" :key="order.id" class="border-b hover:bg-muted/50">
                <td class="px-4 py-3 font-mono">{{ order.booking_reference }}</td>
                <td class="px-4 py-3">{{ order.customer.fullname }}</td>
                <td class="px-4 py-3">{{ order.vehicle.plate_number }}</td>
                <td class="px-4 py-3">{{ formatDate(order.check_in) }}</td>
                <td class="px-4 py-3 capitalize">{{ order.status }}</td>
                <td class="px-4 py-3 flex gap-2">
                  <Button size="xs" variant="outline" @click="editOrder(order)"><Edit2 class="h-4 w-4" /></Button>
                  <Button size="xs" variant="destructive" @click="deleteOrder(order)"><Trash2 class="h-4 w-4" /></Button>
                </td>
              </tr>
              <tr v-if="!orders.length">
                <td colspan="6" class="text-center py-12 text-muted-foreground">
                  <div class="flex flex-col items-center gap-2">
                    <span>No car wash orders found</span>
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