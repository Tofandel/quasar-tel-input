<template>
  <QSelect
    :model-value="country"
    :options="countryOptions"
    :option-disable="(option) => option.iso2 === ''"
    hide-bottom-space
    hide-dropdown-icon
    borderless
    virtual-scroll-slice-size="9999"
    class="no-inherit-feedback no-feedback v3-q-tel-input--country"
    :menu-offset="[12, 0]"
    @popup-hide="searchText = ''"
    @update:model-value="emit('update:country', $event)"
  >
    <template #option="scope">
      <QItem
        class="flex items-center q-pa-xs mdi-border-bottom no-wrap"
        v-bind="scope.itemProps"
        dense
      >
        <span
          v-if="!!scope.opt.iso2"
          :class="!useEmoji ? ['v3q_tel__flag', 'flag', 'flag-'+scope.opt.iso2.toLowerCase()] : 'q-mr-sm'"
        >{{ useEmoji ? getEmojiFromCountryCode(scope.opt.iso2) : '' }}</span>
        <span
          v-if="!!scope.opt.dialCode"
          class="q-ml-sm text-no-wrap"
        >(+{{ scope.opt.dialCode }})</span>
        <span :class="['q-ml-sm text-no-wrap ellipsis', { 'disabled full-width text-center': scope.opt.disabled }]">{{ scope.opt.native }}</span>
      </QItem>
      <QSeparator />
    </template>
    <template #selected-item="scope">
      <div
        v-if="scope.opt"
        class="q-pa-none ellipsis"
        style="min-height: unset"
      >
        <div class="flex items-center no-wrap">
          <span :class="!useEmoji ? ['v3q_tel__flag q-mr-sm', 'flag', 'flag-'+scope.opt.iso2.toLowerCase()] : 'q-mr-sm'">{{ useEmoji ? getEmojiFromCountryCode(scope.opt.iso2) : '' }}</span>
          <span class="ellipsis text-no-wrap">+{{ scope.opt.dialCode }}</span>
        </div>
      </div>
    </template>
    <template #after-options>
      <div class="v3-q-tel--country-selector last-search-item q-pa-sm">
        <QInput
          ref="input"
          v-model="searchText"
          dense
          outlined
          :label="searchLabel"
          class="bg-white"
        >
          <template
            v-if="searchIcon"
            #prepend
          >
            <QIcon :name="searchIcon" />
          </template>
        </QInput>
      </div>
    </template>
    <template
      v-for="(_, slot) of $slots"
      #[slot]="scope"
    >
      <slot
        :name="slot"
        v-bind="scope ?? {}"
      />
    </template>
  </QSelect>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import countries, { filterCountries, getEmojiFromCountryCode } from '@/countries.ts';
import { CountrySelectionProps } from '@/types.ts';
import { QSelect, QIcon, QSeparator, QInput, QItem } from 'quasar';

const props = withDefaults(defineProps<CountrySelectionProps>(), {
  searchLabel: 'Search',
  searchIcon: 'search',
  noResultsText: 'No results found',
});

const searchText = ref('');
watchEffect(() => {
  searchText.value = '';
});

const allowedCountries = computed(() => props.allowedCountries ? countries.filter((country) => props.allowedCountries!.includes(country.iso2)) : countries);

const countryOptions = computed(() => {
  const needle = searchText.value.toLowerCase().trim();
  if (needle === '') {
    return allowedCountries.value;
  }
  const result = allowedCountries.value.filter(filterCountries(needle));
  if (result.length === 0) {
    return [{
      name: props.noResultsText,
      dialCode: '',
      iso2: '',
    }];
  }
  return result;
});
const emit = defineEmits(['update:country']);
</script>

<style lang="scss">
.v3-q-tel-input--country {
  @import '../styles/flags';
  .q-field__control {
    background: none;
    &::before {
      display: none;
    }
  }
  .q-field__input {
    border: none;
  }

  .v3-q-tel--country-selector {
    position: sticky;
    bottom: 0;
    left: 0;
    right: 0;
  }
}
</style>
