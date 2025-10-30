export async function loadData(){
  return fetch('data/lista.json')
  .then(res => res.json())
}