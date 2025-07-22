import type { RouteRecordRaw } from 'vue-router';

export const carparkAdminRoutes: RouteRecordRaw[] = [
  // Car Park Admin Dashboard
  {
    path: '/admin/carpark',
    redirect: '/admin/carpark/dashboard'
  },
  {
    path: '/admin/carpark/dashboard',
    name: 'admin-carpark-dashboard',
    component: () => import('@/pages/admin/carpark/dashboard/index.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin', 'superadmin'],
      layout: 'dashboard',
      title: 'Car Park Dashboard'
    }
  },
  
  // Booking Management
  {
    path: '/admin/carpark/bookings',
    name: 'admin-carpark-bookings',
    component: () => import('@/pages/admin/carpark/bookings/index.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin', 'superadmin'],
      layout: 'dashboard',
      title: 'Booking Management'
    }
  },
  {
    path: '/admin/carpark/bookings/:id',
    name: 'admin-carpark-booking-detail',
    component: () => import('@/pages/admin/carpark/bookings/detail.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin', 'superadmin'],
      layout: 'dashboard',
      title: 'Booking Details'
    }
  },
  {
    path: '/admin/carpark/bookings/create',
    name: 'admin-carpark-booking-create',
    component: () => import('@/pages/admin/carpark/bookings/create.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin', 'superadmin'],
      layout: 'dashboard',
      title: 'Manual Booking'
    }
  },
  
  // Parking Space Management
  {
    path: '/admin/carpark/spaces',
    name: 'admin-carpark-spaces',
    component: () => import('@/pages/admin/carpark/spaces/index.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin', 'superadmin'],
      layout: 'dashboard',
      title: 'Parking Spaces'
    }
  },
  {
    path: '/admin/carpark/spaces/layout-editor',
    name: 'admin-carpark-spaces-layout-editor',
    component: () => import('@/pages/admin/carpark/spaces/layout-editor.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin', 'superadmin'],
      layout: 'dashboard',
      title: 'Layout Editor'
    }
  },
  {
    path: '/admin/carpark/spaces/:id',
    name: 'admin-carpark-space-detail',
    component: () => import('@/pages/admin/carpark/spaces/detail.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin', 'superadmin'],
      layout: 'dashboard',
      title: 'Space Details'
    }
  },
  
  // Configuration
  {
    path: '/admin/carpark/config',
    name: 'admin-carpark-config',
    component: () => import('@/pages/admin/carpark/config/index.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin', 'superadmin'],
      layout: 'dashboard',
      title: 'Car Park Configuration'
    }
  },
  {
    path: '/admin/carpark/config/pricing',
    name: 'admin-carpark-pricing',
    component: () => import('@/pages/admin/carpark/config/pricing.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin', 'superadmin'],
      layout: 'dashboard',
      title: 'Pricing Configuration'
    }
  },
  
  // Shuttle Management
  {
    path: '/admin/carpark/shuttle',
    name: 'admin-carpark-shuttle',
    component: () => import('@/pages/admin/carpark/shuttle/index.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin', 'superadmin'],
      layout: 'dashboard',
      title: 'Shuttle Management'
    }
  },
  {
    path: '/admin/carpark/shuttle/schedules',
    name: 'admin-carpark-shuttle-schedules',
    component: () => import('@/pages/admin/carpark/shuttle/schedules.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin', 'superadmin'],
      layout: 'dashboard',
      title: 'Shuttle Schedules'
    }
  },
  {
    path: '/admin/carpark/shuttle/trips',
    name: 'admin-carpark-shuttle-trips',
    component: () => import('@/pages/admin/carpark/shuttle/trips.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin', 'superadmin'],
      layout: 'dashboard',
      title: 'Shuttle Trips'
    }
  },
  
  // Car Wash Management
  {
    path: '/admin/carpark/carwash',
    name: 'admin-carpark-carwash',
    component: () => import('@/pages/admin/carpark/carwash/index.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin', 'superadmin'],
      layout: 'dashboard',
      title: 'Car Wash Management'
    }
  },
  {
    path: '/admin/carpark/carwash/orders',
    name: 'admin-carpark-carwash-orders',
    component: () => import('@/pages/admin/carpark/carwash/orders.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin', 'superadmin'],
      layout: 'dashboard',
      title: 'Car Wash Orders'
    }
  },
  
  // Payment Management
  {
    path: '/admin/carpark/payments',
    name: 'admin-carpark-payments',
    component: () => import('@/pages/admin/carpark/payments/index.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin', 'superadmin'],
      layout: 'dashboard',
      title: 'Payment Management'
    }
  },
  
  // Reports
  {
    path: '/admin/carpark/reports',
    name: 'admin-carpark-reports',
    component: () => import('@/pages/admin/carpark/reports/index.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin', 'superadmin'],
      layout: 'dashboard',
      title: 'Car Park Reports'
    }
  },
  {
    path: '/admin/carpark/reports/revenue',
    name: 'admin-carpark-reports-revenue',
    component: () => import('@/pages/admin/carpark/reports/revenue.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin', 'superadmin'],
      layout: 'dashboard',
      title: 'Revenue Reports'
    }
  },
  {
    path: '/admin/carpark/reports/occupancy',
    name: 'admin-carpark-reports-occupancy',
    component: () => import('@/pages/admin/carpark/reports/occupancy.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin', 'superadmin'],
      layout: 'dashboard',
      title: 'Occupancy Reports'
    }
  }
]; 