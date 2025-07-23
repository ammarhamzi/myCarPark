<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useParkingStore } from '@/stores/parking';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit2, Trash2, LayoutTemplate, Search, Wrench, AlertTriangle } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const parkingStore = useParkingStore();
const router = useRouter();

// Search functionality
const searchQuery = ref('');
const activeTab = ref('all');

onMounted(() => {
  parkingStore.loadSpaces();
});

// Computed properties for filtering
const filteredSpaces = computed(() => {
  let spaces = parkingStore.spaces;
  
  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    spaces = spaces.filter(space => 
      space.space_number.toLowerCase().includes(query) ||
      space.type.toLowerCase().includes(query) ||
      space.status.toLowerCase().includes(query) ||
      (space.notes && space.notes.toLowerCase().includes(query))
    );
  }
  
  // Filter by tab
  switch (activeTab.value) {
    case 'maintenance':
      return spaces.filter(space => space.status === 'maintenance');
    case 'available':
      return spaces.filter(space => space.status === 'available');
    case 'occupied':
      return spaces.filter(space => space.status === 'occupied');
    case 'reserved':
      return spaces.filter(space => space.status === 'reserved');
    default:
      return spaces;
  }
});

const maintenanceSpaces = computed(() => 
  parkingStore.spaces.filter(space => space.status === 'maintenance')
);

