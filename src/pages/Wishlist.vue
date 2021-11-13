<template>
  <div class="column content-center q-pa-md">
    <q-card class="container" flat bordered>
      <q-card-section class="row">
        <q-btn
          unelevated
          round
          :size="$q.platform.is.mobile ? 'sm' : 'md'"
          icon="link"
          color="accent"
          @click="copyLink"
          style="margin: auto auto auto 0"
        />

        <div class="text-h3 text-bold text-center">{{ $t('wishlist') }}</div>

        <q-btn
          unelevated
          round
          :size="$q.platform.is.mobile ? 'sm' : 'md'"
          :icon="key ? 'delete' : 'edit'"
          :color="key ? 'negative' : 'accent'"
          @click="key ? deleteWishlist() : unlocking = true"
          :loading="key ? loadingListDelete : false"
          style="margin: auto 0 auto auto"
        />
      </q-card-section>
      <div
        v-if="loadingItems"
        class="row justify-center q-pb-md"
      >
        <q-spinner
          color="accent"
          size="lg"
        />
      </div>
      <div v-else>
        <q-card-section
          v-for="(list, category, categoryIndex) in wishlist"
          :key="'Category' + categoryIndex"
        >
          <div v-if="list.length > 0">
            <div class="text-h5">{{ $t(category) }}</div>
            <q-list>
              <q-item class="text-subtitle1" v-for="(item, itemIndex) in list" :key="'Item' + itemIndex">
                <q-item-section v-if="key" side>
                  <q-btn
                    icon="edit"
                    flat
                    color="primary"
                    @click="itemToEdit = item; editing = true"
                  />
                  <q-btn
                    icon="delete"
                    flat
                    color="negative"
                    :loading="loadingItemDelete"
                    @click="deleteItem(item.id, item.category)"
                  />
                </q-item-section>
                <q-item-section v-if="item.icon_name" avatar>
                  <q-img
                    :src="`http://localhost/images/${item.icon_name}`"
                    :alt="item.icon_name"
                    no-default-spinner
                    width="30px"
                  />
                </q-item-section>
                <q-item-section v-else avatar>
                  <q-icon name="memory" />
                </q-item-section>
                <q-item-section>
                  {{ item.label }}
                </q-item-section>
                <q-item-section v-if="item.link" side>
                  <q-btn
                    icon="open_in_new"
                    flat
                    color="pink"
                    @click="window.open(item.link, '_blank')"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-card-section>
      </div>

      <q-separator v-if="key" inset />

      <q-card-actions v-if="key" align="center">
        <q-btn
          unelevated
          round
          icon="add"
          color="accent"
          @click="creating = true"
        />
      </q-card-actions>
    </q-card>
    <q-dialog v-model="unlocking">
      <keyhole-form
        @unlock="password => { key = password; unlocking = false }"
      />
    </q-dialog>
    <q-dialog v-model="creating">
      <item-form
        :password="key"
        @submit="createItem"
      />
    </q-dialog>
    <q-dialog v-model="editing">
      <item-form
        edit
        :item="itemToEdit"
        :password="key"
        @submit="updateItem"
      />
    </q-dialog>
  </div>
</template>

<script>
import ItemForm from 'src/components/wishlists/ItemForm.vue'
import KeyholeForm from 'src/components/wishlists/KeyholeForm.vue'
import { copyToClipboard } from 'quasar'

export default {
  name: 'Wishlist',
  components: { ItemForm, KeyholeForm },
  data () {
    return {
      window: window,
      wishlist: {},
      uniqueLink: this.$route.params.uniqueLink,
      creating: false,
      editing: false,
      itemToEdit: null,
      unlocking: false,
      key: null,
      loadingItems: false,
      loadingListDelete: false,
      loadingItemDelete: false
      // wishlist: {
      //   games: [
      //     {
      //       label: 'Metroid Dread',
      //       icon: 'switch'
      //     },
      //     {
      //       label: 'Life is Strange True Colors',
      //       icon: 'steam'
      //     }
      //   ],
      //   hardware: [
      //     {
      //       label: 'Raspberry Pi 4 Model B 8GB RAM',
      //       link: 'https://www.proshop.dk/Mini-PC-Android-Raspberry-Pi/Raspberry-Pi-4-Model-B-8GB/2859440'
      //     }
      //   ]
      // }
    }
  },
  mounted () {
    this.getWishlist()
  //   Add this entry here, so the translation works
  //   this.wishlist.hardware.push({
  //     label: `2 TB ${this.$t('external_hdd')}`
  //   })
  },
  methods: {
    getWishlist () {
      this.loadingItems = true
      this.$wishlist
        .get(`/wishlists/${this.uniqueLink}`)
        .then(res => {
          if (res.data.success) {
            const wishlist = {}
            this.wishlist = this.updateWishlist(wishlist, res.data.items)
          } else {
            this.$router.push({ name: 'Wishlists' })
          }
          this.loadingItems = false
        })
    },
    updateWishlist (wishlist, items) {
      for (const item of items) {
        const category = item.category ? item.category : this.$t('uncategorized')
        if (!wishlist[category]) wishlist[category] = []
        wishlist[category].push(item)
      }
      return wishlist
    },
    deleteWishlist () {
      this.loadingListDelete = true
      this.$wishlist
        .delete(`/wishlists/${this.uniqueLink}?password=${this.key}`)
        .then(res => {
          if (res.data.success) {
            this.$router.push({ name: 'Wishlists' })
          }
          this.loadingListDelete = true
        })
    },
    createItem ({ item }) {
      const wishlist = this.wishlist
      this.wishlist = this.updateWishlist(wishlist, [item])
      this.creating = false
    },
    updateItem ({ item, category }) {
      const wishlist = this.wishlist
      const oldCategory = category || this.$t('uncategorized')
      const newCategory = item.category ? item.category : this.$t('uncategorized')
      if (oldCategory === newCategory) {
        const index = wishlist[oldCategory].map(oldItem => oldItem.id).indexOf(item.id)
        wishlist[oldCategory][index] = item
      } else {
        wishlist[oldCategory] = wishlist[oldCategory].filter(oldItem => oldItem.id !== item.id)
        if (wishlist[oldCategory].length === 0) delete wishlist[oldCategory]
        if (!wishlist[newCategory]) wishlist[newCategory] = []
        wishlist[newCategory].push(item)
      }
      this.wishlist = wishlist
      this.editing = false
    },
    deleteItem (id, category) {
      this.loadingItemDelete = true
      this.$wishlist
        .delete(`/items/${id}?password=${this.key}`)
        .then(res => {
          if (res.data.success) {
            const wishlist = this.wishlist
            if (!category) category = this.$t('uncategorized')
            const items = wishlist[category].filter(item => item.id !== id)
            wishlist[category] = items
            this.wishlist = wishlist
            this.loadingItemDelete = false
          }
        })
    },
    copyLink () {
      copyToClipboard(window.location)
      this.$q.notify({
        type: 'info',
        message: 'You copied the link'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .container {
    width: 100%;
    max-width: 40rem;
  }
</style>
