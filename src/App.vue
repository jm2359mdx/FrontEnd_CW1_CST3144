<template>
  <!-- Root application container where Vue mounts -->
  <div id="app">
    <!-- Top bar with title and a toggle to switch between list and checkout -->
    <header>
      <!-- App title bound from data -->
      <h1>{{ title }}</h1>
      <!-- Click toggles between lessons list and checkout view -->
      <button @click="showCheckout = !showCheckout">
        <!-- Dynamic button label and cart count -->
        {{ showCheckout ? 'Back to Lessons' : 'Go to Checkout' }} ({{ cartCount }})
      </button>
    </header>

    <!-- Lessons/catalog section: visible when NOT in checkout -->
    <section v-if="!showCheckout">
      <!-- Controls row holds search + sorting UI -->
      <div class="controls">
        <!-- Search box: two-way bound to 'search'; filters subject/location -->
        <label>
          Search
          <input
            v-model.trim="search"
            placeholder="Search subject or location"
            style="max-width: 240px"
          />
        </label>

        <!-- Field to sort by -->
        <label>Sort by
          <!-- Two-way bind selected sort key -->
          <select v-model="sortBy">
            <option value="subject">Subject</option>
            <option value="location">Location</option>
            <option value="price">Price</option>
            <option value="spaces">Spaces</option>
          </select>
        </label>
        <!-- Asc/Desc direction picker -->
        <label>Direction
          <!-- Two-way bind sort direction -->
          <select v-model="sortDir">
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </label>
      </div>

      <!-- Responsive grid of lesson cards -->
      <ul class="grid">
        <!-- Render each lesson; key helps Vue track items efficiently -->
        <li v-for="lesson in sortedLessons" :key="lesson._id" class="card">
          <!-- Lesson image with placeholder fallback and accessible alt -->
          <img :src="lesson.image || placeholder" :alt="lesson.subject" />
          <!-- Lesson subject -->
          <h3 v-text="lesson.subject"></h3>
          <!-- Lesson location -->
          <p><span v-text="lesson.location"></span></p>
          <!-- Lesson price formatted to 2 decimals -->
          <p>£{{ lesson.price.toFixed(2) }}</p>

          <!-- Stock message when many spaces left; muted if zero -->
          <p :class="{muted: spacesLeft(lesson)===0}" v-if="spacesLeft(lesson) > 5">
            In stock ({{ spacesLeft(lesson) }})
          </p>
          <!-- Low-stock message when between 1 and 5 remaining -->
          <p :class="{muted: spacesLeft(lesson)===0}" v-else-if="spacesLeft(lesson) > 0">
            Only {{ spacesLeft(lesson) }} left
          </p>
          <!-- Out-of-stock message when none left -->
          <p class="muted" v-else>Out of stock</p>

          <!-- Add-to-cart disabled if cannot add (no spaces left) -->
          <button @click="addToCart(lesson)" :disabled="!canAddToCart(lesson)">
            Add to cart
          </button>
        </li>
      </ul>
    </section>

    <!-- Checkout section: visible when toggled on -->
    <section v-else>
      <!-- Cart summary header -->
      <h2>Cart</h2>
      <!-- Empty state when no items -->
      <div v-if="cart.length === 0">Your cart is empty</div>
      <!-- List cart items when present -->
      <ul v-else>
        <!-- Show each cart item with remove button -->
        <li v-for="(item, idx) in cart" :key="idx" class="cart-row">
          {{ item.subject }} — £{{ item.price.toFixed(2) }}
          <button @click="removeFromCart(idx)">Remove</button>
        </li>
      </ul>

      <!-- Cart total value -->
      <h3>Total: £{{ cartTotal.toFixed(2) }}</h3>

      <!-- Checkout form for simple name/phone capture -->
      <h2>Checkout</h2>
      <!-- Prevent default submit; call placeOrder method -->
      <form @submit.prevent="placeOrder">
        <!-- Name input with trimming and validation hint -->
        <label>
          Name
          <input v-model.trim="checkout.name" placeholder="Jane Doe" />
        </label>
        <!-- Show validation message only when user typed something invalid -->
        <small v-if="!validName && checkout.name.length">Name must be letters and spaces only</small>

        <!-- Phone input with trimming and validation hint -->
        <label>
          Phone
          <input v-model.trim="checkout.phone" placeholder="07123456789" />
        </label>
        <!-- Show validation message only when user typed something invalid -->
        <small v-if="!validPhone && checkout.phone.length">Phone must be digits only</small>

        <!-- Submit disabled until cart has items and fields are valid -->
        <button type="submit" :disabled="!canPlaceOrder">Place Order </button>
      </form>
    </section>
  </div>
</template>

