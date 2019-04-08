<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app',
}
</script>

<style>
body {
  margin: 0;
  padding: 0.25rem 0.5rem;
  background: rgb(0, 92, 59);
  font-family-sans-serif:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
  font-family-monospace:SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;
  font-size: 1rem;
  line-height: 1.5;
}

#app {
  max-width: 640px;
  margin: 0 auto;
}

h1, h2, h3, h4, h5 {
  margin-top: 0;
}

h1 {
  margin-bottom: 0.25rem;
}

h3 {
  margin-bottom: 0.2rem;
}
</style>
