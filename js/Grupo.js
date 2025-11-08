import { Articulo } from "./Articulo.js"

export class Grupo {
  constructor(nombre, articulos, {color, img}) {
    this.nombre = nombre
    this.articulos = Object.entries(articulos).map(([id, articulo]) => new Articulo(id, articulo))
    this.color = color
    this.imgURL = img
    console.log(nombre, this.imgURL)
    
    // Si tiene por lo menos un articulo sin tacc, se puede confirmar que sin_tacc = true para este grupo
    this.sin_tacc = Object.values(articulos).some(articulo => articulo.sin_tacc)
  }

  toHTML(){
    return `
      <section class="grupo" ${!!this.color ? `style="--clr-grupo: ${this.color};"` : ""}>
        <header class="grupo-header">
          <p class="grupo-nombre">${this.nombre} ${!!this.imgURL ? `<img class="grupo-logo" src="${this.imgURL}"/>` : ""} ${this.sin_tacc ? '<img class="sin_tacc-logo" src="img/common/sin_tacc.png"/>' : ''}</p>
          <label class="flecha stack">
          <svg width="13" height="7" viewBox="0 0 13 7" fill="none">
            <path
              d="M5.96352 6.59896L0.677063 1.31251C0.604146 1.23959 0.549702 1.16084 0.51373 1.07625C0.477758 0.991671 0.459285 0.900283 0.458313 0.802088C0.458313 0.607644 0.525396 0.437505 0.659563 0.291671C0.79373 0.145838 0.969702 0.0729218 1.18748 0.0729218L12.2708 0.0729218C12.4896 0.0729218 12.666 0.145838 12.8002 0.291671C12.9344 0.437505 13.001 0.607644 13 0.802088C13 0.8507 12.9271 1.02084 12.7812 1.31251L7.49477 6.59896C7.37324 6.72049 7.25172 6.80556 7.13019 6.85417C7.00866 6.90278 6.87498 6.92709 6.72915 6.92709C6.58331 6.92709 6.44963 6.90278 6.32811 6.85417C6.20658 6.80556 6.08505 6.72049 5.96352 6.59896Z"
              fill="#262205" />
          </svg>
          <input type="checkbox">
        </label>
      </header>

        <div class="articulos-lista">
          ${this.articulos.map(articulo => articulo.toHTML()).join('')}
        </div>


      </section>

    `
  }
}