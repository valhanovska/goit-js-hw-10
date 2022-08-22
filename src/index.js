import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const body = document.querySelector('body');
body.style.background =
  'radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)';

const refs = {
  countryInput: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};
const renderOneCountry = data => {
  const {
    name: { official },
    languages,
    capital,
    population,
    flags,
  } = data[0];
  return `
  <div style = "display:flex; align-item:center; gap: 10px"><img src='${
    flags.svg
  }' alt='${official}' width = '100' heigth = '50' />
  <h1>${official}</h1></div>  
<p><b>Languages: </b>${Object.values(languages).join(',')}</p> 
  <p><b>Capital: </b>${capital}</p>
  <p><b>Population: </b>${population}</p>
`;
};

const renderCountryList = data => {
  return data
    .map(({ name: { official }, flags }) => {
      return `<li style = "list-style: none">
      <div style = "display:flex; align-item:center; gap: 10px"><img src='${flags.svg}' alt='${official}' width = '100' heigth = '50' />
  <h2>${official}</h2></div>
      
</li>`;
    })
    .join('');
};

const returnCountries = data => {
  data.length === 1
    ? ((refs.countryInfo.innerHTML = renderOneCountry(data)),
      (refs.countryList.innerHTML = ''))
    : ((refs.countryInfo.innerHTML = ''),
      (refs.countryList.innerHTML = renderCountryList(data)));
};

refs.countryInput.addEventListener(
  'input',
  debounce(inputCountry, DEBOUNCE_DELAY)
);

function inputCountry(event) {
  if (event.target.value.trim() !== '')
    fetchCountries(event.target.value)
      .then(data => {
        if (data.length > 10) {
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else if (data.status === 404) {
          Notiflix.Notify.failure('Oops, there is no country with that name');
        } else returnCountries(data);
      })
      .catch(error => console.log(error));
}
