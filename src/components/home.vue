<template>
  <div>
  </div>
</template>

<script>
import * as BN from 'bn.js';

export default {
  name: 'Home',

  beforeRouteEnter() {
    const seed = new BN(0);

    this.$router.replace({
      path: '/play/' + seed.toString(16),
    });
  },
}
</script>
