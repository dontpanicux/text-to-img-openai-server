import './photogenerator.css';

const form = document.querySelector('form');

form.addEventListener('submit', async function(event){
  // prevent page reload behavior on submit
  event.preventDefault();
  console.log('form has been submitted');

  // get the data from the form passing a new FormData Object our form
  const data = new FormData(form);

  //make a request to our API using fetch
  const response = await fetch('http://localhost:8080/dream', {
    method: 'POST',
    headers: {
      'Content-Type':'application/json',
    },
    body: JSON.stringify({
      prompt: data.get('prompt'),
    }),
  });

  const { image } = await response.json();

  const result = document.querySelector('#result');
  result.innerHTML = `<img src="${image}" width="512"/>`
});