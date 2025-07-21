<template>
  <div class="p-8">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold">Parking Lot Layout Editor</h1>
      <Button @click="toggleEditMode" :variant="editMode ? 'default' : 'outline'">
        {{ editMode ? 'View Mode' : 'Edit Mode' }}
      </Button>
    </div>
    <div class="mb-4 flex gap-2">
      <Button @click="addRow" v-if="editMode" variant="outline">Add Row</Button>
      <Button @click="addCol" v-if="editMode" variant="outline">Add Column</Button>
      <Button @click="saveLayout" v-if="editMode" variant="default">Save Layout</Button>
      <Button @click="loadLayout" v-if="editMode" variant="outline">Load Layout</Button>
    </div>
    <div class="overflow-x-auto">
      <div class="inline-block">
        <table class="border-collapse">
          <tbody>
            <tr v-for="(row, rowIndex) in grid" :key="rowIndex">
              <td v-for="(block, colIndex) in row" :key="colIndex" class="p-1">
                <ParkingBlock
                  v-if="block"
                  :block="block"
                  :edit-mode="editMode"
                  @edit="editBlock(block)"
                  @remove="removeBlock(block)"
                />
                <Button v-else-if="editMode" size="sm" variant="ghost" class="w-16 h-16" @click="addBlock(rowIndex, colIndex)">+</Button>
                <div v-else class="w-16 h-16"></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <EditBlockDialog v-model:open="showDialog" :block="selectedBlock" @save="saveBlockEdit" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Button } from '@/components/ui/button';

// Block and layout types
const defaultRows = 5;
const defaultCols = 10;
const statuses = ['available', 'occupied', 'reserved', 'maintenance'] as const;

type BlockStatus = typeof statuses[number];
interface ParkingBlockData {
  id: string;
  label: string;
  row: number;
  col: number;
  status: BlockStatus;
}

// State
const editMode = ref(true);
const rows = ref(defaultRows);
const cols = ref(defaultCols);
const layout = ref<ParkingBlockData[]>([]);

// Dialog state
const showDialog = ref(false);
const selectedBlock = ref<ParkingBlockData | null>(null);

// Computed grid
const grid = computed(() => {
  const g: (ParkingBlockData | null)[][] = [];
  for (let r = 0; r < rows.value; r++) {
    const row: (ParkingBlockData | null)[] = [];
    for (let c = 0; c < cols.value; c++) {
      const block = layout.value.find(b => b.row === r && b.col === c);
      row.push(block || null);
    }
    g.push(row);
  }
  return g;
});

function toggleEditMode() {
  editMode.value = !editMode.value;
}
function addRow() {
  rows.value++;
}
function addCol() {
  cols.value++;
}
function addBlock(row: number, col: number) {
  const id = `A${(row * cols.value + col + 1).toString().padStart(2, '0')}`;
  layout.value.push({
    id,
    label: id,
    row,
    col,
    status: 'available',
  });
}
function removeBlock(block: ParkingBlockData) {
  layout.value = layout.value.filter(b => b !== block);
}
function editBlock(block: ParkingBlockData) {
  selectedBlock.value = { ...block };
  showDialog.value = true;
}
function saveBlockEdit(updated: ParkingBlockData) {
  const idx = layout.value.findIndex(b => b.row === updated.row && b.col === updated.col);
  if (idx !== -1) layout.value[idx] = { ...updated };
  showDialog.value = false;
}
function saveLayout() {
  localStorage.setItem('parking_layout', JSON.stringify(layout.value));
  alert('Layout saved!');
}
function loadLayout() {
  const data = localStorage.getItem('parking_layout');
  if (data) {
    layout.value = JSON.parse(data);
    // Update rows/cols if needed
    const maxRow = Math.max(...layout.value.map(b => b.row), 0);
    const maxCol = Math.max(...layout.value.map(b => b.col), 0);
    rows.value = Math.max(rows.value, maxRow + 1);
    cols.value = Math.max(cols.value, maxCol + 1);
  }
}

// Block component
const ParkingBlock = defineComponent({
  props: {
    block: Object,
    editMode: Boolean
  },
  emits: ['edit', 'remove'],
  setup(props, { emit }) {
    function onEdit() {
      emit('edit', props.block);
    }
    function onRemove() {
      emit('remove', props.block);
    }
    return () => (
      <div class={['w-16 h-16 flex flex-col items-center justify-center rounded border cursor-pointer',
        props.block.status === 'available' ? 'bg-green-600/80 text-white' :
        props.block.status === 'occupied' ? 'bg-red-600/80 text-white' :
        props.block.status === 'reserved' ? 'bg-blue-600/80 text-white' :
        'bg-gray-700/80 text-white']}
        onClick={props.editMode ? onEdit : undefined}
      >
        <span class="font-bold">{props.block.label}</span>
        <span class="text-xs capitalize">{props.block.status}</span>
        {props.editMode && <Button size="xs" variant="ghost" class="mt-1" onClick={onRemove}>🗑️</Button>}
      </div>
    );
  }
});

// Edit dialog component
const EditBlockDialog = defineComponent({
  props: {
    open: Boolean,
    block: Object
  },
  emits: ['update:open', 'save'],
  setup(props, { emit }) {
    const local = ref({ ...props.block });
    watch(() => props.block, (val) => {
      Object.assign(local.value, val);
    });
    function close() {
      emit('update:open', false);
    }
    function save() {
      emit('save', { ...local.value });
      close();
    }
    return () => props.open && props.block && (
      <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-900 p-6 rounded shadow-lg w-80">
          <h2 class="text-lg font-bold mb-4">Edit Block</h2>
          <div class="mb-2">
            <label class="block text-sm mb-1">Label</label>
            <input v-model={local.value.label} class="w-full border rounded px-2 py-1" />
          </div>
          <div class="mb-2">
            <label class="block text-sm mb-1">Status</label>
            <select v-model={local.value.status} class="w-full border rounded px-2 py-1">
              {statuses.map(s => <option value={s}>{s}</option>)}
            </select>
          </div>
          <div class="flex gap-2 mt-4">
            <Button variant="default" onClick={save}>Save</Button>
            <Button variant="outline" onClick={close}>Cancel</Button>
          </div>
        </div>
      </div>
    );
  }
});
</script> 