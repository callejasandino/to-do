<template>
  <div class="relative overflow-hidden w-full h-64">
    <!-- Carousel Wrapper -->
    <div class="flex transition-transform duration-500 ease-out w-full h-full">
      <!-- Carousel Items -->
      <div v-if="slides[currentIndex] && (slides[currentIndex].type == 'image/png' || slides[currentIndex].type == 'image/jpeg')" class="flex-shrink-0 w-full h-full">
        <img :src="slides[currentIndex].url" :alt="slides[currentIndex].name" class="w-full h-full object-contain" />
      </div>

      <div v-if="slides[currentIndex] && slides[currentIndex].type == 'video/mp4'" class="flex-shrink-0 w-full h-full">
        <video :src="slides[currentIndex].url" class="w-full h-full object-fill" controls />
      </div>

      <div v-else-if="slides[currentIndex]" class="flex-shrink-0 w-full h-full flex items-center justify-center">
        <a :href="slides[currentIndex].url" target="_blank">{{ slides[currentIndex].name }}</a>
      </div>
    </div>

    <!-- Controls -->
    <div v-if="slides.length > 1">
      <button class="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 text-white p-2" @click="prevSlide"><</button>
      <button class="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 text-white p-2" @click="nextSlide">></button>
    </div>
  </div>
</template>

<script src="./Carousel.js"></script>

<style lang="scss" scoped></style>
