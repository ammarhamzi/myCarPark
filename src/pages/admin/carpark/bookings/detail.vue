<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Booking Details</h1>
        <p class="text-muted-foreground">
          View and manage booking information
        </p>
      </div>
      <Button variant="outline" @click="goBack">
        Back to Bookings
      </Button>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Booking Information</CardTitle>
        <CardDescription>
          Detailed booking view coming soon
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="text-center py-8">
          <p class="text-muted-foreground">Booking detail features will be implemented here</p>
          <p class="text-sm text-muted-foreground mt-2">Booking detail page</p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const router = useRouter();

const goBack = () => {
  router.push({ name: 'admin-carpark-bookings' });
};
</script> 