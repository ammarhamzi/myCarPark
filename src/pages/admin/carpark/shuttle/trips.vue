<script setup lang="ts">
import { ref } from 'vue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit2, Trash2 } from 'lucide-vue-next';

const trips = ref([
  { id: 1, date: '2024-07-01', schedule: '08:00 T1', status: 'completed', passengers: 10 },
  { id: 2, date: '2024-07-01', schedule: '09:30 T2', status: 'active', passengers: 8 },
  { id: 3, date: '2024-07-01', schedule: '11:00 T1', status: 'cancelled', passengers: 0 },
  { id: 4, date: '2024-07-01', schedule: '13:00 T2', status: 'active', passengers: 12 },
]);

function addTrip() {
  alert('Add Trip feature coming soon!');
}
function editTrip(trip: any) {
  alert(`Edit Trip ${trip.schedule} feature coming soon!`);
}
function deleteTrip(trip: any) {
  if (confirm(`Delete Trip at ${trip.schedule}?`)) {
    trips.value = trips.value.filter(t => t.id !== trip.id);
  }
}
</script>

<template>
  <div class="p-8 space-y-8">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold">Shuttle Trips</h1>
      <Button variant="default" @click="addTrip">
        <Plus class="mr-2 h-4 w-4" /> Add Trip
      </Button>
    </div>
    <Card>
      <CardHeader>
        <CardTitle>All Trips</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="overflow-x-auto">
          <table class="min-w-full border text-sm">
            <thead>
              <tr class="bg-muted">
                <th class="px-4 py-3 text-left">Date</th>
                <th class="px-4 py-3 text-left">Schedule</th>
                <th class="px-4 py-3 text-left">Status</th>
                <th class="px-4 py-3 text-left">Passengers</th>
                <th class="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="trip in trips" :key="trip.id" class="border-b hover:bg-muted/50">
                <td class="px-4 py-3 font-mono">{{ trip.date }}</td>
                <td class="px-4 py-3">{{ trip.schedule }}</td>
                <td class="px-4 py-3">
                  <span :class="trip.status === 'active' ? 'text-green-600' : trip.status === 'completed' ? 'text-blue-600' : 'text-gray-400'">
                    {{ trip.status.charAt(0).toUpperCase() + trip.status.slice(1) }}
                  </span>
                </td>
                <td class="px-4 py-3">{{ trip.passengers }}</td>
                <td class="px-4 py-3 flex gap-2">
                  <Button size="xs" variant="outline" @click="editTrip(trip)"><Edit2 class="h-4 w-4" /></Button>
                  <Button size="xs" variant="destructive" @click="deleteTrip(trip)"><Trash2 class="h-4 w-4" /></Button>
                </td>
              </tr>
              <tr v-if="!trips.length">
                <td colspan="5" class="text-center py-12 text-muted-foreground">
                  <div class="flex flex-col items-center gap-2">
                    <span>No trips found</span>
                    <Button variant="default" @click="addTrip">
                      <Plus class="mr-2 h-4 w-4" /> Add your first trip
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