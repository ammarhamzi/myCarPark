<script setup lang="ts">
import { onMounted } from 'vue';
import { useParkingStore } from '@/stores/parking';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, LayoutTemplate } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const parkingStore = useParkingStore();
const router = useRouter();

onMounted(() => {
  parkingStore.loadSpaces();
});

function addSpace() {
  alert('Add Space feature coming soon!');
}
function editSpace(space: any) {
  alert(`Edit Space ${space.space_number} feature coming soon!`);
}
function deleteSpace(space: any) {
  if (confirm(`Delete Space ${space.space_number}?`)) {
    parkingStore.spaces = parkingStore.spaces.filter(s => s.id !== space.id);
  }
}
function getStatusVariant(status: string) {
  switch (status) {
    case 'available': return 'default';
    case 'occupied': return 'secondary';
    case 'maintenance': return 'destructive';
    case 'reserved': return 'outline';
    default: return 'outline';
  }
}
function getTypeVariant(type: string) {
  return type === 'covered' ? 'default' : 'secondary';
}
function goToLayoutEditor() {
  router.push('/admin/carpark/spaces/layout-editor');
}
</script>

<template>
  <div class="p-8 space-y-8">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold">Parking Spaces Management</h1>
      <div class="flex gap-2">
        <Button variant="default" @click="addSpace">
          <Plus class="mr-2 h-4 w-4" /> Add Space
        </Button>
        <Button variant="outline" @click="goToLayoutEditor">
          <LayoutTemplate class="mr-2 h-4 w-4" /> Edit Layout
        </Button>
      </div>
    </div>
    <div v-if="parkingStore.isLoading" class="text-center py-8">Loading parking spaces...</div>
    <div v-else-if="parkingStore.error" class="text-center text-red-500 py-8">{{ parkingStore.error }}</div>
    <div v-else>
      <table class="min-w-full bg-card rounded-lg overflow-hidden shadow">
        <thead>
          <tr class="bg-muted-foreground/10">
            <th class="px-4 py-2 text-left">Space #</th>
            <th class="px-4 py-2 text-left">Type</th>
            <th class="px-4 py-2 text-left">Status</th>
            <th class="px-4 py-2 text-left">Hourly Rate</th>
            <th class="px-4 py-2 text-left">Daily Rate</th>
            <th class="px-4 py-2 text-left">Active</th>
            <th class="px-4 py-2 text-left">Notes</th>
            <th class="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="space in parkingStore.spaces" :key="space.id" class="border-b last:border-0 hover:bg-muted/10">
            <td class="px-4 py-3 font-mono">{{ space.space_number }}</td>
            <td class="px-4 py-3">
              <Badge :variant="getTypeVariant(space.type)">{{ space.type.replace('_', ' ') }}</Badge>
            </td>
            <td class="px-4 py-3">
              <Badge :variant="getStatusVariant(space.status)">{{ space.status.replace('_', ' ') }}</Badge>
            </td>
            <td class="px-4 py-3">{{ space.hourly_rate }}</td>
            <td class="px-4 py-3">{{ space.daily_rate }}</td>
            <td class="px-4 py-3">
              <span :class="space.is_active ? 'text-green-600' : 'text-gray-400'">
                {{ space.is_active ? 'Yes' : 'No' }}
              </span>
            </td>
            <td class="px-4 py-3">{{ space.notes || '-' }}</td>
            <td class="px-4 py-3 flex gap-2">
              <Button size="xs" variant="outline" @click="editSpace(space)"><Edit2 class="h-4 w-4" /></Button>
              <Button size="xs" variant="destructive" @click="deleteSpace(space)"><Trash2 class="h-4 w-4" /></Button>
            </td>
          </tr>
          <tr v-if="!parkingStore.spaces.length">
            <td colspan="8" class="text-center py-12 text-muted-foreground">
              <div class="flex flex-col items-center gap-2">
                <span>No parking spaces found</span>
                <Button variant="default" @click="addSpace">
                  <Plus class="mr-2 h-4 w-4" /> Add your first space
                </Button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template> 