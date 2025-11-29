<template>
  <!-- v-for must be used for the display of the lesson list -->
  <ul class="grid">
    <lesson-card
      v-for="lesson in lessons"
      :key="lesson._id"
      :lesson="lesson"
      :image="images[lesson.subject] || placeholder"
      :spaces-left="spacesLeftFn(lesson)"
      @add="$emit('add-to-cart', $event)"
    />
  </ul>
</template>

<script>
import LessonCard from './LessonCard.vue';

export default {
  name: 'LessonsGrid',
  components: { LessonCard },

  // data + helpers passed from parent
  props: {
    lessons: { type: Array, required: true },
    images: { type: Object, required: true },
    placeholder: { type: String, required: true },
    spacesLeftFn: { type: Function, required: true }
  },

  emits: ['add-to-cart']
};
</script>

<style scoped>
.grid{list-style:none;display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:1rem;padding:0}
</style>
