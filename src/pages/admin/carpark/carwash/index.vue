<template>
  <div class="p-8 space-y-8">
    <div class="text-center">
      <h1 class="text-3xl font-bold mb-2">Car Wash Management</h1>
      <p class="text-muted-foreground mb-6">Manage car wash schedules and orders for your car park.</p>
    </div>
    <div class="max-w-xl mx-auto">
      <router-link to="/admin/carpark/carwash/orders" class="block">
        <div class="rounded-lg border bg-card p-6 shadow hover:shadow-lg transition cursor-pointer flex flex-col items-center">
          <span class="text-4xl mb-2">🧽</span>
          <h2 class="text-xl font-semibold mb-1">Car Wash Schedule</h2>
          <p class="text-muted-foreground text-sm">View and manage car wash orders scheduled from bookings.</p>
        </div>
      </router-link>
    </div>
  </div>
</template> 