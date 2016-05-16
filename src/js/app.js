(function eefi(Vue) {
  'use strict';

  /**
   * Build the request to fetch the initial list of heroes from the API
   */
  const baseUrl = 'https://hero-merge.herokuapp.com/';
  const apiKey = '663f2799';
  const requestUrl = `${baseUrl}${apiKey}/heroes`;
  // const requestUrl = 'src/js/model.json';
  const options = {
    method: 'get',
    mode: 'cors',
    redirect: 'follow',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  };

  const request = new Request(requestUrl, options);

  /**
   * Range and integer validation for the hero attributes values
   * @param {String} value
   * @return {Boolean}
   */
  const isValidValue = value => {
    const val = parseInt(value, 10);
    return val >= 0 && val <= 100;
  };

  const isValidHero = hero =>
    hero.hero_name &&
    hero.real_name &&
    hero.gender;

  /**
   * Vue main object
   */
  const vm = new Vue({
    el: '#app',

    // Vue object data property
    data: {
      newAttribute: '',
      newAttributeValue: '',
      newPower: '',
      newWeakness: '',
      newHero: {
        hero_name: '',
        real_name: '',
        gender: '',
        attributes: {},
        powers: [],
        weaknesses: [],
      },
      heroes: [],
    },

    // Vue object methods property
    methods: {
      /**
       * Add new attributes for the new hero not before checking that these are
       * valid ones
       */
      addAttribute() {
        const name = this.newAttribute.trim();
        const value = this.newAttributeValue.trim();
        if (name && isValidValue(value)) {
          this.newHero.attributes = Object.assign(
            {},
            this.newHero.attributes,
            { [name]: parseInt(value, 10) }
          );

          this.newAttribute = '';
          this.newAttributeValue = '';
        }
      },

      /**
       * Add new powers and weaknesses for the new heroes
       * @param {String} newCharacteristic Name for the power or weakness to be
       * added
       * @param {String} characteristic Name of the hero characteristic to
       * modify
       */
      addCharacteristic(newCharacteristic, characteristic) {
        const name = this[newCharacteristic].trim();
        if (name) {
          this.newHero[characteristic].push(name);
          this[newCharacteristic] = '';
        }
      },

      /**
       * Insert the new hero into de database and updates the model state to
       * show the new guy in town
       */
      createNewHero() {
        if (isValidHero(this.newHero)) {
          addHero(this.newHero);
        }

        this.toggleEditor();
      },

      /**
       * Mechanism to open and close the hero editor
       */
      toggleEditor() {
        const editor = document.querySelector('.editor-overlay');
        editor.classList.toggle('_active');
      },
    },
  });

  /**
   * Retrieves the list of heroes from the API and creates the initial view
   * @param {Object} req
   */
  function getHeroes(req) {
    fetch(req)
      .then(res => res.json())
      .then(list => (vm.heroes = list))
      .catch(err => console.log(`Fetch error: ${err}`));
  }

  /**
   * Send the information about the new hero and handle the response to update
   * the application state
   * @param {Object} data The new hero
   */
  function addHero(data) {
    fetch(requestUrl, {
      method: 'post',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(data),
    })
    .then(res => {
      res.json()
      .then(hero => vm.heroes.push(hero));
    })
    .catch(err => console.log(`Post error: ${err}`));
  }

  getHeroes(request);
}(Vue));
