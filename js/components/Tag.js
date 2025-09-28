import { typeColors } from '../constants.js'

/**
 * Creates a DOM element representing a Pokemon type tag
 * @param {Object<string,string>} typeColors - Map of pokemon type names to css color values
 * @param {string} type - the Pokemon type to render
 * @returns {HTMLLiElement} - A styled <li> element representing the type
 */
const Tag = ({typeColors,type})=>{
    const pill = document.createElement('li')
    pill.classList.add('tag')
    pill.style.backgroundColor=typeColors[type] || 'black'
    pill.textContent=type
    return pill
}

/**
 * Renders a list of Pokemon types as <ul> with type tags
 * @param {Array<string>} types - Array of pokemon type object from the API
 * @returns {HTMLUlListElement} - A <ul> element containing type tags
 */
export const PokemonTypes = (types)=>{
    const typesContainer = document.createElement('ul')
    typesContainer.classList.add("type-list")

     types.map(({type})=>typesContainer.appendChild(Tag({typeColors,type:type.name})))

 return typesContainer
}
