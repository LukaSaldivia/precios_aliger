import { _$$ } from "./main.js";
import { loadData } from "./loadData.js";

const CONFIG_URL = 'https://lukasaldivia.github.io/config_precios_aliger/'
const IMG_BASE = CONFIG_URL + 'img/'
const IMG_EMPRESAS_BASE = 'empresa/'



async function loadFromConfig() {

  const CONFIG_URL = 'https://lukasaldivia.github.io/config_precios_aliger/'
  const GRUPOS_CONFIG = 'grupos.json'
  const ARTICULOS_CONFIG = 'articulos.json'

  const gruposResponse = await fetch(CONFIG_URL + GRUPOS_CONFIG)
  const gruposData = await gruposResponse.json()
  const articulosResponse = await fetch(CONFIG_URL + ARTICULOS_CONFIG)
  const articulosData = await articulosResponse.json()
  return { grupos: gruposData, articulos: articulosData }
}

async function processConfig() {
  // Si el grupo ya establece que es sin tacc, todos los articulos dentro de ese grupo tambien lo son
  const { grupos, articulos } = await loadFromConfig()
  const grupos_details = new Map()
  const data = await loadData()

  for (const grupo in grupos) {
    for (const articulo in data[grupo]) {

      const reference = articulos[articulo + ":" + data[grupo][articulo].nombre_articulo]
      const articuloRes = data[grupo][articulo]
      articuloRes.sin_tacc = grupos[grupo].sin_tacc || (reference ? reference.sin_tacc : false)

    }

    if (!!grupos[grupo]?.img) {
      const filename = grupos[grupo].img
      grupos[grupo].img = IMG_BASE + IMG_EMPRESAS_BASE + filename
    }

    if (grupo != "FECHA") {
      grupos_details.set(grupo, grupos[grupo])
    }

  }
  return { grupos: data, grupos_details }
}

export async function getFullData() {
  return await processConfig()
}