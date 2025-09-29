import {  selectedPokemon$ } from '../../utils/observer.js'
import ModalCard from './ModalCard.js'

/** Creates a Modal, to display more data about the selected Pokemon
 * 
 * @param {Array<Object>} list - the list of available pokemons to pick from
 * 
 * @returns {HTMLDivElement} a DOM element representing the overlay with a centered modal
 */
const Modal=({list})=>{
    const overlay = document.createElement('div')
    overlay.classList.add('modal-overlay')
    overlay.style.display='none'

    // clicking the overlay hides the modal
    overlay.addEventListener('click',()=>{
        overlay.style.display='none'
    })

    const modal = document.createElement('div')
    modal.classList.add('modal')

    // prevents modal clicks from closing it
    modal.addEventListener('click',e=>{
        e.stopPropagation()
    })
    
    overlay.appendChild(modal)

    // Update modal content whenever a Pokemon is selected
    selectedPokemon$.subscribe(id =>{
        if(!id) {
            overlay.style.display='none'
            return}
        
        const pokemon = list.find(p=>p.id ==id)
        if(!pokemon) return

        modal.replaceChildren()
        const pokemonModalLayout = ModalCard(pokemon)

        modal.appendChild(pokemonModalLayout)
        overlay.style.display='flex'
        
        
    })

    return overlay
}

export default Modal