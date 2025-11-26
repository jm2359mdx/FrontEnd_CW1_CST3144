<template>
  <div>
    <h2>Checkout</h2>

    <!-- simple checkout form, emits updates to parent -->
    <form @submit.prevent="$emit('place')">

      <label>
        Name
        <input
          :value="checkout.name"
          @input="$emit('update:checkout', { ...checkout, name: $event.target.value })"
          @blur="$emit('update:checkout', { ...checkout, name: (checkout.name || '').trim() })"
          placeholder="Jane Doe"
          aria-label="Full name"
        />
      </label>

      <!-- name validation message -->
      <small v-if="!validName && (checkout.name || '').length">
        Name must be letters and spaces only
      </small>

      <label>
        Phone
        <input
          :value="checkout.phone"
          @input="$emit('update:checkout', { ...checkout, phone: $event.target.value })"
          @blur="$emit('update:checkout', { ...checkout, phone: (checkout.phone || '').trim() })"
          placeholder="07123456789"
          inputmode="numeric"
          aria-label="Phone number"
        />
      </label>

      <!-- phone validation message -->
      <small v-if="!validPhone && (checkout.phone || '').length">
        Phone must be digits only
      </small>

      <!-- submit disabled until all validations satisfied -->
      <button type="submit" :disabled="!canPlace">Place Order</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'CheckoutForm',

  // parent controls validation + checkout model
  props: {
    checkout: { type: Object, required: true },
    validName: { type: Boolean, required: true },
    validPhone: { type: Boolean, required: true },
    canPlace: { type: Boolean, required: true }
  },

  emits: ['update:checkout', 'place']
};
</script>

<style scoped>
small{color:#b00;display:block;margin-top:.25rem}
button{cursor:pointer}
</style>
