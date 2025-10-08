import {team$,selectedPokemon$, filtersList$} from '../utils/observer.js'
import Card from './Card.js'

/**Creates a responsive grid container for displaying the Pokemon team
 * 
 * The grid stays in sync with the 'team$' observable:
 * - On updates, replaces the current element with the new team
 * - If the team is empty, it shows a fallback message
 * 
 * Clicking on a card will notify `selectedPokemon$` with the pokemon ID
 * 
 * @returns {HTMLDivElement} a <div> element with the `cards-grid` class
 */
export const CardsGrid=()=>{
    const container = document.createElement('div')
    container.classList.add('cards-grid')

    let allCards=[]

    /**
     * Renders the current team into the grid
     * Replaces all existing children to ensure consistency
     * Falls back to a message if no team is available
     * 
     * @param {Array<Object>} newTeam  - The new team to render 
     */
    const renderTeam = (newTeam)=>{
        container.replaceChildren() // clear previous content
        allCards=[] // resets all cards array

        if(!Array.isArray(newTeam)|| newTeam.length===0){
            const emptyMsg= document.createElement('p')
            emptyMsg.textContent='Click "Generate team" to display a team'
            container.appendChild(emptyMsg)
            return
        }

        // Render each Pokemon card
        newTeam.forEach(pokemon =>{
            const card = Card({data:pokemon})
            card.types = pokemon.types.map(t=> t.type.name)
            card.dataset.id=pokemon.id

            container.appendChild(card)
            allCards.push(card)
        })

    }

    const applyFilters=(filters)=>{
        allCards.forEach(card=>{
            const isVisible = filters.length===0 || card.types.some(t=>filters.includes(t))
            card.classList.toggle('filtered-out',!isVisible)
        })
    }

    // Event Delegation:
    // Listens for click on any card inside the grid,
    // then notifies `selectedPokemon$` with the clicked Pokemon id
    container.addEventListener('click',e=>{
        const card = e.target.closest('.card')
        if(!card) return
        selectedPokemon$.notify(card.dataset.id)
    })


    // Subscribe to team changes
    team$.subscribe(newTeam=>renderTeam(newTeam))

    // Subscribe to filter changes
    filtersList$.subscribe(filters=> applyFilters(filters))

    return container
}