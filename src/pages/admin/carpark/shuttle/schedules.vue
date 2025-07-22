<script setup lang="ts">
import { ref } from 'vue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit2, Trash2 } from 'lucide-vue-next';

const schedules = ref([
  { id: 1, time: '08:00', terminal: 'T1', capacity: 12, status: 'active' },
  { id: 2, time: '09:30', terminal: 'T2', capacity: 10, status: 'active' },
  { id: 3, time: '11:00', terminal: 'T1', capacity: 8, status: 'inactive' },
  { id: 4, time: '13:00', terminal: 'T2', capacity: 12, status: 'active' },
]);

function addSchedule() {
  alert('Add Schedule feature coming soon!');
}
function editSchedule(schedule: any) {
  alert(`Edit Schedule ${schedule.time} feature coming soon!`);
}
function deleteSchedule(schedule: any) {
  if (confirm(`Delete Schedule at ${schedule.time}?`)) {
    schedules.value = schedules.value.filter(s => s.id !== schedule.id);
  }
}
</script>

<template>
  <div class="p-8 space-y-8">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold">Shuttle Schedules</h1>
      <Button variant="default" @click="addSchedule">
        <Plus class="mr-2 h-4 w-4" /> Add Schedule
      </Button>
    </div>
    <Card>
      <CardHeader>
        <CardTitle>All Schedules</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="overflow-x-auto">
          <table class="min-w-full border text-sm">
            <thead>
              <tr class="bg-muted">
                <th class="px-4 py-3 text-left">Time</th>
                <th class="px-4 py-3 text-left">Terminal</th>
                <th class="px-4 py-3 text-left">Capacity</th>
                <th class="px-4 py-3 text-left">Status</th>
                <th class="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="schedule in schedules" :key="schedule.id" class="border-b hover:bg-muted/50">
                <td class="px-4 py-3 font-mono">{{ schedule.time }}</td>
                <td class="px-4 py-3">{{ schedule.terminal }}</td>
                <td class="px-4 py-3">{{ schedule.capacity }}</td>
                <td class="px-4 py-3">
                  <span :class="schedule.status === 'active' ? 'text-green-600' : 'text-gray-400'">
                    {{ schedule.status === 'active' ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-4 py-3 flex gap-2">
                  <Button size="xs" variant="outline" @click="editSchedule(schedule)"><Edit2 class="h-4 w-4" /></Button>
                  <Button size="xs" variant="destructive" @click="deleteSchedule(schedule)"><Trash2 class="h-4 w-4" /></Button>
                </td>
              </tr>
              <tr v-if="!schedules.length">
                <td colspan="5" class="text-center py-12 text-muted-foreground">
                  <div class="flex flex-col items-center gap-2">
                    <span>No schedules found</span>
                    <Button variant="default" @click="addSchedule">
                      <Plus class="mr-2 h-4 w-4" /> Add your first schedule
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