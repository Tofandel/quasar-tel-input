<template>
  <div id="app">
    <div class="row">
      <div class="col-6 offset-1 q-mt-lg">
        <Vue3QTelInput
          v-model="input"
          v-model:country="country"
          v-model:dial-code="countryCode"
          v-model:valid="valid"
          use-emoji
          :allowed-countries="['FR', 'ES', 'HU']"
          search-text="Search using code/country"
          dense
          no-results-text="Sample here"
        />
      </div>
    </div>
    <div>entered telephone number : {{ input }}</div>
    <div>
      Country : {{ countryCode }} {{ country }} {{ valid }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Vue3QTelInput from '../src/components/QTelInput.vue';

export default defineComponent({
  name: 'ServeDev',
  components: {
    Vue3QTelInput,
  },
  data() {
    return {
      valid: true,
      input: '1244',
      country: 'de',
      countryCode: null
    };
  },
});
</script>