<script>
export default {
  // Component name for tooling/debugging
  name: 'App',
  data() {
    // Reactive state for the app (catalog, cart, UI state)
    return {
      // Title shown in header
      title: 'After School Lessons',
      // Fallback image used when lesson.image is missing
      placeholder: 'https://via.placeholder.com/320x180?text=Lesson',
      // Static catalog of lessons for this demo (would be fetched in real app)
      lessons: [
        {_id:'1', subject:'Math',    location:'London',    price:15, spaces:8},
        {_id:'2', subject:'English', location:'Leeds',     price:12, spaces:3},
        {_id:'3', subject:'Science', location:'Bristol',   price:18, spaces:0},
        {_id:'4', subject:'Art',     location:'London',    price:10, spaces:6},
        {_id:'5', subject:'Music',   location:'Oxford',    price:20, spaces:2},
        {_id:'6', subject:'PE',      location:'Bath',      price:9,  spaces:9},
        {_id:'7', subject:'Coding',  location:'London',    price:22, spaces:4},
        {_id:'8', subject:'Robotics',location:'Cardiff',   price:25, spaces:1},
        {_id:'9', subject:'Drama',   location:'Leeds',     price:11, spaces:7},
        {_id:'10',subject:'History', location:'Manchester',price:14,spaces:5}
      ],
      // Simple array cart storing lesson references
      cart: [],
      // Current sort field key
      sortBy: 'subject',
      // Current sort direction
      sortDir: 'asc',
      // Search text used to filter lessons (subject/location)
      search: '',
      // Toggle between list and checkout views
      showCheckout: false,
      // Checkout form model
      checkout: { name: '', phone: '' }
    };
  },
  computed: {
    // Number of items currently in cart
    cartCount() { return this.cart.length; },
    // Sum of item prices in cart (defaults price to 0 if missing)
    cartTotal() { return this.cart.reduce((s,l)=>s + (l.price||0), 0); },
    // True if name contains only letters and spaces
    validName() { return /^[A-Za-z ]+$/.test(this.checkout.name || ''); },
    // True if phone contains only digits
    validPhone() { return /^[0-9]+$/.test(this.checkout.phone || ''); },
    // Submit allowed only when cart has items and both fields are valid
    canPlaceOrder() { return this.cart.length > 0 && this.validName && this.validPhone; },

    // Filter lessons first by search query (case-insensitive) on subject/location
    filteredLessons() {
      const q = (this.search || '').toLowerCase().trim();
      if (!q) return this.lessons;
      return this.lessons.filter(l => {
        const subject = String(l.subject || '').toLowerCase();
        const location = String(l.location || '').toLowerCase();
        return subject.includes(q) || location.includes(q);
      });
    },

    // Return a new array of lessons sorted by selected key and direction (after filtering)
    sortedLessons() {
      // Determine sort key and direction multiplier
      const key = this.sortBy;
      const dir = this.sortDir === 'asc' ? 1 : -1;
      // Copy filtered array (avoid mutating original) and sort accordingly
      return [...this.filteredLessons].sort((a,b)=>{
        const va = a[key], vb = b[key];
        // For strings, use localeCompare; for numbers, subtract
        if (typeof va === 'string' && typeof vb === 'string') return va.localeCompare(vb)*dir;
        return (va - vb)*dir;
      });
    }
  },
  methods: {
    // Compute remaining spaces after accounting for items of this lesson in cart
    spacesLeft(lesson) {
      const inCart = this.cart.filter(l => l._id === lesson._id).length;
      return (lesson.spaces || 0) - inCart;
    },
    // Allow add when at least one space remains
    canAddToCart(lesson) { return this.spacesLeft(lesson) > 0; },
    // Push lesson into cart only if allowed
    addToCart(lesson) { if (this.canAddToCart(lesson)) this.cart.push(lesson); },
    // Remove a cart item by its index
    removeFromCart(index) { this.cart.splice(index, 1); },
    // Validate and then simulate placing an order
    placeOrder() {
      // Guard: do nothing if form invalid or cart empty
      if (!this.canPlaceOrder) return;
      // Simple confirmation for demo purposes
      alert('Order have been placed successfully✅`');
      // Reset cart and checkout fields after “placing” the order
      this.cart = [];
      this.checkout.name = '';
      this.checkout.phone = '';
      // Return to lessons view
      this.showCheckout = false;
    }
  }
};
</script>

<style scoped>
/* Global typography and spacing baseline */
body{font-family:system-ui,Arial,sans-serif;margin:0;padding:0 1rem 2rem}
/* Header layout: title and toggle button */
header{display:flex;justify-content:space-between;align-items:center;padding:1rem 0}
/* Controls row for search and sorting UI */
.controls{display:flex;gap:.75rem;align-items:center;margin:.5rem 0 1rem}
/* Responsive card grid */
.grid{list-style:none;display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:1rem;padding:0}
/* Individual lesson card styling */
.card{border:1px solid #ddd;border-radius:8px;padding:.75rem}
/* Uniform image presentation */
img{width:100%;height:140px;object-fit:cover;border-radius:6px;background:#f5f5f5}
/* Make buttons clickable by default cursor */
button{cursor:pointer}
/* Cart rows spaced and aligned */
.cart-row{display:flex;justify-content:space-between;align-items:center;padding:.25rem 0}
/* Validation/error helper text */
small{color:#b00;display:block;margin-top:.25rem}
/* Muted text utility */
.muted{opacity:.6}
</style>
