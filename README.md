### Vue3 Quasar Telephone Input

## ![Node version](https://img.shields.io/node/v/@tofandel/q-tel-input.svg?style=flat) ![Types](https://badgen.net/badge/types/included/green) [![](https://data.jsdelivr.com/v1/package/npm/@tofandel/q-tel-input/badge)](https://www.jsdelivr.com/package/npm/@tofandel/q-tel-input) [![](https://badgen.net/badge/github/q-tel-input/blue?icon=github)](https://github.com/tofandel/q-tel-input) [![](https://badgen.net/badge/npm/%40tofandel%2Fq-tel-input/blue?icon=npm)](https://www.npmjs.com/package/@tofandel/q-tel-input)

##### @tofandel/q-tel-input

The plugin was made for Vue 3 using the [Quasar Framework v2.X](https://quasar.dev/). The plugin provides auto country
detection on user inputs as well as dropdown for country which supports search by name, country code and country phone
code.

Live preview for the code is available in [CodePen](https://codepen.io/tofandel-the-typescripter/pen/LYoppqM)

---

#### Installation

##### Package manager

###### npm

```
npm i @tofandel/q-tel-input
```

###### yarn

```
yarn add @tofandel/q-tel-input
```

Import the component as

```
import {QTelInput} from '@tofandel/q-tel-input'
```

Import the styles as

```
import '@tofandel/q-tel-input/dist/@tofandel/style.css'
```

#### Usage

```
<QTelInput v-model="tel" v-model:country-code="countryCode" />
```

All the props that are supported in [quasar input](https://quasar.dev/vue-components/input) field are available in the
plugin as well.
_example_

```
<QTelInput v-model="tel" dense outlined />
```

All the slots that are supported in [quasar input](https://quasar.dev/vue-components/input) field are available in the
plugin as input slots. Country selection element uses `#append` slot

_example_

```
<QTelInput>
    <template v-slot:append>
        <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg">
        </q-avatar>
    </template>
</QTelInput>
```

All the slots that are supported in [quasar select](https://quasar.dev/vue-components/select) field are available in the
plugin as country select control slots with prefix `cs-`.

_example_

```
<QTelInput>
    <template #cs-before-options>
        <q-item>
            <q-item-section>
                This renders as before-options q-select slot in country list
            </q-item-section>
        </q-item>
    </template>
</QTelInput>
```

#### Model

| Prop        | Type             | Description                                      | Usage                          |
|-------------|------------------|--------------------------------------------------|--------------------------------|
| model-value | string or number | The international phone number value             | `v-model="telephone_number"`   |
| country     | string           | The iso2 country code of the selected country    | `v-model:country="country"`    |
| dial-code   | string           | The dial code of the phone number (without plus) | `v-model:dial-code="dialCode"` |
| valid       | boolean          | Whether the phone number is valid or not         | `v-model:valid="valid"`        |

#### Props

| Prop             | Type            | Required | Description                                                                                                         |
|------------------|-----------------|----------|---------------------------------------------------------------------------------------------------------------------|
| invalid-message  | String or false | No       | Show this message when the phone number is not valid (set to false to disable validation)                           |
| search-label     | String          | No       | The label for the search field inside the country dropdown                                                          |
| search-icon      | String          | No       | Set the icon for the search field to something else                                                                 |
| dropdown-options | Object          | No       | The props to pass to the country [select](https://quasar.dev/vue-components/select)                                 |
| use-emoji        | Boolean         | No       | Set to use the emoji icon instead of the default flag images                                                        |
| no-results-text  | String          | No       | Set a string when the search results nothing, default: 'No results found'                                           |
| output-formatted | Boolean         | No       | Set to true if you want the pretty formatting to be emitted in the model-value, by default no space will be present |

#### Events

| Event name   | Type    | Description                                                   |
|--------------|---------|---------------------------------------------------------------|
| country      | Country | Gets back the object information of a country when it changes |
| update:valid | Boolean | Gets back information about the validity of the phone number  |
