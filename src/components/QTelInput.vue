<template>
  <QInput
    v-model="internalNumber"
    :rules="[() => invalidMessage === false || isValidPhone ? true : props.invalidMessage, ...rules]"
    class="q-tel-input"
    type="tel"
    :dense="dense"
    :readonly="readonly"
    :disable="disable"
    @focus="updateCaret"
    @keyup="updateCaret"
    @blur="onBlur"
  >
    <template #prepend>
      <CountrySelection
        v-model:country="internalCountry"
        :use-emoji="useEmoji"
        :search-label="searchLabel"
        :allowed-countries="allowedCountries"
        :search-icon="searchIcon"
        :no-results-text="noResultsText"
        :dense="dense"
        :readonly="readonly"
        :disable="disable"
        v-bind="dropdownOptions"
      >
        <template
          v-for="slot of countrySelectSlots"
          #[slot]="scope"
        >
          <slot
            :name="slot"
            v-bind="scope ?? {}"
          />
        </template>
      </CountrySelection>
    </template>
    <template
      v-for="slot of inputSlots"
      #[slot]="scope"
    >
      <slot
        :name="slot"
        v-bind="scope ?? {}"
      />
    </template>
  </QInput>
</template>

<script setup lang="ts">
import CountrySelection from './CountrySelection.vue';
import { Country, CountrySelectionProps } from '@/types';
import { CountryCode, parsePhoneNumber, PhoneNumber } from 'libphonenumber-js';
import { getCountryByDialCode, getCountryByIso, getCountryCodeFromPhoneNumber } from '@/countries';
import { QInput, QSelectProps, ValidationRule } from 'quasar';
import { ref, computed, nextTick, watch, useSlots } from 'vue';

const props = withDefaults(defineProps<Omit<CountrySelectionProps, 'country'> & {
  modelValue: string | number,
  dropdownOptions?: QSelectProps,
  country?: Lowercase<CountryCode> | CountryCode,
  dialCode?: string,
  useEmoji?: boolean,
  invalidMessage?: string | false,
  rules?: ValidationRule[],
  dense?: boolean,
  readonly?: boolean,
  disable?: boolean
  outputFormatted?: boolean
}>(), {
  rules: () => [],
  invalidMessage: 'The phone number is not valid',
});

const emit = defineEmits(['update:model-value', 'update:country', 'update:dial-code', 'update:valid', 'country']);
const slots = useSlots();

let preventEffect = false;

const internalCountry = ref<Country>(getCountryByIso(props.country) ?? getCountryByDialCode(props.dialCode) ?? getCountryByIso(getCountryCodeFromPhoneNumber(props.modelValue + '') ?? 'us')!);
const internalNumber = ref<string>('');


const maybeSetCountry = (country: Country | undefined) => {
  if (country && country.dialCode !== internalCountry.value.dialCode) {
    internalCountry.value = country;
  }
};

const sanitizedModel = computed(() => {
  let model = props.modelValue + '';
  const startsWithPlus = model.startsWith('+');
  model = model.replace(/\D/g, '');
  return startsWithPlus ? '+' + model : model;
});

const onBlur = () => {
  caretPos.value = null;

  if (internalNumber.value.startsWith('+')) {
    maybeSetCountry(getCountryByDialCode(internalNumber.value));
  }

  if (phoneNumber.value) {
    // Remove country code on blur
    internalNumber.value = getNumber(phoneNumber.value);
  }
};

watch(internalNumber, () => {
  let value = internalNumber.value;
  value = value.replace(/\s+/g, ' ');
  let out = value.startsWith('+') ? '+' : '';
  out += value.replace(/[^\d ]/g, '');
  if (out !== internalNumber.value) {
    internalNumber.value = out;
  }
});
const inputSlots = computed<string[]>(() => Object.keys(slots).filter(slotName => !slotName.startsWith('cs-')));
const countrySelectSlots = computed<string[]>(() =>
  Object.keys(slots)
    .filter(slotName => slotName.startsWith('cs-'))
    .map(slotName => slotName.substring(3)),
);

const phoneNumber = computed<PhoneNumber|null>(() => {
  try {
    const phoneNumber = (internalNumber.value || props.modelValue + '').trim();
    return parsePhoneNumber(phoneNumber, internalCountry.value.iso2);
  } catch {
    return null;
  }
});

const withoutRecursiveEffects = (cb: () => void) => {
  return () => {
    preventEffect = true;
    cb();
    nextTick(() => preventEffect = false);
  };
};

const getNumber = (instance: PhoneNumber, international = false): string => {
  if (!instance) {
    return '';
  }
  return international ? instance.formatInternational() : instance.formatInternational().replace('+'+instance.countryCallingCode, '').trim();
};

const isValidPhone = computed(() => phoneNumber.value && phoneNumber.value!.isValid() && (!props.allowedCountries || props.allowedCountries.includes(phoneNumber.value!.country!)));

let checkNextCaret = false;
const caretPos = ref<number | null>(null);

const updateCaret = (event: Event) => {
  if (event.target instanceof HTMLInputElement && event.target.type === 'tel' && event.target.classList.contains('q-field__native')) {
    caretPos.value = event.target.selectionStart;
  }
};

watch(caretPos, () => {
  if (checkNextCaret && caretPos.value! >= 3) {
    maybeSetCountry(getCountryByDialCode(sanitizedModel.value));
  }
});
watch(internalCountry, withoutRecursiveEffects(() => {
  emit('update:country', internalCountry.value.iso2.toLowerCase());
  emit('update:dial-code', internalCountry.value.dialCode);
  emit('country', internalCountry.value);
}));

watch([internalNumber, phoneNumber], withoutRecursiveEffects(() => {
  if (phoneNumber.value) {
    let val = getNumber(phoneNumber.value, true);
    val = props.outputFormatted ? val : val.replace(/\s/g, '');
    if (val !== props.modelValue) {
      emit('update:model-value', val);
    }
  } else if (internalNumber.value && props.modelValue !== internalNumber.value) {
    emit('update:model-value', internalNumber.value);
  }
}));

watch(() => [phoneNumber.value, props.modelValue], (newVal, oldVal) => {
  if (oldVal === undefined) {
    maybeSetCountry(getCountryByIso(phoneNumber.value?.country ?? props.country) ?? getCountryByDialCode(props.dialCode));
  }

  checkNextCaret = sanitizedModel.value.startsWith('+');
  if (preventEffect) return;
  internalNumber.value = phoneNumber.value ? getNumber(phoneNumber.value) : sanitizedModel.value;
}, {immediate: true});

watch(() => props.country, () => {
  if (preventEffect) return;
  maybeSetCountry(getCountryByIso(props.country));
}, {immediate: !internalCountry.value});
watch(() => props.dialCode, () => {
  if (preventEffect) return;
  maybeSetCountry(getCountryByDialCode(props.dialCode));
}, {immediate: !internalCountry.value});

watch(isValidPhone, () => {
  if (isValidPhone.value && phoneNumber.value && caretPos.value! >= internalNumber.value.length - 1) {
    internalNumber.value = getNumber(phoneNumber.value);
  }
  emit('update:valid', isValidPhone.value);
}, {immediate: true});
</script>
