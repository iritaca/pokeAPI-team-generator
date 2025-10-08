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
import Filters from './components/Filters.js'


// DOM anchors
const generateTeamButton = document.getElementById('generate-button')
const teamFilters= document.getElementById('filters')
const main = document.getElementById('main')

//  fetch complete pokemon dataset once on app load
const fetchList = await fetchAllPokemonData()


generateTeamButton.appendChild(PickRandomTeam({pokemonList:fetchList}))

teamFilters.appendChild(Filters())

main.appendChild(CardsGrid())

// Initialize modal (to display detailed info)
const modal = Modal({list:fetchList})
document.body.appendChild(modal)