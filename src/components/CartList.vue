<template>
  <div>
    <h2>Cart</h2>

    <div v-if="cart.length === 0">Your cart is empty</div>

    <ul v-else>
      <li
        v-for="(item, idx) in cart"
        :key="item._id + '-' + idx"
        class="cart-row"
      >
        <div style="flex:1">
          <strong>{{ item.subject }}</strong>
          <div>£{{ item.price.toFixed(2) }} each</div>
        </div>

        <!-- Quantity controls -->
        <div style="display:flex;align-items:center;gap:.5rem">
          <button @click="decrement(idx)" :disabled="item.qty <= 1">-</button>

          <!-- patient input: use localQty to avoid immediate removal while typing -->
          <input
            type="text"
            v-model="localQty[idx]"
            @input="onInput(idx)"
            @blur="onBlur(idx)"
            @keydown.enter.prevent="onEnter(idx)"
            inputmode="numeric"
            style="width:72px;text-align:center"
            :aria-label="`Quantity for ${item.subject}`"
          />

          <button @click="increment(idx)" :disabled="item.qty >= maxFor(item)">+</button>
        </div>

        <!-- Subtotal and remove -->
        <div style="width:140px;text-align:right">
          <div>£{{ (item.price * item.qty).toFixed(2) }}</div>
          <button @click="$emit('remove', idx)">Remove</button>
        </div>
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
    total: { type: Number, required: true },
    // pass lessons to calculate availability for each cart item
    lessons: { type: Array, required: false, default: () => [] }
  },
  emits: ['remove', 'update-quantity'],
  data() {
    return {
      // local string values for quantity inputs; keeps typing isolated
      localQty: []
    };
  },
  watch: {
    // keep localQty synced with external cart changes
    cart: {
      handler(newCart) {
        this.localQty = newCart.map(item => String(item.qty || 0));
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    // return maximum available spaces for this cart item
    maxFor(item) {
      const lesson = this.lessons.find(l => l._id === item._id);
      return lesson ? (lesson.spaces || 0) : Infinity;
    },

    // increment quantity (clamped to max) and emit update
    increment(idx) {
      const item = this.cart[idx];
      const max = this.maxFor(item);
      const newQty = Math.min((item.qty || 0) + 1, max);
      this.$emit('update-quantity', idx, newQty);
      this.$setLocalQty(idx, String(newQty));
    },

    // decrement quantity (down to 0) and emit update
    decrement(idx) {
      const item = this.cart[idx];
      const newQty = Math.max((item.qty || 0) - 1, 0);
      this.$emit('update-quantity', idx, newQty);
      this.$setLocalQty(idx, String(newQty));
    },

    // sanitize input while typing (digits only)
    onInput(idx) {
      const raw = String(this.localQty[idx] || '');
      const cleaned = raw.replace(/\D/g, '');
      this.localQty.splice(idx, 1, cleaned);
    },

    // commit on Enter
    onEnter(idx) {
      this.commitQty(idx);
    },

    // commit on blur (or revert if invalid)
    onBlur(idx) {
      this.commitQty(idx);
    },

    // parse, clamp and emit quantity changes (or remove if zero)
    commitQty(idx) {
      const raw = this.localQty[idx];

      // if empty while typing, revert to the current cart qty
      if (raw === '' || raw == null) {
        const current = this.cart[idx];
        this.localQty.splice(idx, 1, String(current ? (current.qty || 0) : 0));
        return;
      }

      let n = Number(raw);
      if (Number.isNaN(n) || n < 0) n = 0;
      n = Math.trunc(n);

      const item = this.cart[idx];
      if (!item) return;

      const max = this.maxFor(item);
      if (n > max) n = max;

      if (n === 0) {
        // communicate removal via update-quantity (App handles removal)
        this.$emit('update-quantity', idx, 0);
      } else {
        this.$emit('update-quantity', idx, n);
        this.localQty.splice(idx, 1, String(n));
      }
    },

    // safely set localQty value (handles array resizing)
    $setLocalQty(idx, val) {
      while (this.localQty.length < this.cart.length) this.localQty.push('0');
      this.localQty.splice(idx, 1, String(val));
    }
  }
};
</script>

<style scoped>
.cart-row{display:flex;justify-content:space-between;align-items:center;padding:.5rem 0;border-bottom:1px solid #eee}
button{cursor:pointer;padding:.25rem .5rem}
input{padding:.25rem}
</style>
