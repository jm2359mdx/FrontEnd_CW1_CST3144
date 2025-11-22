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

      // images stay the same
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

      // lessons loaded from backend
      lessons: [],

      cart: [],
      sortBy: 'subject',
      sortDir: 'asc',
      search: '',
      showCheckout: false,
      checkout: { name: '', phone: '' }
    };
  },

  mounted() {
    // initial load
    this.fetchLessons();

    // prepare debounced search function
    this._debouncedFetchSearch = this.debounce(this.fetchSearch, 300);
  },

  watch: {
    // search-as-you-type: call debounced fetch on each change
    search(newVal) {
      if (this._debouncedFetchSearch) this._debouncedFetchSearch(newVal);
    }
  },

  computed: {
    cartCount() {
      return this.cart.reduce((total, item) => total + (item.qty || 0), 0);
    },

    cartTotal() {
      return this.cart.reduce(
        (s, item) => s + (item.price || 0) * (item.qty || 0),
        0
      );
    },

    validName() {
      return /^[A-Za-z ]+$/.test(this.checkout.name || '');
    },

    validPhone() {
      return /^[0-9]+$/.test(this.checkout.phone || '');
    },

    canPlaceOrder() {
      return this.cart.length > 0 && this.validName && this.validPhone;
    },

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
      return [...this.filteredLessons].sort((a, b) => {
        const va = a[key],
          vb = b[key];
        if (typeof va === 'string' && typeof vb === 'string')
          return va.localeCompare(vb) * dir;
        return (va - vb) * dir;
      });
    }
  },

  methods: {
    // debounce helper
    debounce(fn, wait = 300) {
      let t = null;
      return function (...args) {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, args), wait);
      }.bind(this);
    },

    // fetch all lessons
    async fetchLessons() {
      try {
        const res = await fetch("http://localhost:3000/lessons");
        if (!res.ok) throw new Error('Failed to load lessons');
        const data = await res.json();
        this.lessons = data.map(l => ({ ...l, _id: String(l._id) }));
      } catch (err) {
        console.error("fetchLessons error:", err);
      }
    },

    // call backend search endpoint (server-side filtering)
    async fetchSearch(q) {
      try {
        // if empty -> reload all
        if (!q || !q.trim()) {
          await this.fetchLessons();
          return;
        }

        const url = new URL("http://localhost:3000/search");
        url.searchParams.set('q', q);

        const res = await fetch(url.toString());
        if (!res.ok) throw new Error('Search failed');
        const data = await res.json();
        this.lessons = data.map(l => ({ ...l, _id: String(l._id) }));
      } catch (err) {
        console.error('Search fetch error:', err);
      }
    },

    lessonImage(lesson) {
      return (
        (this.images && this.images[lesson.subject]) ||
        lesson.image ||
        this.placeholder
      );
    },

    spacesLeft(lesson) {
      const cartItem = this.cart.find(i => i._id === lesson._id);
      const inCartQty = cartItem ? cartItem.qty : 0;
      return (lesson.spaces || 0) - inCartQty;
    },

    canAddToCart(lesson) {
      return this.spacesLeft(lesson) > 0;
    },

    addToCart(lesson) {
      if (!this.canAddToCart(lesson)) return;
      const existing = this.cart.find(i => i._id === lesson._id);
      if (existing) {
        const left = (lesson.spaces || 0) - existing.qty;
        if (left <= 0) return;
        existing.qty++;
      } else {
        this.cart.push({
          _id: lesson._id,
          subject: lesson.subject,
          price: lesson.price,
          qty: 1
        });
      }
    },

    removeFromCart(index) {
      this.cart.splice(index, 1);
    },

    updateCartQuantity(index, newQty) {
      let qty = Number(newQty) || 0;
      if (qty < 0) qty = 0;

      const cartItem = this.cart[index];
      if (!cartItem) return;

      const lesson = this.lessons.find(l => l._id === cartItem._id);
      const max = lesson ? lesson.spaces : Infinity;

      if (qty > max) qty = max;

      if (qty === 0) {
        this.cart.splice(index, 1);
      } else {
        this.cart[index].qty = qty;
      }
    },

    // POST order then update lesson spaces via PUTs
    async placeOrder() {
      if (!this.canPlaceOrder) return;

      const order = {
        name: this.checkout.name,
        phone: this.checkout.phone,
        items: this.cart.map(i => ({
          lessonId: i._id,
          qty: i.qty
        }))
      };

      try {
        // 1. POST ORDER
        const orderRes = await fetch("http://localhost:3000/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(order)
        });
        if (!orderRes.ok) throw new Error("Order POST failed");

        // 2. UPDATE SPACES IN BACKEND
        await Promise.all(
          order.items.map(async i => {
            const lesson = this.lessons.find(l => l._id === i.lessonId);
            if (!lesson) return;

            const newSpaces = Math.max(0, lesson.spaces - i.qty);

            await fetch(`http://localhost:3000/lessons/${i.lessonId}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ spaces: newSpaces })
            });

            // update local UI
            lesson.spaces = newSpaces;
          })
        );

        alert("Order placed successfully! 🎉");

        // 3. RESET CART + CHECKOUT FIELDS
        this.cart = [];
        this.checkout = { name: "", phone: "" };
        this.showCheckout = false;

      } catch (err) {
        console.error("placeOrder error:", err);
        alert("Order failed — try again.");
      }
    }
  }
};
</script>

<style scoped>
body {
  font-family: system-ui, Arial, sans-serif;
  margin: 0;
  padding: 0 1rem 2rem;
}
img {
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-radius: 6px;
  background: #f5f5f5;
}
.muted {
  opacity: 0.6;
}
</style>
