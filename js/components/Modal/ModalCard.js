import { displayIdNumber } from '../../utils/utils.js'
import Image from '../ImageContainer.js'
import Tabs from '../Tabs.js'
import { PokemonTypes } from '../Tag.js'
import ModalViews from './ModalViews.js'

/**
 * Creates a card element, in the Modal, to represent a pokemon
 * 
 * The card includes 
 * - A sprite image
 * - Pokemon name
 * - Pokemon id
 * - Pokemon types
 * @param {Object} pokemon  - The pokemon data
 * @param {string} pokemon.id - The pokemon id
 * @param {string} pokemon.name - The pokemon name
 * @param {string} pokemon.sprite - The image source 
 * @param {string} pokemon.types - Array of pokemon types
 * 
 * @returns  {DocumentFragment} - a document Fragment containing HTML structure
 */
const ModalCard=(pokemon)=>{
    const fragment = document.createDocumentFragment()
    const {name,id,sprite,types} = pokemon
    
    const nameEl = document.createElement('h2')
    nameEl.textContent=name
    
    const idEl = document.createElement('span')
    idEl.textContent=`#${displayIdNumber(id)}`
    
    const title = document.createElement('div')
    title.classList.add('modal-title')
    title.append(nameEl,idEl)
    fragment.appendChild(title)

    const tagsContainer = document.createElement('div')
    tagsContainer.classList.add('modal-subtitle')
    tagsContainer.appendChild(PokemonTypes(types))
    fragment.appendChild(tagsContainer)

    const tabs = Tabs({tabs:['stats','moves'],className:'modal-tabs'})
    fragment.appendChild(tabs)

    const modalView = document.createElement('div')
    modalView.classList.add('modal-view')

    modalView.appendChild(ModalViews(pokemon))
    fragment.appendChild(modalView)
    
    const img = Image({className:'modal-image',sprite})
    fragment.appendChild(img)
    console.log({pokemon})

    return fragment
}

export default ModalCard