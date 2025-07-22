<template>
  <div class="max-w-2xl mx-auto p-8">
    <h1 class="text-2xl font-bold mb-4">Create Booking</h1>
    <Card>
      <CardContent class="p-6 space-y-6">
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label for="customer">Customer Name</Label>
              <Input id="customer" v-model="form.customer" placeholder="Customer Name" required />
            </div>
            <div>
              <Label for="plate">Plate Number</Label>
              <Input id="plate" v-model="form.vehicle.plate_number" placeholder="e.g. ABC1234" required />
            </div>
            <div>
              <Label for="car_type">Car Type</Label>
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
              <Label for="parking_type">Parking Type</Label>
              <Select v-model="form.parking_type">
                <SelectTrigger>Select Type</SelectTrigger>
                <SelectContent>
                  <SelectItem value="open_air">Open Air</SelectItem>
                  <SelectItem value="covered">Covered</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label for="checkin">Check-in</Label>
              <Input id="checkin" v-model="form.scheduled_check_in" type="datetime-local" required />
            </div>
            <div>
              <Label for="checkout">Check-out</Label>
              <Input id="checkout" v-model="form.scheduled_check_out" type="datetime-local" required />
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label><input type="checkbox" v-model="form.shuttle_required" /> Shuttle Required</Label>
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
              <Label><input type="checkbox" v-model="form.car_wash_requested" /> Car Wash</Label>
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
          <div>
            <Label for="special">Special Instructions</Label>
            <Input id="special" v-model="form.special_instructions" placeholder="Any notes..." />
          </div>
          <div class="flex gap-2 mt-4">
            <Button type="submit" variant="default">Create Booking</Button>
            <Button type="button" variant="outline" @click="cancel">Cancel</Button>
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
import type { CreateBookingRequest } from '@/types/carpark';

const router = useRouter();

const form = ref<CreateBookingRequest>({
  scheduled_check_in: '',
  scheduled_check_out: '',
  parking_type: undefined,
  vehicle: {
    plate_number: '',
    car_type: undefined,
    make: '',
    model: '',
    color: ''
  },
  shuttle_required: false,
  shuttle_terminal: undefined,
  car_wash_requested: false,
  wash_type: undefined,
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