<template>
  <header>
    <h1>{{ title }}</h1>
    <button
  @click="$emit('toggle-checkout')"
  :disabled="cartCount === 0"
   aria-disabled="cartCount === 0"
>
  {{ showCheckout ? 'Back to Lessons' : 'Go to Checkout' }} ({{ cartCount }})
</button>
  </header>
</template>

<script>
export default {
  name: 'AppHeader',
  props: {
    title: { type: String, required: true },
    cartCount: { type: Number, required: true },
    showCheckout: { type: Boolean, required: true }
  }
};
</script>

<style scoped>
header{display:flex;justify-content:space-between;align-items:center;padding:1rem 0}
button{cursor:pointer}
</style>
