import { displayIdNumber } from '../utils/utils.js'
import Image from './ImageContainer.js'
import { PokemonTypes } from './Tag.js'

/**
 * Creates a card element representing a Pokemon
 * 
 * The card includes :
 * A sprite image
 * the pokemon id
 * the pokemon name
 * the pokemon types
 * @param {Object} data - The pokemon data
 * @param {string} data.id - Unique id for the pokemon
 * @param {string} data.name - Display the pokemon name
 * @param {string[]} data.types - Array of pokemon types
 * @param {string} data.sprite - The image source 
 * @returns {HTMLDivElement} - representing the pokemon
 */
const Card=({data})=>{
    const {id, name,types,sprite } = data
    const container = document.createElement('div')
    container.classList.add('card')

    const imageContainer = Image({className:'card-image',sprite})

    const pokemonNameAndId = document.createElement('div')
    pokemonNameAndId.classList.add('card-name-id')

    const pokemonName = document.createElement('h3')
    pokemonName.textContent=name
    

    const pokemonNumber = document.createElement('span')
    pokemonNumber.textContent=`#${displayIdNumber(id)}`

    pokemonNameAndId.append(pokemonNumber,pokemonName)

    const pokemonType = PokemonTypes(types)

    container.append(imageContainer,pokemonNameAndId,pokemonType)

    return container
}

export default Card