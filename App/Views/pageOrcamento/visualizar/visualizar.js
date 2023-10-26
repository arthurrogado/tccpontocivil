import HttpClient from "/App/App.js";

const httpClient = new HttpClient();

// httpClient.makeRequest('/api/orcamento/visualizar', {id: httpClient.getParams().id })
// .then(response => {
//     if(response.orcamento) {
        
//     }
// })

const sections = document.querySelectorAll('[section]');
sections.forEach(section => {
  // ao clicar em uma seção, esconde ou mostra os itens da seção
  section.addEventListener('click', () => {
    const sectionNumber = section.getAttribute('section');
    const items = document.querySelectorAll(`tr[from-section="${sectionNumber}"]`);
    items.forEach(item => {
      item.classList.toggle('hidden');

    })
  })
})