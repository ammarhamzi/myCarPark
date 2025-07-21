import { RouteRecordRaw } from 'vue-router';
import { authRoutes } from './auth-routes';
import { adminRoutes } from './admin-routes';
import { managerRoutes } from './manager-routes';
import { userRoutes } from './user-routes';
import { commonRoutes } from './common-routes';
import { publicRoutes } from './public-routes';
import { superadminRoutes } from './superadmin-routes';
import { customerRoutes } from './customer-routes';
import { carparkAdminRoutes } from './carpark-admin-routes';

// Combine all route groups into a single array
export const routes: RouteRecordRaw[] = [
  ...publicRoutes,
  ...authRoutes,
  ...adminRoutes,
  ...carparkAdminRoutes,
  ...superadminRoutes,
  ...managerRoutes,
  ...userRoutes,
  ...customerRoutes,
  ...commonRoutes,
  // Catch-all / 404 route should be at the end
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/not-found.vue'),
    meta: {
      requiresAuth: false,
      layout: 'blank',
      title: 'Page Not Found'
    }
  }
]; 