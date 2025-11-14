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
      <cart-list :cart="cart" :total="cartTotal" @remove="removeFromCart" />

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
        {_id:'2', subject:'English',  location:'Leeds',      price:12, spaces:3},
        {_id:'3', subject:'Science',  location:'Bristol',    price:18, spaces:0},
        {_id:'4', subject:'Art',      location:'London',     price:10, spaces:6},
        {_id:'5', subject:'Music',    location:'Oxford',     price:20, spaces:2},
        {_id:'6', subject:'PE',       location:'Bath',       price:9,  spaces:9},
        {_id:'7', subject:'Coding',   location:'London',     price:22, spaces:4},
        {_id:'8', subject:'Robotics', location:'Cardiff',    price:25, spaces:1},
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
    cartCount() { return this.cart.length; },
    cartTotal() { return this.cart.reduce((s,l)=>s + (l.price||0), 0); },
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
    lessonImage(lesson) {
      return (this.images && this.images[lesson.subject]) || lesson.image || this.placeholder;
    },
    spacesLeft(lesson) {
      const inCart = this.cart.filter(l => l._id === lesson._id).length;
      return (lesson.spaces || 0) - inCart;
    },
    canAddToCart(lesson) { return this.spacesLeft(lesson) > 0; },
    addToCart(lesson) { if (this.canAddToCart(lesson)) this.cart.push(lesson); },
    removeFromCart(index) { this.cart.splice(index, 1); },
    placeOrder() {
      if (!this.canPlaceOrder) return;
      alert('Order have been placed successfully✅');
      this.cart = [];
      this.checkout.name = '';
      this.checkout.phone = '';
      this.showCheckout = false;
    }
  }
};
</script>

<style scoped>
/* Keep the same global styles you had */
body{font-family:system-ui,Arial,sans-serif;margin:0;padding:0 1rem 2rem}
img{width:100%;height:140px;object-fit:cover;border-radius:6px;background:#f5f5f5}
.muted{opacity:.6}
/* small style bits moved into components; keep grid/canvas safe */
</style>
