import BlackJack from './components/black-jack.vue';
import Home from './components/home.vue';

export default [
  { path: '/', component: Home },
  { path: '/blackjack/:seed', component: BlackJack },
];
