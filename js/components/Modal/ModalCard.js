import { classNames, displayIdNumber } from '../../utils/utils.js'
import Image from '../ImageContainer.js'
import Tabs from '../Tabs.js'
import { PokemonTypes } from '../Tag.js'
import ModalViews from './ModalViews.js'


/**
 * Creates a simple box rendering a skeleton container used to wait while loading content
 * 
 * @returns - a DOM div element 
 */
const ModalSkeleton =()=>{
    const skeletonEl = document.createElement('div')
    skeletonEl.classList.add('skeleton-loader')
    return skeletonEl
}

const loadersList = [
    {name:'titleEl',className:'modal-title'},
    {name:'tagsContainer',className:['modal-subtitle','tag-loader']},
    {name:'imageContainer',className:'modal-image'},
    {name:'tabsContainer',listCount:2,className:['modal-tabs','tabs-loader']},
    {name:'statsContainer',listCount:5,className:['modal-stats','stats-loader']},
    {name:'evolutionChain',listCount:1,className:['evolution-container','modal-evolution-chain']}
]

/**
 * Creates a container element filled with skeleton placeholders to indicate loading state
 * 
 * Depending on the `listCount`, it will create either:
 * - <ul> element containing multiple <li> skeleton items or 
 * - <div> element with one skeleton
 * 
 *  
 * @param {Object} params 
 * @param {number} params.listCount - Number of skeletons to be render.
 * @param {string} param.className  - Optional additional CSS class for custom styling
 * @returns {HTMLElement} A DOM element containing skeleton placeholders
 */
function createElementsWithSkeleton({listCount,className}){
    // Create either <ul> or <div> depending on listCount
    const el  = listCount?document.createElement('ul'): document.createElement('div')
    
    // if listCount exists, generates child <li> with skeletons
    if(listCount){
        for(let i = 0;i<listCount;i++){
            const li = document.createElement('li')
            li.appendChild(ModalSkeleton())
            el.appendChild(li)
        }
    }else{
        el.appendChild(ModalSkeleton())
    }
    // Apply classes
    el.className=classNames(className)

    return el
}

/**
 * Generates a document fragment containing multiple skeleton loader sections
 * Each laoder section is created using createElementsWithSkeleton()
 * 
 */
export const ModalLoaders=()=>{
    const fragment = document.createDocumentFragment()
    const loaders= loadersList.map(loader=>createElementsWithSkeleton(loader))
    loaders.forEach(el=>fragment.appendChild(el))

    return fragment
}

/**
 * Create the DOM elemnts for the modal title, containing the Pokemon name and formatted id
 * 
 * @param {Object} params
 * @param {string} params.name - pokemon name
 * @param {number} params.id - pokemon id
 *
 * @returns {HTMLDivElement} A DOM element containing the modal title section
 */
const ModalTitle=({name,id})=>{
    const nameEl = document.createElement('h2')
    nameEl.textContent=name

    const idEl = document.createElement('span')
    idEl.textContent=`#${displayIdNumber(id)}`

    const title = document.createElement('div')
    title.classList.add('modal-title')
    title.append(nameEl,idEl)

    return title 
}

/**
 * Creates a Pokemon Tags container showing the Pokemon Type(s)
 * 
 * @param {Object} params
 * @param {Array<string>} types - List of Pokemon type names
 *  
 * @returns {HTMLDivElement} A DOM element containing Pokemon type tags
 */
const ModalTags = ({types})=>{
const tagsContainer=document.createElement('div')
    tagsContainer.classList.add('modal-subtitle')
    tagsContainer.appendChild(PokemonTypes(types))

    return tagsContainer
}


/**
 * Creates a container for the modal views, displaying detials like stats or moves
 * @param {Object} params.pokemon - The pokemon object data
 *  
 * @returns {HTMLDivElement} A DOM element wrapping the modal views
 */
const ModalView=({pokemon})=>{
    const modalView = document.createElement('div')
    modalView.classList.add('modal-view')
    
    modalView.appendChild(ModalViews(pokemon))
    
    return modalView
}


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
 * @param {string} pokemon.types - Array of pokemon types
 * 
 * @returns  {DocumentFragment} - a document Fragment containing HTML structure
 */
const ModalCard=(pokemon)=>{
    const {name,id,types} = pokemon

    // main container
    const grid = document.createElement('div')
    grid.classList.add('modal-grid')
    
    // Render modal loaders immediately
    const modalLoaders = ModalLoaders()
    grid.appendChild(modalLoaders)
    

    // Defer heavy DOM creation
    setTimeout(async ()=>{
        grid.replaceChildren()

        const modalTitleEl = ModalTitle({name,id})
        const tagsContainer = ModalTags({types})
        grid.append(modalTitleEl,tagsContainer)
    
        const tabs = Tabs({tabs:['stats','evolutions','moves'],className:'modal-tabs'})
        grid.appendChild(tabs)
    
        const modalView = ModalView({pokemon})
        grid.appendChild(modalView)

        const img = Image({className:'modal-image',pokemon})
        grid.appendChild(img)
    
        
        
        
        
    },800)

    return grid
}

export default ModalCard