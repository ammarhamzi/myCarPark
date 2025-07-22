<template>
  <div class="p-8 space-y-8">
    <div class="text-center">
      <h1 class="text-3xl font-bold mb-2">Reports</h1>
      <p class="text-muted-foreground mb-6">View key reports for your car park operations.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
      <router-link to="/admin/carpark/reports/revenue" class="block">
        <div class="rounded-lg border bg-card p-6 shadow hover:shadow-lg transition cursor-pointer flex flex-col items-center">
          <span class="text-4xl mb-2">💰</span>
          <h2 class="text-xl font-semibold mb-1">Revenue Report</h2>
          <p class="text-muted-foreground text-sm">See revenue trends and breakdowns.</p>
        </div>
      </router-link>
      <router-link to="/admin/carpark/reports/occupancy" class="block">
        <div class="rounded-lg border bg-card p-6 shadow hover:shadow-lg transition cursor-pointer flex flex-col items-center">
          <span class="text-4xl mb-2">🚗</span>
          <h2 class="text-xl font-semibold mb-1">Occupancy Report</h2>
          <p class="text-muted-foreground text-sm">Analyze space usage and occupancy rates.</p>
        </div>
      </router-link>
    </div>
  </div>
</template> 