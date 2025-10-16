import Image from './ImageContainer.js'
import { displayIdNumber,classNames } from '../utils/utils.js'

/**
 * Fetches the complete evolution chain for a given Pokemon species
 * 
 * This function performs two sequential fetch requests:
 * 1. Fetches the species data from the provided species URL
 * 2. Extracts the evolution chain URL from the species data and fecthes a full evolution chain
 * 
 * @async 
 * @param {string} speciesUrl - The URL of the pokemon species
 * 
 * @returns {Promise<Object>|undefined} - Resolves with the evolution chain data object, or undefined
 */
const fetchEvolutions = async (speciesUrl)=>{
    
    try{
        const speciesRes = await fetch(speciesUrl)
        const speciesData = await speciesRes.json()
        
        // get the evolution chain URL
        const evolutionChainUrl = speciesData.evolution_chain.url

        // Fetch the evolution chain
        const chainRes = await fetch(evolutionChainUrl)
        const chainData = await chainRes.json()
        return chainData

    }
    catch (err) {
        console.error('Error fetching evolutions', err)
    }

}

/**
 * Recursively collects the full evolution chain of a Pokemon
 * 
 * @param {Object} params.chain - the current node in the evolution chain
 * @param {Array<string>} paramsevolution Accumulator for collected Pokemon names
 * 
 * @returns  {Array<string>} - An Array fo Pokemon names in the evolution chain
 */
const recursivePokemonEvolution =({chain,evolutions=[]})=>{
    // Base case 
    if(!chain) return evolutions
    
    // Returns the first pokemon
    if(chain?.evolves_to?.length===0) return evolutions.concat(chain.species.name)

    // Recursive call: add current species and continue down the first evolution path
    return recursivePokemonEvolution({chain:chain.evolves_to[0],evolutions:evolutions.concat(chain.species.name)})
}

/**
 * Generates an array of Pokemon chained evolutions for a species
 * @async 
 * @param {string} speciesUrl - URL of the pokemon species
 * @return {Promise<Array<string>>} - Array of Pokemon names in evolution order
 * */ 
async function getEvolutions(speciesUrl){
    const evolutionChain = await fetchEvolutions(speciesUrl)

    const pokemonEvolutionList = recursivePokemonEvolution({chain:evolutionChain.chain})
    return pokemonEvolutionList
}

/**
 * Retrieves full details for each Pokemon in a chain of evolutions.
 * 
 * Uses a locally storage Pokemon list, and minifies the data to only include relevant fields.
 * 
 * @param {Array<string>} evolutionChain - a list with the evolution chain
 * 
 * @returns {Array<Objects>} - Array of Pokemon objects with only `id`,`name` , and `sprite`
 */
const getPokemonChain=(evolutionChain)=>{
    const fullMinifiedPokemonList = JSON.parse(localStorage.getItem('pokemonList')||[])
    
    // Filter Pokemon that are in the evolution chain
    const getDetailedPokemonChain = fullMinifiedPokemonList.filter(pokemon=>evolutionChain.includes(pokemon.name))

    // Minify to only needed fields
    const getPokemonNameAndSprite = getDetailedPokemonChain.map(p=>({id:p.id,name:p.name,sprite:p.sprite}))

    return getPokemonNameAndSprite
}

/**
 * Creates UI container for a single Pokemon in the Evolution chain 
 * 
 * @param {Array<Object>} params.pokemon - the pokemon data object
 * @param {number} params.active - The id of the currently selected Pokemon to apply a highlighted style
 * 
 * @returns {HTMLLIElement}- a <li> element containing the sprite, pokemon name and id
 */
const EvolutionContainer=({pokemon,active})=>{
    const liEl = document.createElement('li')
    liEl.className=classNames({isActive:active===pokemon.id})
    const sprite = Image({pokemon, className:'evolution-image'})

    liEl.appendChild(sprite)

    const pokemonNameAndId = document.createElement('div')
    pokemonNameAndId.classList.add('evolution-name')

    const pokemonNameEl = document.createElement('h4')
    pokemonNameEl.textContent= pokemon.name

    const pokemonNumberEl = document.createElement('span')
    pokemonNumberEl.textContent = `#${displayIdNumber(pokemon.id)}`

    pokemonNameAndId.append(pokemonNameEl,pokemonNumberEl)
    liEl.appendChild(pokemonNameAndId)
    return liEl
}
   
/**
 * Renders the full Pokemon chain UI for a selected Pokemon species
 * 
 * @async
 * @param {string} speciesUrl - URL of the pokemon species
 * @param {pokemonId} params.pokemonId - the selected pokemon id
 * 
 * @returns {Promise<HTMLDivElement>} - a <div> element containing the full evolution chain UI
 */
    const renderPokemonChain= async ({speciesUrl,pokemonId})=>{
        
    const pokemonChain = await getEvolutions(speciesUrl)
    const pokemonChainDetails = getPokemonChain(pokemonChain)

    const container = document.createElement('div')
    container.classList.add('evolution-container')

    const pokemonChainContainer = document.createElement('ul')
    pokemonChainContainer.classList.add('evolution-list')
    
    pokemonChainDetails.forEach(p=>{
        const pokemon = EvolutionContainer({pokemon:p,active:pokemonId})
        
        pokemonChainContainer.appendChild(pokemon)
    })

    container.appendChild(pokemonChainContainer)
    
    return container
}

export default renderPokemonChain