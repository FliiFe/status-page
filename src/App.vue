<template>
  <div id="app">
    <home/>
  </div>
</template>

<script>
import Home from './views/Home.vue';

export default {
    components: {
        Home
    }
};
</script>

<style>
html,
body {
    font-family: 'Roboto', sans-serif;
    background-color: #fafafa;
    color: #1c1c1c;
}

#app {
    max-width: 600px;
    margin: 0 auto;
    text-shadow: 0px 0px 0.5px #1c1c1c;
}
</style>
