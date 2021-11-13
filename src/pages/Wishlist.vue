<template>
  <div class="column content-center q-pa-md">
    <q-card class="container" flat bordered>
      <q-card-section>
        <div class="text-h2 text-bold text-center">{{ $t('wishlist') }}</div>
      </q-card-section>
      <q-card-section
        v-for="(list, category, categoryIndex) in wishlist"
        :key="'Category' + categoryIndex"
      >
        <div v-if="list.length > 0">
          <div class="text-h5">{{ $t(category) }}</div>
          <q-list>
            <q-item class="text-subtitle1" v-for="(item, itemIndex) in list" :key="'Item' + itemIndex">
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
              <q-item-section side>
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
                  @click="deleteItem(item.id, item.category)"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-card-section>

      <q-separator inset />

      <q-card-actions align="center">
        <q-btn
          unelevated
          round
          icon="add"
          color="accent"
          @click="creating = true"
        />
      </q-card-actions>
    </q-card>
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

export default {
  name: 'Wishlist',
  components: { ItemForm },
  data () {
    return {
      window: window,
      wishlist: {},
      uniqueLink: this.$route.params.uniqueLink,
      creating: false,
      editing: false,
      itemToEdit: null,
      key: 'password'
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
      this.$axios
        .get(`http://localhost/api/wishlists/${this.uniqueLink}`)
        .then(res => {
          if (res.data.success) {
            const wishlist = {}
            this.wishlist = this.updateWishlist(wishlist, res.data.items)
          }
        })
    },
    updateWishlist (wishlist, items) {
      for (const item of items) {
        const category = item.category ? item.category : 'uncategorized'
        if (!wishlist[category]) wishlist[category] = []
        wishlist[category].push(item)
      }
      return wishlist
    },
    createItem (item) {
      const wishlist = this.wishlist
      this.wishlist = this.updateWishlist(wishlist, [item])
      this.creating = false
    },
    updateItem (item) {
      const wishlist = this.wishlist
      const category = item.category ? item.category : 'uncategorized'
      const index = wishlist[category].map(oldItem => oldItem.id).indexOf(item.id)
      wishlist[category][index] = item
      this.wishlist = wishlist
      this.editing = false
    },
    deleteItem (id, category) {
      this.$axios
        .delete(`http://localhost/api/items/${id}?password=${this.key}`)
        .then(res => {
          if (res.data.success) {
            const wishlist = this.wishlist
            if (!category) category = 'uncategorized'
            const items = wishlist[category].filter(item => item.id !== id)
            wishlist[category] = items
            this.wishlist = wishlist
          }
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
