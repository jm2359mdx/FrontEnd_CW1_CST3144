<template>
  <header>
    <!-- title + checkout toggle -->
    <h1>{{ title }}</h1>

    <!-- the shopping cart button should only be enabled after at least one lesson is added to cart  -->
    <button
    @click="$emit('toggle-checkout')"
    :disabled="!showCheckout && cartCount === 0"
    :aria-disabled="!showCheckout && cartCount === 0"
    >
    <!-- clicking the shopping cart button should show the cart page, and clicking the button again goes back to the lesson page  -->
  {{ showCheckout ? 'Back to Lessons' : 'Go to Checkout' }} ({{ cartCount }})
</button>

  </header>
</template>

<script>
export default {
  name: 'AppHeader',

  // incoming header data from parent
  props: {
    title: { type: String, required: true },
    cartCount: { type: Number, required: true },
    showCheckout: { type: Boolean, required: true }
  }
};
</script>

<style scoped>
/* simple layout for header */
header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; }
button { cursor: pointer; }
</style>
