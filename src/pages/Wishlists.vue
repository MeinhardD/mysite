<template>
  <div class="column content-center q-pa-md">
    <q-card class="container" flat bordered>
      <q-card-section>
        <div class="text-h3 text-bold text-center">
          {{ $t('create_a_wishlist') }}
        </div>
      </q-card-section>
      <q-card-section>
        <q-input
          filled
          v-model="password"
          type="password"
          :label="$t('password')"
          color="accent"
          @keyup.enter="createWishlist"
        />
      </q-card-section>
      <q-card-actions align="center">
        <q-btn
          unelevated
          :label="$t('create')"
          color="accent"
          :loading="loading"
          @click="createWishlist"
        />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
export default {
  name: 'PageWishlists',
  data () {
    return {
      password: null,
      uniqueLink: null,
      loading: false
    }
  },
  methods: {
    createWishlist () {
      if (this.password) {
        this.loading = true
        this.$wishlist
          .post('/wishlists', { password: this.password })
          .then(res => {
            if (res.data.success) {
              this.uniqueLink = res.data.unique_link
              this.password = null
              this.$router.push({ path: `/wishlists/${this.uniqueLink}` })
            }
            this.$q.notify({
              type: res.data.success ? 'positive' : 'negative',
              message: res.data.message
            })
            this.loading = false
          })
          .catch(err => console.error('Error', err))
      } else {
        this.$q.notify({
          type: 'negative',
          message: 'A password is required'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .unique-link {
    max-width: 500px;
  }
</style>
