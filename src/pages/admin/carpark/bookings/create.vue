<template>
  <div class="max-w-2xl mx-auto p-8">
    <h1 class="text-3xl font-bold mb-8 text-center">Create Booking</h1>
    <Card class="shadow-xl rounded-2xl border border-border bg-white/90 dark:bg-background/80">
      <CardContent class="p-8 space-y-8">
        <form @submit.prevent="handleSubmit" class="space-y-8">
          <!-- Customer Info -->
          <div>
            <h2 class="text-lg font-semibold mb-4">Customer Info</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label for="customer">Customer Name <span class="text-red-500">*</span></Label>
                <Input id="customer" v-model="form.customer_name" placeholder="Customer Name" required autocomplete="name" />
              </div>
              <div>
                <Label for="plate">Plate Number <span class="text-red-500">*</span></Label>
                <Input id="plate" v-model="form.vehicle.plate_number" placeholder="e.g. ABC1234" required autocomplete="off" />
              </div>
            </div>
          </div>

          <!-- Vehicle Info -->
          <div>
            <h2 class="text-lg font-semibold mb-4">Vehicle Info</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label for="car_type">Car Type <span class="text-red-500">*</span></Label>
                <Select v-model="form.vehicle.car_type">
                  <SelectTrigger>Select Type</SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedan">Sedan</SelectItem>
                    <SelectItem value="suv">SUV</SelectItem>
                    <SelectItem value="mpv">MPV</SelectItem>
                    <SelectItem value="hatchback">Hatchback</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label for="color">Color</Label>
                <Input id="color" v-model="form.vehicle.color" placeholder="e.g. Black, White" />
              </div>
            </div>
          </div>

          <!-- Booking Details -->
          <div>
            <h2 class="text-lg font-semibold mb-4">Booking Details</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label for="parking_type">Parking Type <span class="text-red-500">*</span></Label>
                <Select v-model="form.parking_type">
                  <SelectTrigger>Select Type</SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open_air">Open Air</SelectItem>
                    <SelectItem value="covered">Covered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div></div>
              <div>
                <Label for="checkin">Check-in <span class="text-red-500">*</span></Label>
                <Input id="checkin" v-model="form.scheduled_check_in" type="datetime-local" required />
                <p class="text-xs text-muted-foreground mt-1">Select the check-in date and time.</p>
              </div>
              <div>
                <Label for="checkout">Check-out <span class="text-red-500">*</span></Label>
                <Input id="checkout" v-model="form.scheduled_check_out" type="datetime-local" required />
                <p class="text-xs text-muted-foreground mt-1">Select the check-out date and time.</p>
              </div>
            </div>
          </div>

          <!-- Add-ons -->
          <div>
            <h2 class="text-lg font-semibold mb-4">Add-ons</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" v-model="form.shuttle_required" class="accent-primary" />
                  <span>Shuttle Required</span>
                </label>
                <div v-if="form.shuttle_required" class="mt-2">
                  <Label for="shuttle_terminal">Shuttle Terminal</Label>
                  <Select v-model="form.shuttle_terminal">
                    <SelectTrigger>Select Terminal</SelectTrigger>
                    <SelectContent>
                      <SelectItem value="T1">Terminal 1</SelectItem>
                      <SelectItem value="T2">Terminal 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" v-model="form.car_wash_requested" class="accent-primary" />
                  <span>Car Wash</span>
                </label>
                <div v-if="form.car_wash_requested" class="mt-2">
                  <Label for="wash_type">Wash Type</Label>
                  <Select v-model="form.wash_type">
                    <SelectTrigger>Select Type</SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="deluxe">Deluxe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <!-- Special Instructions -->
          <div>
            <Label for="special">Special Instructions</Label>
            <textarea id="special" v-model="form.special_instructions" rows="3" placeholder="Any notes..." class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition" />
            <p class="text-xs text-muted-foreground mt-1">Optional: Add any special requests or notes for this booking.</p>
          </div>

          <!-- Actions -->
          <div class="flex flex-col md:flex-row gap-2 mt-4 justify-end">
            <Button type="submit" variant="default" class="w-full md:w-auto">Create Booking</Button>
            <Button type="button" variant="outline" class="w-full md:w-auto" @click="cancel">Cancel</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import type { CreateBookingRequest, ParkingSpaceType, CarType, ShuttleTerminal, WashType } from '@/types/carpark';

const router = useRouter();

// Add customer_name for UI only
const form = ref<{
  customer_name: string;
  scheduled_check_in: string;
  scheduled_check_out: string;
  parking_type: ParkingSpaceType | '';
  vehicle: {
    plate_number: string;
    car_type: CarType | '';
    make?: string;
    model?: string;
    color?: string;
  };
  shuttle_required: boolean;
  shuttle_terminal: ShuttleTerminal | '';
  car_wash_requested: boolean;
  wash_type: WashType | '';
  special_instructions: string;
}>({
  customer_name: '',
  scheduled_check_in: '',
  scheduled_check_out: '',
  parking_type: '',
  vehicle: {
    plate_number: '',
    car_type: '',
    make: '',
    model: '',
    color: ''
  },
  shuttle_required: false,
  shuttle_terminal: '',
  car_wash_requested: false,
  wash_type: '',
  special_instructions: ''
});

function handleSubmit() {
  // For now, just alert the data
  alert('Booking created!\n' + JSON.stringify(form.value, null, 2));
  router.push({ name: 'admin-carpark-bookings' });
}
function cancel() {
  router.push({ name: 'admin-carpark-bookings' });
}
</script> 