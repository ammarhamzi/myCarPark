<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useParkingStore } from '@/stores/parking';
import Card from '@/components/ui/card/Card.vue';

const route = useRoute();
const parkingStore = useParkingStore();
const bookingId = computed(() => Number(route.params.id));
const loading = ref(true);
const error = ref<string | null>(null);
const booking = ref();

onMounted(async () => {
  loading.value = true;
  error.value = null;
  try {
    if (!parkingStore.bookings.length) {
      await parkingStore.loadBookings();
    }
    booking.value = parkingStore.getBookingById(bookingId.value);
    if (!booking.value) {
      error.value = 'Booking not found.';
    }
  } catch (e: any) {
    error.value = e.message || 'Failed to load booking details.';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="p-8 flex justify-center">
    <Card class="max-w-2xl w-full">
      <template v-if="loading">
        <div class="text-center py-8">Loading booking details...</div>
      </template>
      <template v-else-if="error">
        <div class="text-center text-red-500 py-8">{{ error }}</div>
      </template>
      <template v-else-if="booking">
        <div class="p-6">
          <h1 class="text-2xl font-bold mb-4">Booking Details</h1>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div class="font-semibold">Reference:</div>
              <div>{{ booking.booking_reference }}</div>
            </div>
            <div>
              <div class="font-semibold">Status:</div>
              <div>{{ booking.status }}</div>
            </div>
            <div>
              <div class="font-semibold">Parking Type:</div>
              <div>{{ booking.parking_type }}</div>
            </div>
            <div>
              <div class="font-semibold">Check-in:</div>
              <div>{{ booking.scheduled_check_in }}</div>
            </div>
            <div>
              <div class="font-semibold">Check-out:</div>
              <div>{{ booking.scheduled_check_out }}</div>
            </div>
            <div v-if="booking.vehicle">
              <div class="font-semibold">Vehicle:</div>
              <div>{{ booking.vehicle.plate_number }} ({{ booking.vehicle.car_type }})</div>
            </div>
            <div v-if="booking.parking_space">
              <div class="font-semibold">Parking Space:</div>
              <div>{{ booking.parking_space.space_number }}</div>
            </div>
            <div>
              <div class="font-semibold">Total Amount:</div>
              <div>{{ booking.total_amount }} {{ booking.currency }}</div>
            </div>
            <div>
              <div class="font-semibold">Shuttle Required:</div>
              <div>{{ booking.shuttle_required ? 'Yes' : 'No' }}</div>
            </div>
            <div>
              <div class="font-semibold">Car Wash Requested:</div>
              <div>{{ booking.car_wash_requested ? 'Yes' : 'No' }}</div>
            </div>
            <div v-if="booking.special_instructions">
              <div class="font-semibold">Special Instructions:</div>
              <div>{{ booking.special_instructions }}</div>
            </div>
            <div>
              <div class="font-semibold">Created At:</div>
              <div>{{ booking.created_at }}</div>
            </div>
            <div>
              <div class="font-semibold">Last Updated:</div>
              <div>{{ booking.updated_at }}</div>
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template> 