import {filtersList$, team$} from '../utils/observer.js'
import GeneralButton from './Button.js'

/**
 * Creates a toggle button for a Pokemon type
 * - shows the pokemon type and the number of Pokemons with the type.
 * 
 * @param {string} title - The pokemon type
 * @param {number} count - The number of pokemons of this type
 *  
 * @returns  {HTMLButtonElement} - The toggle button
 */
const Toggle =({title,count})=>{
    const button = document.createElement('button')
    button.classList.add('toggle')
    button.dataset.id=title

    const buttonTitle = document.createElement('div')
    buttonTitle.textContent = title

    const buttonCount = document.createElement('span')
    buttonCount.textContent = count
    
    button.append(buttonTitle,buttonCount)
    return button
}

/**
 * Renders the Pokemon filters
 * 
 * The component reacts to:
 * - "team$" - to update the available type toggles
 * - "filtersList$" - to keep the UI in sync when filters change
 * 
 * 
 * The cardsGrid response to the toggles activity
 * 
 * @returns {HTMLDivElement} A <div> containing the filter toggles
 */
const Filters=()=>{
    const container = document.createElement('div')
    container.classList.add('filters-list')

    /**
     * Renders togglue buttons based on the current team
     * @param {Array<Object>} team - The Pokemon team
     * @param {Array<string>} activeFilters - THe currently active filter IDs
     */
    const renderToggles = (team,activeFilters=[])=>{
        container.replaceChildren()
        
        if(!Array.isArray(team) || team.length===0){
            return 
        }

        // Creates a frequency map of Pokemon types
        const frequecyMap =team
            .flatMap(p=>p.types)
            .reduce((acc,t)=>{
                const typeName = t?.type?.name
                if(!typeName) return acc
            acc[typeName] = (acc[typeName] || 0) + 1
            return acc
            },{})

            
        const orderedList = Object.entries(frequecyMap).sort((a,b)=> b[1] - a[1])
        
        orderedList.forEach(([type,count])=>{
            const toggle = Toggle({title:type,count})
            toggle.classList.toggle('isActive',activeFilters.includes(type))
            container.appendChild(toggle)
        })

    }

    // Stores active filters locally for reference during team updates
    let activeFilters = filtersList$.getValue()

    // Subscribe to the generated team to obtain the types
    team$.subscribe(team=>renderToggles(team,activeFilters))

     // Sync toggle states whenever filters change externally
    filtersList$.subscribe(newFilters=>{
        activeFilters = newFilters
        container.querySelectorAll('.toggle').forEach(btn=>{
            const id = btn.dataset.id
            btn.classList.toggle('isActive', activeFilters.includes(id))
        })
    })

    


    // Handle user interactions
    container.addEventListener('click', e=>{
            const toggle=e.target.closest('.toggle')
            if(!toggle) return

            const id = toggle.dataset.id
            const isActive = toggle.classList.toggle('isActive')

            const nextFilters= isActive ? [...activeFilters,id] : activeFilters.filter(f=> f !== id)

            filtersList$.notify(nextFilters)
        })

    renderToggles(team$.getValue(), activeFilters)

    return container
}

export default Filters