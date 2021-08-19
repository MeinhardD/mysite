<template>
  <q-page class="column content-center" padding>
    <div class="column justify-center content-center container">
      <pre>
                _     _
 _ __ ___   ___(_) __| | __ _ _ __ ___
| '_ ` _ \ / _ \ |/ _` |/ _` | '_ ` _ \
| | | | | |  __/ | (_| | (_| | | | | | |
|_| |_| |_|\___|_|\__,_|\__,_|_| |_| |_|
      </pre>
      <h5 class="q-my-xs">
        Hetta er mín persónliga heimasíða. <br>
        Eg brúki hana millum annað til persónlig hobby projektir.
      </h5>
      <h6 class="q-my-xs">Her eru nøkur leinkir til ymiskt, sum mær dámar:</h6>
      <ul class="q-mt-none">
        <li>
          <a href="https://wiki.archlinux.org" class="text-link">The ArchWiki</a>
        </li>
        <li>
          <a href="https://manjaro.org" class="text-link">Manjaro</a>
        </li>
        <li>
          <a href="https://quasar.dev" class="text-link">Quasar Framework</a>
        </li>
        <li>
          <a href="https://vuejs.org" class="text-link">Vue.js</a>
        </li>
        <li>
          <a href="https://laravel.com" class="text-link">Laravel</a>
        </li>
        <li>
          <a href="https://lichess.org" class="text-link">Lichess.org</a>
        </li>
      </ul>
      <h6 class="q-mb-xs">
        Eg havi eisini ein gemini capsule á sama økisnavni.
      </h6>
      <p class="q-mb-xs">
        Meira kann síggjast um gemini á hesum leinkinum:
      </p>
      <ul class="q-mt-none">
        <li>
          <a href="https://gemini.circumlunar.space/" class="text-link">Gemini Project</a>
        </li>
      </ul>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'PageIndex'
}
</script>

<style lang="scss" scoped>
  .home-text {
    font-size: 24px;
  }
</style>
