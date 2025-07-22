<script setup lang="ts">
import {
  Home,
  CalendarCheck,
  ParkingCircle,
  Users,
  Settings2,
} from 'lucide-vue-next'
import NavMain from '@/components/NavMain.vue'
import NavUser from '@/components/NavUser.vue'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'

const navMain = [
  {
    title: 'Dashboard',
    url: '/admin/dashboard',
    icon: Home,
    isActive: false,
    items: [],
  },
  {
    title: 'Bookings',
    url: '/admin/carpark/bookings',
    icon: CalendarCheck,
    isActive: false,
    items: [],
  },
  {
    title: 'Spaces',
    url: '/admin/carpark/spaces',
    icon: ParkingCircle,
    isActive: false,
    items: [],
  },
  {
    title: 'Users',
    url: '/admin/users',
    icon: Users,
    isActive: false,
    items: [],
  },
  {
    title: 'Settings',
    url: '/admin/settings',
    icon: Settings2,
    isActive: false,
    items: [],
  },
]

const user = {
  name: 'Admin',
  email: 'admin@example.com',
  avatar: '/avatars/default.jpg',
}
</script>

<template>
  <Sidebar>
    <SidebarHeader />
    <SidebarContent>
      <NavMain :items="navMain" />
    </SidebarContent>
    <SidebarFooter>
      <NavUser :user="user" />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
