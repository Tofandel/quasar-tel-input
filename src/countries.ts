import { Country } from './types';
import { countryInformation as all } from './data';
import { CountryCode } from 'libphonenumber-js';

export default all;

export const getEmojiFromCountryCode = (country: CountryCode) => {
  const emojiIndex = ['🇦','🇧','🇨','🇩','🇪','🇫','🇬','🇭','🇮','🇯','🇰','🇱','🇲','🇳','🇴','🇵','🇶','🇷','🇸','🇹','🇺','🇻','🇼','🇽','🇾','🇿'];
  let emoji = '';
  for (let i = 0; i < country.length; i++) {
    emoji += emojiIndex[country.charCodeAt(i) - 65];
  }
  return emoji;
};

export const getCountryByIso = (country: string | undefined): Country | undefined => {
  if (!country) {
    return;
  }
  country = country.trim().toUpperCase();
  return all.find(a => a.iso2 === country);
};

export const getCountryCodeFromPhoneNumber = (number: string | undefined): CountryCode | undefined => {
  if (!number) {
    return;
  }
  number = number.trim();
  if (number.startsWith('+')) {
    number = number.slice(1);
  }
  if (!number) {
    return;
  }
  return all.find(f => number?.startsWith(f.dialCode))?.iso2;
};

export const getCountryByDialCode = (val: string | undefined = '') => {
  if (!val) {
    return;
  }
  return all.find(f => f.dialCode && val.startsWith(`+${f.dialCode}`));
};

export const filterCountries = (term: string): (f: Country) => boolean => {
  term = term.indexOf('+') === 0 ? term.replace('+', '') : term;
  return (f: Country) => {
    return f.dialCode.toLowerCase().indexOf(term) !== -1
      || f.iso2.toLowerCase().indexOf(term) !== -1
      || f.name.toLowerCase().indexOf(term) !== -1
      || f.native.toLowerCase().indexOf(term) !== -1;
  };
};
