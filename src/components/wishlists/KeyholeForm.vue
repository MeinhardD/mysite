<template>
  <q-card>
    <q-card-section>
      <q-input
        filled
        v-model="password"
        type="password"
        :label="$t('password')"
        color="accent"
        @keyup.enter="unlockWishlist"
      />
    </q-card-section>
    <q-card-actions align="center">
      <q-btn
        unelevated
        :label="$t('unlock')"
        color="accent"
        @click="unlockWishlist"
      />
    </q-card-actions>
  </q-card>
</template>

<script>
export default {
  name: 'WishlistsKeyholeForm',
  data () {
    return {
      uniqueLink: this.$route.params.uniqueLink,
      password: null
    }
  },
  methods: {
    unlockWishlist () {
      this.$wishlist
        .post('/unlock', { unique_link: this.uniqueLink, password: this.password })
        .then(res => {
          if (res.data.success) {
            this.$emit('unlock', this.password)
          }
          this.$q.notify({
            type: res.data.success ? 'positive' : 'negative',
            message: res.data.message
          })
        })
    }
  }
}
</script>
