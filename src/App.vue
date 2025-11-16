<template>
  <div id="app">
    <app-header
      :title="title"
      :cart-count="cartCount"
      :show-checkout="showCheckout"
      @toggle-checkout="showCheckout = !showCheckout"
    />

    <section v-if="!showCheckout">
      <controls-bar
        :search="search"
        :sort-by="sortBy"
        :sort-dir="sortDir"
        @update:search="search = $event"
        @update:sortBy="sortBy = $event"
        @update:sortDir="sortDir = $event"
      />

      <lessons-grid
        :lessons="sortedLessons"
        :images="images"
        :placeholder="placeholder"
        :spaces-left-fn="spacesLeft"
        @add-to-cart="addToCart"
      />
    </section>

    <section v-else>
     <cart-list
  :cart="cart"
  :total="cartTotal"
  :lessons="lessons"
  @remove="removeFromCart"
  @update-quantity="updateCartQuantity"
/>

      <checkout-form
        :checkout="checkout"
        :valid-name="validName"
        :valid-phone="validPhone"
        :can-place="canPlaceOrder"
        @update:checkout="checkout = $event"
        @place="placeOrder"
      />
    </section>
  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue';
import ControlsBar from './components/ControlsBar.vue';
import LessonsGrid from './components/LessonsGrid.vue';
import CartList from './components/CartList.vue';
import CheckoutForm from './components/CheckoutForm.vue';

export default {
  name: 'App',
  components: { AppHeader, ControlsBar, LessonsGrid, CartList, CheckoutForm },
  data() {
    return {
      title: 'After School Lessons',
      placeholder: 'https://via.placeholder.com/320x180?text=Lesson',
      images: {
        Math: new URL('./assets/lessons/math.png', import.meta.url).href,
        English: new URL('./assets/lessons/english.png', import.meta.url).href,
        Science: new URL('./assets/lessons/science.png', import.meta.url).href,
        Art: new URL('./assets/lessons/art.png', import.meta.url).href,
        Music: new URL('./assets/lessons/music.png', import.meta.url).href,
        PE: new URL('./assets/lessons/pe.png', import.meta.url).href,
        Coding: new URL('./assets/lessons/coding.png', import.meta.url).href,
        Robotics: new URL('./assets/lessons/robotics.png', import.meta.url).href,
        Drama: new URL('./assets/lessons/drama.png', import.meta.url).href,
        History: new URL('./assets/lessons/history.png', import.meta.url).href
      },
      lessons: [
        {_id:'1', subject:'Math',     location:'London',     price:15, spaces:8},
        {_id:'2', subject:'English',  location:'Leeds',      price:12, spaces:5},
        {_id:'3', subject:'Science',  location:'Bristol',    price:18, spaces:8},
        {_id:'4', subject:'Art',      location:'London',     price:10, spaces:6},
        {_id:'5', subject:'Music',    location:'Oxford',     price:20, spaces:7},
        {_id:'6', subject:'PE',       location:'Bath',       price:9,  spaces:9},
        {_id:'7', subject:'Coding',   location:'London',     price:22, spaces:6},
        {_id:'8', subject:'Robotics', location:'Cardiff',    price:25, spaces:5},
        {_id:'9', subject:'Drama',    location:'Leeds',      price:11, spaces:7},
        {_id:'10',subject:'History',  location:'Manchester', price:14, spaces:5}
      ],
      cart: [],
      sortBy: 'subject',
      sortDir: 'asc',
      search: '',
      showCheckout: false,
      checkout: { name: '', phone: '' }
    };
  },
  computed: {
    cartCount() {
    return this.cart.reduce((total, item) => total + (item.qty || 0), 0);
  },
     cartTotal() {
    return this.cart.reduce((s, item) => s + (item.price || 0) * (item.qty || 0), 0);
  },
    validName() { return /^[A-Za-z ]+$/.test(this.checkout.name || ''); },
    validPhone() { return /^[0-9]+$/.test(this.checkout.phone || ''); },
    canPlaceOrder() { return this.cart.length > 0 && this.validName && this.validPhone; },
    filteredLessons() {
      const q = (this.search || '').toLowerCase().trim();
      if (!q) return this.lessons;
      return this.lessons.filter(l => {
        const subject = String(l.subject || '').toLowerCase();
        const location = String(l.location || '').toLowerCase();
        return subject.includes(q) || location.includes(q);
      });
    },
    sortedLessons() {
      const key = this.sortBy;
      const dir = this.sortDir === 'asc' ? 1 : -1;
      return [...this.filteredLessons].sort((a,b)=>{
        const va = a[key], vb = b[key];
        if (typeof va === 'string' && typeof vb === 'string') return va.localeCompare(vb)*dir;
        return (va - vb)*dir;
      });
    }
  },
methods: {
  // Resolve the correct image for a lesson with safe fallbacks
  lessonImage(lesson) {
    return (this.images && this.images[lesson.subject]) || lesson.image || this.placeholder;
  },

  // Compute remaining spaces after accounting for items of this lesson in cart (using qty)
  spacesLeft(lesson) {
    const cartItem = this.cart.find(i => i._id === lesson._id);
    const inCartQty = cartItem ? (cartItem.qty || 0) : 0;
    return (lesson.spaces || 0) - inCartQty;
  },

  // Allow add when at least one space remains
  canAddToCart(lesson) {
    return this.spacesLeft(lesson) > 0;
  },

  // Add one to cart (increment qty if exists)
  addToCart(lesson) {
    if (!this.canAddToCart(lesson)) return;
    const existing = this.cart.find(i => i._id === lesson._id);
    if (existing) {
      // ensure we don't exceed available spaces
      const left = (lesson.spaces || 0) - (existing.qty || 0);
      if (left <= 0) return;
      existing.qty = (existing.qty || 0) + 1;
    } else {
      // push a new cart item with qty: 1
      this.cart.push({
        _id: lesson._id,
        subject: lesson.subject,
        price: lesson.price,
        qty: 1
      });
    }
  },

  // Remove entire cart item by index
  removeFromCart(index) {
    this.cart.splice(index, 1);
  },

  // Update quantity of a cart item (index) to newQty (number)
  updateCartQuantity(index, newQty) {
    // sanitize and clamp newQty to integer >= 0
    let qty = Number(newQty) || 0;
    if (qty < 0) qty = 0;

    const cartItem = this.cart[index];
    if (!cartItem) return;

    // find the corresponding lesson to know the max available spaces
    const lesson = this.lessons.find(l => l._id === cartItem._id);
    const maxAvailable = lesson ? (lesson.spaces || 0) : Infinity;

    // clamp to maxAvailable
    if (qty > maxAvailable) qty = maxAvailable;

    if (qty === 0) {
      // remove item if qty set to zero
      this.cart.splice(index, 1);
    } else {
      this.cart[index].qty = qty;
    }
  },

  // Validate and then simulate placing an order
  placeOrder() {
    if (!this.canPlaceOrder) return;
    alert('Order have been placed successfully✅');
    this.cart = [];
    this.checkout.name = '';
    this.checkout.phone = '';
    this.showCheckout = false;
  }
}}
</script>

<style scoped>
/* Keep the same global styles you had */
body{font-family:system-ui,Arial,sans-serif;margin:0;padding:0 1rem 2rem}
img{width:100%;height:140px;object-fit:cover;border-radius:6px;background:#f5f5f5}
.muted{opacity:.6}
/* small style bits moved into components; keep grid/canvas safe */
</style>
