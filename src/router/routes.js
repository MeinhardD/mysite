
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('pages/Index.vue')
      },
      {
        path: 'map',
        name: 'map',
        component: () => import('pages/Map.vue')
      }
    ]
  },
  {
    path: '/wishlist',
    name: 'Wishlist',
    component: () => import('pages/Wishlist.vue')
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
