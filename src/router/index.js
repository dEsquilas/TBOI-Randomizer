export const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/HomePage.vue')
  },
  {
    path: '/ladder',
    name: 'ladder',
    component: () => import('@/pages/LeaderboardPage.vue')
  }
]
