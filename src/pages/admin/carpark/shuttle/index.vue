<template>
  <div class="p-8 space-y-8">
    <div class="text-center">
      <h1 class="text-3xl font-bold mb-2">Shuttle Management</h1>
      <p class="text-muted-foreground mb-6">Manage shuttle schedules and trips for your car park.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
      <router-link to="/admin/carpark/shuttle/schedules" class="block">
        <div class="rounded-lg border bg-card p-6 shadow hover:shadow-lg transition cursor-pointer flex flex-col items-center">
          <span class="text-4xl mb-2">🚌</span>
          <h2 class="text-xl font-semibold mb-1">Shuttle Schedules</h2>
          <p class="text-muted-foreground text-sm">View and manage shuttle schedules.</p>
        </div>
      </router-link>
      <router-link to="/admin/carpark/shuttle/trips" class="block">
        <div class="rounded-lg border bg-card p-6 shadow hover:shadow-lg transition cursor-pointer flex flex-col items-center">
          <span class="text-4xl mb-2">📅</span>
          <h2 class="text-xl font-semibold mb-1">Shuttle Trips</h2>
          <p class="text-muted-foreground text-sm">Track shuttle trips and passenger counts.</p>
        </div>
      </router-link>
    </div>
  </div>
</template> 