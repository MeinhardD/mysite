<template>
  <q-card>
    <q-card-section class="text-h4 text-bold">
      {{ edit ? $t('edit') : $t('create') }} {{ $t('item') }}
    </q-card-section>
    <q-card-section class="q-gutter-md">
      <q-input
        filled
        v-model="label"
        :label="$t('label') + (!edit ? '*' : '')"
        color="accent"
      />
      <q-file
        filled
        v-model="icon"
        :label="$t('icon')"
        color="accent"
      />
      <q-input
        filled
        v-model="link"
        :label="$t('link')"
        color="accent"
      />
      <q-input
        filled
        v-model="category"
        :label="$t('category')"
        color="accent"
      />
    </q-card-section>
    <q-card-actions align="center">
      <q-btn
        flat
        :label="$t('cancel')"
        color="accent"
        v-close-popup
      />
      <q-btn
        unelevated
        :label="edit ? $t('update') : $t('create')"
        color="accent"
        :loading="loading"
        @click="submit"
      />
    </q-card-actions>
  </q-card>
</template>

<script>
export default {
  name: 'WishlistsItemForm',
  props: {
    item: {
      type: Object,
      required: false,
      default: () => null
    },
    edit: {
      type: Boolean,
      required: false,
      default: false
    },
    password: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      uniqueLink: this.$route.params.uniqueLink,
      label: null,
      icon: null,
      link: null,
      category: null,
      loading: false
    }
  },
  mounted () {
    if (this.item) {
      if (this.item.label) this.label = this.item.label
      if (this.item.link) this.link = this.item.link
      if (this.item.category) {
        this.category = this.item.category
        this.oldCategory = this.item.category
      }
    }
  },
  methods: {
    submit () {
      const data = new FormData()
      data.append('password', this.password)
      if (this.edit) data.append('id', this.item.id)
      if (!this.edit)data.append('unique_link', this.uniqueLink)
      if (this.label) data.append('label', this.label)
      if (this.icon) data.append('icon', this.icon)
      if (this.link) data.append('link', this.link)
      if (this.category) data.append('category', this.category)

      this.loading = true
      this.$wishlist
        .post(`/items/${this.edit ? 'update' : 'store'}`, data)
        .then(res => {
          if (res.data.success) {
            console.log(res.data.item)
            if (this.edit) {
              this.$emit('submit', { item: res.data.item, category: this.oldCategory })
            } else {
              this.$emit('submit', { item: res.data.item })
            }
          }
          this.$q.notify({
            type: res.data.success ? 'positive' : 'negative',
            message: res.data.message
          })
          this.loading = false
        })
    }
  }
}
</script>
