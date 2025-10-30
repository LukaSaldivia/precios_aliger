import { Grupo } from "./Grupo.js"
import { getFullData } from "./loadConfig.js"


const $ = (selector = '') => document.querySelector(selector)
const _$ = (element = HTMLElement, selector = '') => element.querySelector(selector)
const $$ = (selector = '') => document.querySelectorAll(selector)
const _$$ = (element = HTMLElement, selector = '') => element.querySelectorAll(selector)

const GRUPOS = new Set()
const input = $('[role="search"]')
const TITLE = document.title

// Cargar datos

getFullData().then(data => {

  // Procesar los grupos
  for (const grupo in data.grupos) {

    if (grupo == "Sin Grupo")
      continue

    if (grupo == "FECHA") {
      $('#actualizacion').textContent = `Última actualización: ${data.grupos[grupo]}`
      continue
    }
    // Instanciar los articulos como tipo Articulo
    GRUPOS.add(new Grupo(grupo, data.grupos[grupo], data.grupos_details.get(grupo)))
  }

  // Renderizar los grupos y articulos
  $('#data').innerHTML = [...GRUPOS].map(grupo => grupo.toHTML()).join('')


  // Buscador

  // Buscar por productos o empresas


  input.addEventListener('input', ({ target }) => {
    let text = target.value.trim().toLowerCase()
    search(text)
  })

  // Buscar por productos o empresas según URL Param "q"

  const urlParams = new URLSearchParams(window.location.search);
  let searchQuery = urlParams.get('q').trim().toLowerCase();
  searchQuery = searchQuery.replaceAll("+", " ")
  input.value = searchQuery
  search(searchQuery)

  // Funcion de busqueda

  function search(text) {
    $('#data').classList.toggle('searching', !!text)

    if (text) {

      document.title = `Resultados para: ${text} | Aliger`

      const grupos = $$('.grupo')

      for (const grupo of grupos) {

        const articulos = _$$(grupo, 'article')

        for (const articulo of articulos) {
          articulo.classList.remove('found')
        }

        const group_name = _$(grupo, '.grupo-nombre').textContent.toLowerCase()


        for (const articulo of articulos) {

          let articulo_name = _$(articulo, '.articulo-nombre').textContent.toLowerCase()

          articulo.classList.toggle('found', articulo_name.includes(text))

          if (group_name.includes(text)) {
            articulo.classList.add('found')

          }
        }
      }
    } else {
      document.title = TITLE
    }
  }



})

export { $, $$, _$$ }