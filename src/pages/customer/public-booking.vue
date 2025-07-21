<template>
  <div class="p-8 text-center">
    <h1 class="text-2xl font-bold mb-2">Book Your Parking (Public)</h1>
    <p class="text-muted-foreground mb-4">This page is accessible to everyone, no login required.</p>
    <div class="max-w-xl mx-auto mt-8">
      <p class="mb-4">Welcome! You can check parking availability and start your booking here without logging in.</p>
      <!-- Add your public booking form or info here -->
      <Button variant="default">Start Booking</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
</script> 