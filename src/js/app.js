(function eefi(Vue) {
  'use strict';

  /**
   * Build the request to fetch the initial list of heroes from the API
   */
  // const apiKey = 'e499845d';
  // const url = `https://hero-merge.herokuapp.com/${apiKey}/heroes`;
  const url = 'src/js/model.json';
  const options = {
    method: 'get',
    mode: 'cors',
    redirect: 'follow',
    headers: new Headers({
      'Content-Type': 'text/plain',
    }),
  };

  const request = new Request(url, options);

  const model = {
    el: '#app',
    data: {},
    methods: {
      editHero($index) {
        const editor = document.querySelector('.editor-overlay');
        this.heroToEdit = $index > -1 ? $index : -1;
        editor.classList.toggle('_active');
      },
    },
  };

  /**
   * Insert the hero list obtained from the API into the model's heroes array
   * @param {Object} heroList
   * @return {Object}
   */
  const setHeroes = list =>
    Object.assign({}, model,
      {
        data: {
          heroToEdit: -1,
          heroes: list,
        },
      });

  /**
   * Retrieves the list of heroes from the API and creates the initial view
   * @param {Object} req
   */
  const getHeroes = req =>
    fetch(req)
      .then(res => res.json())
      .then(json => setHeroes(json))
      .then(appModel => new Vue(appModel))
      .catch(err => console.log(`Fetch error: ${err}`));

  getHeroes(request);
}(Vue));
