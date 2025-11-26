<template>
  <div class="controls">
    <!-- search + sorting controls for lesson list -->
    <label>
      Search
      <input
        :value="search"
        @input="$emit('update:search', $event.target.value.trim())"
        placeholder="Search subject or location"
        style="max-width:240px"
      />
    </label>

    <label>
      Sort by
      <select :value="sortBy" @change="$emit('update:sortBy', $event.target.value)">
        <option value="subject">Subject</option>
        <option value="location">Location</option>
        <option value="price">Price</option>
        <option value="spaces">Spaces</option>
      </select>
    </label>

    <label>
      Direction
      <select :value="sortDir" @change="$emit('update:sortDir', $event.target.value)">
        <option value="asc">Asc</option>
        <option value="desc">Desc</option>
      </select>
    </label>
  </div>
</template>

<script>
export default {
  name: 'ControlsBar',

  // controlled inputs passed down from parent
  props: {
    search: { type: String, default: '' },
    sortBy: { type: String, default: 'subject' },
    sortDir: { type: String, default: 'asc' }
  },

  emits: ['update:search', 'update:sortBy', 'update:sortDir']
};
</script>

<style scoped>
.controls{display:flex;gap:.75rem;align-items:center;margin:.5rem 0 1rem}
</style>
