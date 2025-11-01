<template>
  <div id="app">
    <header>
      <h1>{{ title }}</h1>
      <button @click="showCheckout = !showCheckout">
        {{ showCheckout ? 'Back to Lessons' : 'Go to Checkout' }} ({{ cartCount }})
      </button>
    </header>

    <section v-if="!showCheckout">
      <div class="controls">
        <label>Sort by
          <select v-model="sortBy">
            <option value="subject">Subject</option>
            <option value="location">Location</option>
            <option value="price">Price</option>
            <option value="spaces">Spaces</option>
          </select>
        </label>
        <label>Direction
          <select v-model="sortDir">
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </label>
      </div>

      <ul class="grid">
        <li v-for="lesson in sortedLessons" :key="lesson._id" class="card">
          <img :src="lesson.image || placeholder" :alt="lesson.subject" />
          <h3 v-text="lesson.subject"></h3>
          <p><span v-text="lesson.location"></span></p>
          <p>£{{ lesson.price.toFixed(2) }}</p>

          <p :class="{muted: spacesLeft(lesson)===0}" v-if="spacesLeft(lesson) > 5">
            In stock ({{ spacesLeft(lesson) }})
          </p>
          <p :class="{muted: spacesLeft(lesson)===0}" v-else-if="spacesLeft(lesson) > 0">
            Only {{ spacesLeft(lesson) }} left
          </p>
          <p class="muted" v-else>Out of stock</p>

          <button @click="addToCart(lesson)" :disabled="!canAddToCart(lesson)">
            Add to cart
          </button>
        </li>
      </ul>
    </section>

    <section v-else>
      <h2>Cart</h2>
      <div v-if="cart.length === 0">Your cart is empty</div>
      <ul v-else>
        <li v-for="(item, idx) in cart" :key="idx" class="cart-row">
          {{ item.subject }} — £{{ item.price.toFixed(2) }}
          <button @click="removeFromCart(idx)">Remove</button>
        </li>
      </ul>

      <h3>Total: £{{ cartTotal.toFixed(2) }}</h3>

      <h2>Checkout</h2>
      <form @submit.prevent="placeOrder">
        <label>
          Name
          <input v-model.trim="checkout.name" placeholder="Jane Doe" />
        </label>
        <small v-if="!validName && checkout.name.length">Name must be letters and spaces only</small>

        <label>
          Phone
          <input v-model.trim="checkout.phone" placeholder="07123456789" />
        </label>
        <small v-if="!validPhone && checkout.phone.length">Phone must be digits only</small>

        <button type="submit" :disabled="!canPlaceOrder">Place Order (front end only)</button>
      </form>
    </section>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      title: 'After School Lessons',
      placeholder: 'https://via.placeholder.com/320x180?text=Lesson',
      lessons: [
        {_id:'1', subject:'Math',    location:'London',   price:15, spaces:8},
        {_id:'2', subject:'English', location:'Leeds',    price:12, spaces:3},
        {_id:'3', subject:'Science', location:'Bristol',  price:18, spaces:0},
        {_id:'4', subject:'Art',     location:'London',   price:10, spaces:6},
        {_id:'5', subject:'Music',   location:'Oxford',   price:20, spaces:2},
        {_id:'6', subject:'PE',      location:'Bath',     price:9,  spaces:9},
        {_id:'7', subject:'Coding',  location:'London',   price:22, spaces:4},
        {_id:'8', subject:'Robotics',location:'Cardiff',  price:25, spaces:1},
        {_id:'9', subject:'Drama',   location:'Leeds',    price:11, spaces:7},
        {_id:'10',subject:'History', location:'Manchester',price:14,spaces:5}
      ],
      cart: [],
      sortBy: 'subject',
      sortDir: 'asc',
      showCheckout: false,
      checkout: { name: '', phone: '' }
    };
  },
  computed: {
    cartCount() { return this.cart.length; },
    cartTotal() { return this.cart.reduce((s,l)=>s + (l.price||0), 0); },
    validName() { return /^[A-Za-z ]+$/.test(this.checkout.name || ''); },
    validPhone() { return /^[0-9]+$/.test(this.checkout.phone || ''); },
    canPlaceOrder() { return this.cart.length > 0 && this.validName && this.validPhone; },
    sortedLessons() {
      const key = this.sortBy;
      const dir = this.sortDir === 'asc' ? 1 : -1;
      return [...this.lessons].sort((a,b)=>{
        const va = a[key], vb = b[key];
        if (typeof va === 'string' && typeof vb === 'string') return va.localeCompare(vb)*dir;
        return (va - vb)*dir;
      });
    }
  },
  methods: {
    spacesLeft(lesson) {
      const inCart = this.cart.filter(l => l._id === lesson._id).length;
      return (lesson.spaces || 0) - inCart;
    },
    canAddToCart(lesson) { return this.spacesLeft(lesson) > 0; },
    addToCart(lesson) { if (this.canAddToCart(lesson)) this.cart.push(lesson); },
    removeFromCart(index) { this.cart.splice(index, 1); },
    placeOrder() {
      if (!this.canPlaceOrder) return;
      alert('Order validated on front end only. No backend calls made.');
      this.cart = [];
      this.checkout.name = '';
      this.checkout.phone = '';
      this.showCheckout = false;
    }
  }
};
</script>

<style scoped>
body{font-family:system-ui,Arial,sans-serif;margin:0;padding:0 1rem 2rem}
header{display:flex;justify-content:space-between;align-items:center;padding:1rem 0}
.controls{display:flex;gap:.75rem;align-items:center;margin:.5rem 0 1rem}
.grid{list-style:none;display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:1rem;padding:0}
.card{border:1px solid #ddd;border-radius:8px;padding:.75rem}
img{width:100%;height:140px;object-fit:cover;border-radius:6px;background:#f5f5f5}
button{cursor:pointer}
.cart-row{display:flex;justify-content:space-between;align-items:center;padding:.25rem 0}
small{color:#b00;display:block;margin-top:.25rem}
.muted{opacity:.6}
</style>
