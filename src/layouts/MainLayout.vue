<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer class="row">
      <div class="row justify-start button-wrapper">
        <q-toggle
          v-model="isDark"
          :icon="isDark? 'dark_mode' : 'light_mode'"
          icon-color="secondary"
          color="dark"
          size="xl"
          @input="toggleDarkMode()"
        />
      </div>
      <q-tabs class="tabs">
        <q-route-tab
          icon="home"
          to="/"
          exact
        />
        <q-route-tab
          icon="map"
          to="/map"
          exact
        />
      </q-tabs>
      <div class="row justify-end invisible-wrapper">
        <q-btn-toggle
          v-if="isMap"
          v-model="id"
          no-caps
          rounded
          unelevated
          toggle-color="secondary"
          color="white"
          text-color="secondary"
          size="sm"
          :options="[
            {label: 'SSL', value: '5e46a32e3fb8db316cd76d54'},
            {label: 'Havn', value: '5e4547b45ba3615020fe6fa9'}
          ]"
          @input="toggleId"
        />
      </div>
    </q-footer>
  </q-layout>
</template>

<script>

export default {
  name: 'MainLayout',
  data () {
    return {
      isDark: null,
      id: '5e46a32e3fb8db316cd76d54'
    }
  },
  created () {
    this.isDark = this.$q.dark.isActive
  },
  computed: {
    isMap () {
      return this.$route.name === 'map'
    }
  },
  methods: {
    toggleDarkMode () {
      this.$q.dark.toggle()
    },
    toggleId () {
      this.$store.dispatch('map/setId', this.id)
    }
  }
}
</script>

<style lang="scss">
  .container {
    height:100%;
    width: 100%;
    max-width: 1000px;
  }
  $wrapper-width: 100px;
  .button-wrapper {
    margin-top: 0;
    margin-bottom: 0;
    margin-left: 0;
    width: $wrapper-width;
  }
  .tabs {
    margin-right: auto;
    margin-left: auto;
  }
  .invisible-wrapper {
    margin-top: 0;
    margin-bottom: 0;
    margin-right: 0;
    padding: 5px 5px 5px 5px;
    width: $wrapper-width;
  }
  .text-link {
    text-decoration: none;

    &:link {
      color: $primary;
    }
    &:visited {
      color: $accent;
    }
    &:hover {
      color: $secondary;
    }
    &:active {
      color: $accent;
    }
  }
</style>
