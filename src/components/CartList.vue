<template>
  <div>
    <h2>Cart</h2>
    <div v-if="cart.length === 0">Your cart is empty</div>
    <ul v-else>
      <li v-for="(item, idx) in cart" :key="idx" class="cart-row">
        {{ item.subject }} — £{{ item.price.toFixed(2) }}
        <button @click="$emit('remove', idx)">Remove</button>
      </li>
    </ul>

    <h3>Total: £{{ total.toFixed(2) }}</h3>
  </div>
</template>

<script>
export default {
  name: 'CartList',
  props: {
    cart: { type: Array, required: true },
    total: { type: Number, required: true }
  },
  emits: ['remove']
};
</script>

<style scoped>
.cart-row{display:flex;justify-content:space-between;align-items:center;padding:.25rem 0}
button{cursor:pointer}
</style>
