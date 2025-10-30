const { format } = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'ARS', currencyDisplay: 'narrowSymbol', maximumFractionDigits: 0 })

export class Articulo {
  constructor(id, { nombre_articulo, modificado, factor, peso_promedio, precio, unidad_kilo, sin_tacc }) {
    this.id = id
    this._nombre = nombre_articulo
    this.modificado = modificado
    this.factor = factor
    this.pesoPromedio = peso_promedio
    this._precio = +precio
    this.unidadKilo = unidad_kilo
    this.sinTacc = sin_tacc
  }

  get nombre() {
    if (this.unidadKilo == "U") // Si se vende por unidad, solo devolver el nombre
      return this._nombre.toLowerCase()

    // A este punto, se vende por peso
    return `${this._nombre.toLowerCase()} (${this.pesoPromedio}kg)`
  }

  get precio() {
    return `${format(this._precio)}/${this.unidadKilo === "U" ? "u" : "kg"}`
  }

  toHTML() {
    return `
          <article class="articulo ${this.modificado ? 'modificado' : ''}" data-id="${this.id}">
            <h3 class="articulo-nombre">${this.nombre} ${this.sinTacc ? '<img class="sin_tacc-logo" src="img/common/sin_tacc.png"/>' : ''}</h3>
            <p class="articulo-factor">UxB: ${this.factor}</p>
            <p class="articulo-precio">${this.precio}</p>
          </article>
    `
  }
}