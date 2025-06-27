const $ = (selector = '') => document.querySelector(selector)
const _$ = (element = HTMLElement, selector = '') => element.querySelector(selector)
const $$ = (selector = '') => document.querySelectorAll(selector)
const _$$ = (element = HTMLElement, selector = '') => element.querySelectorAll(selector)
const { format } = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'ARS', currencyDisplay: 'narrowSymbol', maximumFractionDigits: 0 })
const input = $('[role="group"] input')



// Carga de datos

const container = $('#data')

fetch('output.json').then(response => response.json()).then(data => {

  $('span.date').textContent = data.fecha

  const empresas = Object.keys(data.grupos)

  empresas.sort((a, b) => a == "Aliger" ? -1 : b == "Aliger" ? 1 : 0)

  for (const empresa of empresas) {

    const div = document.createElement('div')
    div.classList.add('row')

    let articles = ''
    let cantidad_cambios = 0

    for (const articulo in data.grupos[empresa]) {
      const precio = data.grupos[empresa][articulo]

      // Verificar si se ha modificado el precio
      const cambiado = data.cambios[empresa] && data.cambios[empresa][articulo]

      if (cambiado) {
        cantidad_cambios = Object.values(data.cambios[empresa]).length
      }


      articles += `
      <article class="${cambiado ? 'alert' : ''}">
        <p data-empresa="${empresa}">${articulo.toLowerCase()}</p><p>${format(precio)}</p>
      </article>
      `
    }

    div.innerHTML = `
    <section class="group stack" data-id="${empresa}">
      <p class="group_name" data-cambios="${cantidad_cambios > 9 ? "+9" : cantidad_cambios}">${empresa}</p>
      <label class="stack">
        <svg width="13" height="7" viewBox="0 0 13 7" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.96352 6.59896L0.677063 1.31251C0.604146 1.23959 0.549702 1.16084 0.51373 1.07625C0.477758 0.991671 0.459285 0.900283 0.458313 0.802088C0.458313 0.607644 0.525396 0.437505 0.659563 0.291671C0.79373 0.145838 0.969702 0.0729218 1.18748 0.0729218L12.2708 0.0729218C12.4896 0.0729218 12.666 0.145838 12.8002 0.291671C12.9344 0.437505 13.001 0.607644 13 0.802088C13 0.8507 12.9271 1.02084 12.7812 1.31251L7.49477 6.59896C7.37324 6.72049 7.25172 6.80556 7.13019 6.85417C7.00866 6.90278 6.87498 6.92709 6.72915 6.92709C6.58331 6.92709 6.44963 6.90278 6.32811 6.85417C6.20658 6.80556 6.08505 6.72049 5.96352 6.59896Z" fill="#262205"/>
          </svg>
          
        <input type="checkbox">
      </label>
    </section>
    <section class="list-container">
      ${articles}
    </section>
  `

    container.append(div)

  }

  // Buscar por productos o empresas según URL Param "q"

  const urlParams = new URLSearchParams(window.location.search);
  let searchQuery = urlParams.get('q').trim().toLowerCase();
  searchQuery = searchQuery.replaceAll("+", " ")
  input.value = searchQuery
  search(searchQuery)



})

// Buscar por productos o empresas
input.addEventListener('input', ({ target }) => {
  let text = target.value.trim().toLowerCase()
  search(text)
})







// Comportamiento del buscador al scroll

let buscador = $('[role="group"]')

let actualScroll = 0

window.addEventListener('scroll', () => {
  const top = Math.min(-(window.scrollY - actualScroll + buscador.clientHeight), 0)

  const progress = Math.max(1 - (Math.abs(top) / buscador.clientHeight), 0)

  if (window.scrollY > actualScroll) {
    actualScroll = window.scrollY
  }

  if (top === 0) {
    actualScroll = window.scrollY + buscador.clientHeight
  }

  buscador.setAttribute("style", `--_top:${top + progress * 20}px`);
  buscador.classList.toggle('active', window.scrollY < actualScroll && window.scrollY > buscador.clientHeight)

})

function search(text) {
  container.classList.toggle('searching', !!text)



  if (text) {

    document.title = `Resultados para: ${text} | Aliger`

    const rows = $$('.row')

    for (const row of rows) {

      const articles = _$$(row, 'article')

      for (const article of articles) {
        article.classList.remove('found')
      }

      const group_name = _$(row, '.group_name').textContent.toLowerCase()


      for (const article of articles) {

        let article_name = article.textContent.toLowerCase().split('$')[0]

        article.classList.toggle('found', article_name.includes(text))

        if (group_name.includes(text)) {
          article.classList.add('found')

        }
      }
    }
  }else{
    document.title = "Aliger | Lista de precios"
  }
}