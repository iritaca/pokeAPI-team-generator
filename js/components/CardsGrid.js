import {team$,selectedPokemon$} from '../utils/observer.js'
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

    let prevTeam = []

    /**
     * Renders the current team into the grid
     * Replaces all existing children to ensure consistency
     * Falls back to a message if no team is available
     * 
     * @param {Array<Object>} newTeam  - The new team to render 
     */
    const render = (newTeam =[])=>{
        container.replaceChildren()
        if(!Array.isArray(newTeam)|| newTeam.length===0){
            container.replaceChildren()
            const emptyMsg= document.createElement('p')
            emptyMsg.textContent='Click "Generate team" to display a team'
            container.appendChild(emptyMsg)
            prevTeam=[]
            return
        }

        // Render each Pokemon card
        newTeam.forEach(newPokemon =>{
            const newCard = Card({data:newPokemon})
            newCard.dataset.id=newPokemon.id
            container.appendChild(newCard)
        })

        // keep a copy of the current team for reference
        prevTeam= newTeam.slice() 
    }

    // Event Delegation:
    // Listens for click on any card inside the grid,
    // then notifies `selectedPokemon$` with the clicked Pokemon id
    container.addEventListener('click',e=>{
        const card = e.target.closest('.card')
        if(card && container.contains(card)){
            const pokemonId = card.dataset.id
            selectedPokemon$.notify(pokemonId)
        }
    })

    // The initial render (in case observable already has a team)
    render(team$.getValue())

    // Subscribe for updates => every button click triggers re-render
    team$.subscribe(team=>render(team))

    return container
}