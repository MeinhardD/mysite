<template>
  <q-page padding class="flex justify-center">
    <div class="container">
      <l-map
        class="leaflet-map"
        :zoom="map.zoom"
        :center="[map.location.lat, map.location.lon]"
        :options="map.leafletMapOptions"
      >
        <l-tile-layer :url="map.url" />
        <div v-for="(bus, index) in buses" :key="index" >
          <l-marker
            :lat-lng="[bus.lat, bus.lon]"
          >
            <l-icon>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="jsx-3143448306 rotate">
                  <g
                      id="Group_1"
                      data-name="Group 1"
                      transform="translate(-944 -527.234)"
                      class="jsx-3143448306"
                  >
                      <circle
                          id="Ellipse_1"
                          data-name="Ellipse 1"
                          cx="12" cy="12" r="12"
                          transform="translate(944 527.234)"
                          :fill="bus.color"
                          class="jsx-3143448306"
                      >
                      </circle>
                  </g>
              </svg>
            </l-icon>

            <l-tooltip>
              {{ bus.route }}
            </l-tooltip>
          </l-marker>
        </div>
      </l-map>
    </div>
  </q-page>
</template>
<script>
import { LMap, LTileLayer, LMarker, LTooltip, LIcon } from 'vue2-leaflet'
import 'leaflet/dist/leaflet.css'

export default {
  name: 'PageMap',
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LTooltip,
    LIcon
  },
  data () {
    return {
      map: {
        url: 'https://{s}.tile.osm.org/{z}/{x}/{y}.png',
        zoom: 15,
        leafletMapOptions: {
          doubleClickZoom: 'center',
          scrollWheelZoom: 'center',
          dragging: true,
          attributionControl: false
        },
        location: {
          lat: 62.007989,
          lon: -6.7670677
        }
      },
      sslId: '4',
      havnarId: '1',
      buses: [],
      interval: null
    }
  },
  created () {
    this.getBuses()
  },
  destroyed () {
    clearInterval(this.interval)
  },
  computed: {
    id () {
      return this.$store.getters['map/id']
    }
  },
  methods: {
    getBuses () {
      const query = {
        operationName: 'Area',
        variables: {
          id: this.id
        },
        query: 'query Area($id: ID!) {\n area(id: $id) {\n routes(sort: "order:asc") {\n name\n color\n order\n buses {\n name\n latitude\n longitude\n positionAttributes\n course\n address\n visible\n __typename\n }\n stations {\n id\n name\n lat\n lng\n __typename\n }\n __typename\n }\n __typename\n }\n}\n'
      }
      const postRequest = () => {
        this.$axios
          .post('https://buscms.sona.fo/graphql', query)
          .then(res => {
            const routes = res.data.data.area.routes
            const buses = []
            for (const route of routes) {
              const splitRoutName = route.name.split(' ')
              const routeName = `${splitRoutName[0]} ${splitRoutName[1].split(':')[0]}`
              for (const bus of route.buses) {
                if (bus.latitude && bus.longitude) {
                  buses.push({
                    route: routeName,
                    color: route.color,
                    lat: bus.latitude,
                    lon: bus.longitude
                  })
                }
              }
            }
            this.buses = buses
          })
      }

      postRequest()
      this.interval = setInterval(() => { postRequest() }, 5000)
    }
  }
}
</script>

<style lang="scss" scoped>
  .leaflet-map {
    height: 800px;
    width: 100%
  }
</style>
