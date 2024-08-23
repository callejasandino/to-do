import { defineComponent, onMounted, ref } from 'vue'

export default defineComponent({
  props: {
    attachments: {
      type: Array, // Changed to Array for handling multiple attachments
      required: true
    }
  },

  setup(props) {
    const currentIndex = ref(0)
    const slides = ref([])

    onMounted(() => {
      // Populate slides with the provided attachments
      props.attachments.forEach((attachment) => {
        slides.value.push({
          name: attachment.name,
          type: attachment.type,
          url: attachment.url
        })
      })
    })

    const nextSlide = () => {
      if (slides.value.length > 0) {
        currentIndex.value = (currentIndex.value + 1) % slides.value.length
      }
    }

    const prevSlide = () => {
      if (slides.value.length > 0) {
        currentIndex.value = (currentIndex.value - 1 + slides.value.length) % slides.value.length
      }
    }

    return {
      currentIndex,
      nextSlide,
      prevSlide,
      slides
    }
  }
})
