const URL = 'https://restcountries.com';

export function fetchCountries(name) {
  return fetch(
    `${URL}/v3.1/name/${name}?fields=name,capital,languages,population,flags`
  ).then(response => {
    return response.json();
  });
}
