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
        <div class="text-h5">{{ $t(category) }}</div>
        <q-list>
          <q-item class="text-subtitle1" v-for="(item, itemIndex) in list" :key="'Item' + itemIndex">
            <q-item-section avatar>
              <q-img
                :src="require(`../assets/${item.icon}.png`)"
                :alt="item.icon"
                no-default-spinner
                width="30px"
              />
            </q-item-section>
            <q-item-section>
              {{ item.label }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
export default {
  name: 'Wishlist',
  data () {
    return {
      wishlist: {
        games: [
          {
            label: 'Metroid Dread',
            icon: 'switch'
          },
          {
            label: 'Life is Strange True Colors',
            icon: 'steam'
          }
        ]
      }
    }
  },
  mounted () {
    const lang = this.$route.query.lang
    if (this.$i18n.availableLocales.includes(lang)) this.$i18n.locale = lang
  }
}
</script>

<style lang="scss" scoped>
  .container {
    width: 100%;
    max-width: 40rem;
  }
</style>
