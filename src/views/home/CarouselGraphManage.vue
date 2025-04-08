<template>
  <div class="carousel-graph-manage">
    <h1>Carousel Graph Management</h1>
    <button @click="navigateToDetails">Go to Details</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateToDetails = () => {
  router.push({ name: 'carousel-add' }) // Replace 'DetailsPage' with your route name
}
</script>

<style scoped>

</style>