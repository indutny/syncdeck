import { generate } from './common/seed';

import BlackJack from './components/black-jack.vue';

export default [
  {
    path: '/',
    redirect() {
      return '/play/' + generate();
    },
  },
  { path: '/play/:seed', component: BlackJack },
];
