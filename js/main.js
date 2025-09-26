/**
 * Entry point for the Pokemon app
 * - Fetches pokemon data
 * - Mounts core UI components 
 * - Wires everything together 
 */
import { CardsGrid } from './components/CardsGrid.js'
import { fetchAllPokemonData } from './fetchPokemon.js'
import PickRandomTeam from './GenerateTeam.js'
import Modal from './components/Modal/Modal.js'

// DOM anchors
const actions = document.getElementById('actions')
const main = document.getElementById('main')

//  fetch complete pokemon dataset once on app load
const fetchList = await fetchAllPokemonData()


actions.appendChild(PickRandomTeam({pokemonList:fetchList}))

main.appendChild(CardsGrid())

// Initialize modal (to display detailed info)
const modal = Modal({list:fetchList})
document.body.appendChild(modal)