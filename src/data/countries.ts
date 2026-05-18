import countries from "world-countries";

export type CountryOption = {
  code: string;
  country: string;
  flag: string;
  name: string;
};

function getDialCode(root: string, suffixes: string[]) {
  if (!root) {
    return null;
  }

  if (suffixes.length === 1) {
    return `${root}${suffixes[0]}`;
  }

  return root;
}

export const countryOptions: CountryOption[] = countries
  .map((country) => {
    const code = getDialCode(country.idd.root, country.idd.suffixes ?? []);

    if (!code) {
      return null;
    }

    return {
      code,
      country: country.cca2,
      flag: country.flag,
      name: country.name.common
    };
  })
  .filter((country): country is CountryOption => Boolean(country))
  .sort((firstCountry, secondCountry) =>
    firstCountry.name.localeCompare(secondCountry.name)
  );

export const defaultCountry =
  countryOptions.find((country) => country.country === "IN") ?? countryOptions[0];
