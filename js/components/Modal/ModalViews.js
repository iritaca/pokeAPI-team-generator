import { modalSelectedTab$ } from '../../utils/observer.js'
import PokemonMoves from './PokemonMoves.js'
import StatsList from './StatsView.js'
import renderPokemonChain from '../EvolutionChain.js'

/**
 * Main container for modal views, switch content based on the selected tab
 * 
 * Subscribes to `modalSelectedTab$` and updates its children
 * 
 * @param {Object} pokemon - Selected pokemon data to be passed to each view
 * @param {string} pokemon.id - Pokemon Id
 * @param {string} pokemon.name - Pokemon name
 * @param {Array<Object>} pokemon.moves - A list with pokemon moves
 * @param {Array<Object>} pokemon.stats - A list with pokemon stats
 * 
 * @returns {HTMLUlElement} - a <ul> container that dynamically renders eithers moves or stats 
 */
const ModalViews=(pokemon)=>{
    const {stats,moves,id,name} = pokemon
    const viewList = document.createElement('ul')
    
     modalSelectedTab$.subscribe(async (selectedTab)=>{
        viewList.replaceChildren()
        if(selectedTab==='moves') {
            viewList.classList.add('moves-list')
           viewList.appendChild(PokemonMoves({moves,id,name}))
        }
        if(selectedTab==='stats') {
            viewList.classList.remove('moves-list')
            viewList.appendChild(StatsList({stats,pokemonId:id}))
        }
        if(selectedTab==='evolutions'){
            viewList.classList.remove('moves-list')
            const evolutionChain = await renderPokemonChain({speciesUrl:pokemon.species,pokemonId:id})
            viewList.appendChild(evolutionChain)
        }
    })
    return viewList
}

export default ModalViews