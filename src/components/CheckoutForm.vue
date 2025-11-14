<template>
  <div>
    <h2>Checkout</h2>
    <form @submit.prevent="$emit('place')">
      <label>
        Name
        <input :value="checkout.name" @input="onName" placeholder="Jane Doe" />
      </label>
      <small v-if="!validName && checkout.name.length">Name must be letters and spaces only</small>

      <label>
        Phone
        <input :value="checkout.phone" @input="onPhone" placeholder="07123456789" />
      </label>
      <small v-if="!validPhone && checkout.phone.length">Phone must be digits only</small>

      <button type="submit" :disabled="!canPlace">Place Order</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'CheckoutForm',
  props: {
    checkout: { type: Object, required: true },
    validName: { type: Boolean, required: true },
    validPhone: { type: Boolean, required: true },
    canPlace: { type: Boolean, required: true }
  },
  emits: ['update:checkout', 'place'],
  methods: {
    onName(e) {
      this.$emit('update:checkout', { ...this.checkout, name: e.target.value.trim() });
    },
    onPhone(e) {
      this.$emit('update:checkout', { ...this.checkout, phone: e.target.value.trim() });
    }
  }
};
</script>

<style scoped>
small{color:#b00;display:block;margin-top:.25rem}
button{cursor:pointer}
</style>
