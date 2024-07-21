<template>
  <header>
    <Header />
  </header>
  <main>
    <Main />
  </main>
</template>

<script setup>
import Header from './components/Header.vue'
import Main from './components/Main.vue'
</script>

<style scoped>
header {
  background-color: #f0f0f0;
  border-bottom: 1px solid black;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 10vh;
}

.header-content {
  padding: 1rem;
}

main {
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 90vh;
  overflow: hidden;
}
</style>