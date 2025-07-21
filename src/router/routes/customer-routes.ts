import type { RouteRecordRaw } from 'vue-router';

export const customerRoutes: RouteRecordRaw[] = [
  {
    path: '/customer',
    redirect: '/customer/book'
  },
  
  // Customer Booking Flow
  {
    path: '/customer/book',
    name: 'customer-book',
    component: () => import('@/pages/customer/booking/index.vue'),
    meta: {
      requiresAuth: true,
      roles: ['customer'],
      layout: 'dashboard',
      title: 'Book Parking'
    }
  },
  {
    path: '/customer/book/select-dates',
    name: 'customer-book-dates',
    component: () => import('@/pages/customer/booking/select-dates.vue'),
    meta: {
      requiresAuth: true,
      roles: ['customer'],
      layout: 'dashboard',
      title: 'Select Dates'
    }
  },
  {
    path: '/customer/book/choose-type',
    name: 'customer-book-type',
    component: () => import('@/pages/customer/booking/choose-type.vue'),
    meta: {
      requiresAuth: true,
      roles: ['customer'],
      layout: 'dashboard',
      title: 'Choose Parking Type'
    }
  },
  {
    path: '/customer/book/add-services',
    name: 'customer-book-services',
    component: () => import('@/pages/customer/booking/add-services.vue'),
    meta: {
      requiresAuth: true,
      roles: ['customer'],
      layout: 'dashboard',
      title: 'Add Services'
    }
  },
  {
    path: '/customer/book/vehicle-info',
    name: 'customer-book-vehicle',
    component: () => import('@/pages/customer/booking/vehicle-info.vue'),
    meta: {
      requiresAuth: true,
      roles: ['customer'],
      layout: 'dashboard',
      title: 'Vehicle Information'
    }
  },
  {
    path: '/customer/book/payment',
    name: 'customer-book-payment',
    component: () => import('@/pages/customer/booking/payment.vue'),
    meta: {
      requiresAuth: true,
      roles: ['customer'],
      layout: 'dashboard',
      title: 'Payment'
    }
  },
  {
    path: '/customer/book/confirmation',
    name: 'customer-book-confirmation',
    component: () => import('@/pages/customer/booking/confirmation.vue'),
    meta: {
      requiresAuth: true,
      roles: ['customer'],
      layout: 'dashboard',
      title: 'Booking Confirmation'
    }
  },
  
  // Customer Dashboard & Management
  {
    path: '/customer/dashboard',
    name: 'customer-dashboard',
    component: () => import('@/pages/customer/dashboard/index.vue'),
    meta: {
      requiresAuth: true,
      roles: ['customer'],
      layout: 'dashboard',
      title: 'My Dashboard'
    }
  },
  
  // Booking History
  {
    path: '/customer/bookings',
    name: 'customer-bookings',
    component: () => import('@/pages/customer/bookings/index.vue'),
    meta: {
      requiresAuth: true,
      roles: ['customer'],
      layout: 'dashboard',
      title: 'My Bookings'
    }
  },
  {
    path: '/customer/bookings/:id',
    name: 'customer-booking-detail',
    component: () => import('@/pages/customer/bookings/detail.vue'),
    meta: {
      requiresAuth: true,
      roles: ['customer'],
      layout: 'dashboard',
      title: 'Booking Details'
    }
  },
  
  // Vehicle Management
  {
    path: '/customer/vehicles',
    name: 'customer-vehicles',
    component: () => import('@/pages/customer/vehicles/index.vue'),
    meta: {
      requiresAuth: true,
      roles: ['customer'],
      layout: 'dashboard',
      title: 'My Vehicles'
    }
  },
  
  // Location & Help
  {
    path: '/customer/location-guide',
    name: 'customer-location-guide',
    component: () => import('@/pages/customer/location-guide/index.vue'),
    meta: {
      requiresAuth: true,
      roles: ['customer'],
      layout: 'dashboard',
      title: 'Location Guide'
    }
  },
  {
    path: '/customer/help',
    name: 'customer-help',
    component: () => import('@/pages/customer/help/index.vue'),
    meta: {
      requiresAuth: true,
      roles: ['customer'],
      layout: 'dashboard',
      title: 'Help & Support'
    }
  },
  
  // Customer Profile
  {
    path: '/customer/profile',
    name: 'customer-profile',
    component: () => import('@/pages/customer/profile/index.vue'),
    meta: {
      requiresAuth: true,
      roles: ['customer'],
      layout: 'dashboard',
      title: 'My Profile'
    }
  }
]; 