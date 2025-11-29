<template>
  <!-- each lesson should have at least (5%): Subject (1%), Location (1%), Price (1%), Spaces-->
  <li class="card"> 
    <img :src="image" :alt="lesson.subject" />
    <h3 v-text="lesson.subject"></h3>
    <p><span v-text="lesson.location"></span></p>
    <p>£{{ lesson.price.toFixed(2) }}</p>

    <!-- stock messaging -->
    <p :class="{muted: spacesLeft===0}" v-if="spacesLeft > 5">
      In stock ({{ spacesLeft }})
    </p>
    <p :class="{muted: spacesLeft===0}" v-else-if="spacesLeft > 0">
      Only {{ spacesLeft }} left
    </p>
    <p class="muted" v-else>Out of stock</p>

    <!-- each lesson must have an “Add to Cart” button  -->
     <!-- the button is always visible, and only enabled when space is larger than 0 -->
      <!-- clicking the button once (related interactions implemented by using v-on)
        will add one space to the shopping cart, reducing the remaining space by one -->
    <button @click="$emit('add', lesson)" :disabled="spacesLeft === 0">
      Add to cart
    </button>
  </li>
</template>

<script>
export default {
  name: 'LessonCard',

  // lesson details + computed stock from parent
  props: {
    lesson: { type: Object, required: true },
    image: { type: String, required: true },
    spacesLeft: { type: Number, required: true }
  },

  emits: ['add']
};
</script>

<style scoped>
.card{border:1px solid #ddd;border-radius:8px;padding:.75rem}
img{width:100%;height:140px;object-fit:cover;border-radius:6px;background:#f5f5f5}
button{cursor:pointer}
.muted{opacity:.6}
</style>
