import { CountryCode } from 'libphonenumber-js';

export interface Country {
  name: string;
  iso2: CountryCode;
  dialCode: string;
  native: string;
  continent_name: string;
}

export interface CountrySelectionProps {
  country: Country,
  allowedCountries?: CountryCode[]
  searchLabel?: string,
  searchIcon?: string,
  noResultsText?: string,
  useEmoji?: boolean,
}