const searchStats = computed(() => {
  const total = parkingStore.spaces.length;
  const filtered = filteredSpaces.value.length;
  const maintenance = maintenanceSpaces.value.length;
  
  return { total, filtered, maintenance };
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

function clearSearch() {
  searchQuery.value = '';
}
</script>

<template>
  <div class="p-8 space-y-8">
    <!-- Header -->
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

    <!-- Search and Stats -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Search Bar -->
      <div class="lg:col-span-2">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            v-model="searchQuery"
            placeholder="Search spaces by number, type, status, or notes..."
            class="pl-10 pr-10"
          />
          <Button
            v-if="searchQuery"
            variant="ghost"
            size="sm"
            class="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
            @click="clearSearch"
          >
            ×
          </Button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-3 gap-2">
        <Card class="text-center">
          <CardContent class="p-3">
            <div class="text-2xl font-bold text-blue-600">{{ searchStats.total }}</div>
            <div class="text-xs text-muted-foreground">Total</div>
          </CardContent>
        </Card>
        <Card class="text-center">
          <CardContent class="p-3">
            <div class="text-2xl font-bold text-green-600">{{ searchStats.filtered }}</div>
            <div class="text-xs text-muted-foreground">Showing</div>
          </CardContent>
        </Card>
        <Card class="text-center">
          <CardContent class="p-3">
            <div class="text-2xl font-bold text-red-600">{{ searchStats.maintenance }}</div>
            <div class="text-xs text-muted-foreground">Maintenance</div>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- Loading and Error States -->
    <div v-if="parkingStore.isLoading" class="text-center py-8">Loading parking spaces...</div>
    <div v-else-if="parkingStore.error" class="text-center text-red-500 py-8">{{ parkingStore.error }}</div>
    
    <!-- Main Content -->
    <div v-else>
      <!-- Tabs for different views -->
      <Tabs v-model="activeTab" class="w-full">
        <TabsList class="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Spaces</TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="occupied">Occupied</TabsTrigger>
          <TabsTrigger value="reserved">Reserved</TabsTrigger>
          <TabsTrigger value="maintenance" class="flex items-center gap-2">
            <Wrench class="h-4 w-4" />
            Maintenance
            <Badge v-if="searchStats.maintenance > 0" variant="destructive" class="ml-1">
              {{ searchStats.maintenance }}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <!-- All Spaces Tab -->
        <TabsContent value="all" class="mt-6">
          <Card>
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
                All Parking Spaces
                <span class="text-sm font-normal text-muted-foreground">
                  ({{ filteredSpaces.length }} of {{ searchStats.total }})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div v-if="filteredSpaces.length === 0" class="text-center py-12 text-muted-foreground">
                <div class="flex flex-col items-center gap-2">
                  <Search class="h-12 w-12 text-muted-foreground/50" />
                  <span v-if="searchQuery">No spaces found matching "{{ searchQuery }}"</span>
                  <span v-else>No parking spaces found</span>
                  <Button v-if="!searchQuery" variant="default" @click="addSpace">
                    <Plus class="mr-2 h-4 w-4" /> Add your first space
                  </Button>
                </div>
              </div>
              <div v-else class="overflow-x-auto">
                <table class="min-w-full">
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
                    <tr v-for="space in filteredSpaces" :key="space.id" class="border-b last:border-0 hover:bg-muted/10">
                      <td class="px-4 py-3 font-mono">{{ space.space_number }}</td>
                      <td class="px-4 py-3">
                        <Badge :variant="getTypeVariant(space.type)">{{ space.type.replace('_', ' ') }}</Badge>
                      </td>
                      <td class="px-4 py-3">
                        <Badge :variant="getStatusVariant(space.status)">{{ space.status.replace('_', ' ') }}</Badge>
                      </td>
                      <td class="px-4 py-3">${{ space.hourly_rate }}</td>
                      <td class="px-4 py-3">${{ space.daily_rate }}</td>
                      <td class="px-4 py-3">
                        <span :class="space.is_active ? 'text-green-600' : 'text-gray-400'">
                          {{ space.is_active ? 'Yes' : 'No' }}
                        </span>
                      </td>
                      <td class="px-4 py-3">{{ space.notes || '-' }}</td>
                      <td class="px-4 py-3 flex gap-2">
                        <Button size="xs" variant="outline" @click="editSpace(space)">
                          <Edit2 class="h-4 w-4" />
                        </Button>
                        <Button size="xs" variant="destructive" @click="deleteSpace(space)">
                          <Trash2 class="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <!-- Available Spaces Tab -->
        <TabsContent value="available" class="mt-6">
          <Card>
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
                Available Spaces
                <span class="text-sm font-normal text-muted-foreground">
                  ({{ filteredSpaces.length }} available)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div v-if="filteredSpaces.length === 0" class="text-center py-12 text-muted-foreground">
                <div class="flex flex-col items-center gap-2">
                  <span>No available spaces found</span>
                </div>
              </div>
              <div v-else class="overflow-x-auto">
                <table class="min-w-full">
                  <thead>
                    <tr class="bg-muted-foreground/10">
                      <th class="px-4 py-2 text-left">Space #</th>
                      <th class="px-4 py-2 text-left">Type</th>
                      <th class="px-4 py-2 text-left">Hourly Rate</th>
                      <th class="px-4 py-2 text-left">Daily Rate</th>
                      <th class="px-4 py-2 text-left">Notes</th>
                      <th class="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="space in filteredSpaces" :key="space.id" class="border-b last:border-0 hover:bg-muted/10">
                      <td class="px-4 py-3 font-mono">{{ space.space_number }}</td>
                      <td class="px-4 py-3">
                        <Badge :variant="getTypeVariant(space.type)">{{ space.type.replace('_', ' ') }}</Badge>
                      </td>
                      <td class="px-4 py-3">${{ space.hourly_rate }}</td>
                      <td class="px-4 py-3">${{ space.daily_rate }}</td>
                      <td class="px-4 py-3">{{ space.notes || '-' }}</td>
                      <td class="px-4 py-3 flex gap-2">
                        <Button size="xs" variant="outline" @click="editSpace(space)">
                          <Edit2 class="h-4 w-4" />
                        </Button>
                        <Button size="xs" variant="destructive" @click="deleteSpace(space)">
                          <Trash2 class="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <!-- Occupied Spaces Tab -->
        <TabsContent value="occupied" class="mt-6">
          <Card>
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
                Occupied Spaces
                <span class="text-sm font-normal text-muted-foreground">
                  ({{ filteredSpaces.length }} occupied)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div v-if="filteredSpaces.length === 0" class="text-center py-12 text-muted-foreground">
                <div class="flex flex-col items-center gap-2">
                  <span>No occupied spaces found</span>
                </div>
              </div>
              <div v-else class="overflow-x-auto">
                <table class="min-w-full">
                  <thead>
                    <tr class="bg-muted-foreground/10">
                      <th class="px-4 py-2 text-left">Space #</th>
                      <th class="px-4 py-2 text-left">Type</th>
                      <th class="px-4 py-2 text-left">Hourly Rate</th>
                      <th class="px-4 py-2 text-left">Daily Rate</th>
                      <th class="px-4 py-2 text-left">Notes</th>
                      <th class="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="space in filteredSpaces" :key="space.id" class="border-b last:border-0 hover:bg-muted/10">
                      <td class="px-4 py-3 font-mono">{{ space.space_number }}</td>
                      <td class="px-4 py-3">
                        <Badge :variant="getTypeVariant(space.type)">{{ space.type.replace('_', ' ') }}</Badge>
                      </td>
                      <td class="px-4 py-3">${{ space.hourly_rate }}</td>
                      <td class="px-4 py-3">${{ space.daily_rate }}</td>
                      <td class="px-4 py-3">{{ space.notes || '-' }}</td>
                      <td class="px-4 py-3 flex gap-2">
                        <Button size="xs" variant="outline" @click="editSpace(space)">
                          <Edit2 class="h-4 w-4" />
                        </Button>
                        <Button size="xs" variant="destructive" @click="deleteSpace(space)">
                          <Trash2 class="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <!-- Reserved Spaces Tab -->
        <TabsContent value="reserved" class="mt-6">
          <Card>
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
                Reserved Spaces
                <span class="text-sm font-normal text-muted-foreground">
                  ({{ filteredSpaces.length }} reserved)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div v-if="filteredSpaces.length === 0" class="text-center py-12 text-muted-foreground">
                <div class="flex flex-col items-center gap-2">
                  <span>No reserved spaces found</span>
                </div>
              </div>
              <div v-else class="overflow-x-auto">
                <table class="min-w-full">
                  <thead>
                    <tr class="bg-muted-foreground/10">
                      <th class="px-4 py-2 text-left">Space #</th>
                      <th class="px-4 py-2 text-left">Type</th>
                      <th class="px-4 py-2 text-left">Hourly Rate</th>
                      <th class="px-4 py-2 text-left">Daily Rate</th>
                      <th class="px-4 py-2 text-left">Notes</th>
                      <th class="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="space in filteredSpaces" :key="space.id" class="border-b last:border-0 hover:bg-muted/10">
                      <td class="px-4 py-3 font-mono">{{ space.space_number }}</td>
                      <td class="px-4 py-3">
                        <Badge :variant="getTypeVariant(space.type)">{{ space.type.replace('_', ' ') }}</Badge>
                      </td>
                      <td class="px-4 py-3">${{ space.hourly_rate }}</td>
                      <td class="px-4 py-3">${{ space.daily_rate }}</td>
                      <td class="px-4 py-3">{{ space.notes || '-' }}</td>
                      <td class="px-4 py-3 flex gap-2">
                        <Button size="xs" variant="outline" @click="editSpace(space)">
                          <Edit2 class="h-4 w-4" />
                        </Button>
                        <Button size="xs" variant="destructive" @click="deleteSpace(space)">
                          <Trash2 class="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <!-- Maintenance Spaces Tab -->
        <TabsContent value="maintenance" class="mt-6">
          <Card>
            <CardHeader>
              <CardTitle class="flex items-center gap-2 text-red-600">
                <Wrench class="h-5 w-5" />
                Spaces Under Maintenance
                <span class="text-sm font-normal text-muted-foreground">
                  ({{ filteredSpaces.length }} in maintenance)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div v-if="filteredSpaces.length === 0" class="text-center py-12 text-muted-foreground">
                <div class="flex flex-col items-center gap-2">
                  <Wrench class="h-12 w-12 text-muted-foreground/50" />
                  <span>No spaces currently under maintenance</span>
                </div>
              </div>
              <div v-else>
                <!-- Maintenance Alert -->
                <div class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div class="flex items-center gap-2">
                    <AlertTriangle class="h-5 w-5 text-red-600" />
                    <span class="font-medium text-red-800 dark:text-red-200">
                      {{ filteredSpaces.length }} space{{ filteredSpaces.length > 1 ? 's' : '' }} currently under maintenance
                    </span>
                  </div>
                  <p class="text-sm text-red-700 dark:text-red-300 mt-1">
                    These spaces are temporarily unavailable for bookings.
                  </p>
                </div>

                <!-- Maintenance Spaces Table -->
                <div class="overflow-x-auto">
                  <table class="min-w-full">
                    <thead>
                      <tr class="bg-muted-foreground/10">
                        <th class="px-4 py-2 text-left">Space #</th>
                        <th class="px-4 py-2 text-left">Type</th>
                        <th class="px-4 py-2 text-left">Hourly Rate</th>
                        <th class="px-4 py-2 text-left">Daily Rate</th>
                        <th class="px-4 py-2 text-left">Active</th>
                        <th class="px-4 py-2 text-left">Maintenance Notes</th>
                        <th class="px-4 py-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="space in filteredSpaces" :key="space.id" class="border-b last:border-0 hover:bg-muted/10">
                        <td class="px-4 py-3 font-mono">{{ space.space_number }}</td>
                        <td class="px-4 py-3">
                          <Badge :variant="getTypeVariant(space.type)">{{ space.type.replace('_', ' ') }}</Badge>
                        </td>
                        <td class="px-4 py-3">${{ space.hourly_rate }}</td>
                        <td class="px-4 py-3">${{ space.daily_rate }}</td>
                        <td class="px-4 py-3">
                          <span :class="space.is_active ? 'text-green-600' : 'text-red-600'">
                            {{ space.is_active ? 'Yes' : 'No' }}
                          </span>
                        </td>
                        <td class="px-4 py-3">
                          <span class="text-red-600 font-medium">{{ space.notes || 'No maintenance notes' }}</span>
                        </td>
                        <td class="px-4 py-3 flex gap-2">
                          <Button size="xs" variant="outline" @click="editSpace(space)">
                            <Edit2 class="h-4 w-4" />
                          </Button>
                          <Button size="xs" variant="destructive" @click="deleteSpace(space)">
                            <Trash2 class="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template> 