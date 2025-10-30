import { $ } from './main.js'

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
