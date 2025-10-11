import { pokemonLimit } from '../../constants.js'
import { pokedex$ } from '../../utils/observer.js'
import Image from '../ImageContainer.js'
import ProgressBar from '../ProgressBar/ProgressBar.js'
import { debounce } from '../../utils/utils.js'
import GeneralButton from '../Button.js'


/**
 * Creates a Search input element, with debounced onSearch callback
 * 
 * @param {(query: string)=> void} props.onSearch - Function called with current input value
 * 
 * @returns {element:HTMLInputElement, setValue:(value:string)=> void } 
 * element: the input element
 * setValue: function to change the value 
 */
const SearchBox=({onSearch})=>{
    const input = document.createElement('input')
    input.classList.add('pokedex-searchbox')
    input.name='search-box'
    input.placeholder='Search for Pokemon name or Id'

    const handleSearch=debounce((query)=>{
        onSearch(query)
    },300)

    input.addEventListener('input',(e)=>{
        handleSearch(e.target.value)
    })

    const setValue = (value)=>{
        input.value = value
        onSearch(value)
    }

    return {element:input,setValue}
}

/**
 * Creates a <li> containing the image, id, and name of a Pokemon
 * @param {Object} props.pokemon - The pokemon data, (name, sprite)
 * @param {string} props.id - the pokemon Id
 * 
 * @returns {HTMLListItemElement} a <div> element containing the Image, Id and Name of a Pokemon
 */
const ListItem=({pokemon,id})=>{
    const container = document.createElement('div')
    container.classList.add('list-item')

    const pokemonIdEl = document.createElement('div')
    pokemonIdEl.textContent=`${id} -`

    const pokemonNameEl = document.createElement('div')
    pokemonNameEl.textContent=pokemon.name

    container.append(Image({pokemon,className:'pokedex-image'}),pokemonIdEl,pokemonNameEl)
    return container
}

/**
 * Creates the main Pokemon List component, managing:
 * - Rendering the pokemon list and progress bar
 * - Handling search input and clear functionality
 * - Filtering visible pokemons by name or id
 * - Displays a "no results" message
 * - Reactively updating the list as new Pokemon are discovered
 * 
 * @returns {HTMLDivElement} The root container element for the list and its UI controls
 * 
 * Dependencies:
 * - Searchbox: handles debounced input events
 * - ProgressBar: displays discovered Pokemon progress
 * - ListItem: Renders individual Pokemon items
 * - pokedex$: observable stream providing updates on discovered Pokemon
 * - pokemonLimit: total number of Pokemon (used for progress calculation)
 * 
 */
const List=()=>{
    const listContainer = document.createElement('div')
    listContainer.classList.add('sidePanel-list-wrapper')
    const list = document.createElement('ul')
    list.classList.add('sidePanel-list')

    const searchSection = document.createElement('div')
    searchSection.classList.add('search-section')

    const clearButton = GeneralButton({
        className:'reset-button',
        label:'Clear search',
        onClick:()=>{
            // Reset the input value
            setValue('')
            filterList()
        }
    })
    

    const noResult = document.createElement('div')
    noResult.classList.add('no-results')
    
    noResult.style.display='none'

    // Creates a list of unique items
    let discoveredList = new Set()
    let discoveredListProgress = 0
    

    let searchValue = ''

    const handleSearchBoxValue = (value)=>{
        searchValue=value
        filterList()
    }

    // Creates the searchbox element and the inner function to modify the value
    const {element:searchBoxEl,setValue} = SearchBox({
        onSearch:handleSearchBoxValue
    })

  // Filters the list between discovered, query search and no results  
    function filterList(){
        const query = searchValue.toLowerCase()
        let hasVisible=false

        list.childNodes.forEach(li=>{
            const name = li.dataset.name?.toLowerCase() || ''
            const id = li.dataset.id?.toString()
            const matches = name?.includes(query) || id?.includes(query)
            // Shows li if the query matches a name or an id
            li.style.display=matches ? '':'none'
            if(matches) hasVisible=true
        })

        if(!hasVisible && query !==''){
            noResult.textContent=`No results match for "${searchValue}"`
            noResult.style.display=''
            searchSection.classList.add('searchbox-error')
        }else{
            noResult.style.display='none'
            searchSection.classList.remove('searchbox-error')
        }
    }

    // Creates a Progress to let the user know visually how many items are discovered
    const pokedexProgress= ProgressBar(discoveredListProgress,'pokedex-progress')

    searchSection.append(searchBoxEl,clearButton)
    listContainer.append(searchSection)
    listContainer.appendChild(noResult)
    listContainer.appendChild(pokedexProgress)

    // Main Function to reveal seen pokemons from the list 
    function collected(newList){
        newList.forEach(p=>discoveredList.add(p.id))
        discoveredListProgress = discoveredList.size
        pokedexProgress.update((discoveredList.size/pokemonLimit) * 100)
        
        const lookup = Object.fromEntries(newList.map(p=>[p.id,{name:p.name,sprite:p.sprite}]))
        list.childNodes?.forEach(li=>{
            const pokemon = lookup[li.dataset.id]
            if(pokemon) {
                li.classList.add('revealed')
                li.dataset.name=pokemon.name
                li.replaceChildren(ListItem({pokemon,id:li.dataset.id}))
            }
        })
        
        
    }

    // Brings the discovered pokemon list
    pokedex$.subscribe(pokedexData => collected(pokedexData))
    
    
    // Creates the initial list filled with "???"
    for(let i =1;i<=pokemonLimit;i++){
        const liItem = document.createElement('li')
        liItem.dataset.id=i
        liItem.textContent= '???'
        list.appendChild(liItem)
    }

    listContainer.appendChild(list)

    return listContainer
}

/**
 * Creates the main Pokedex side panel, including:
 * 
 * - A title header
 * - The Pokemon list and related UI (Search,progress, and others)
 * 
 * @returns {HTMLAsideElement} The root <aside> container of the Pokedex
 * 
 * Dependencies:
 * - List: handles rendering and managing Pokemon items and interactions
 */
const Pokedex = ()=>{
    const container = document.createElement('aside')
    container.classList.add('sidePanel-container')
    container.setAttribute('aria-label','pokedex side panel')
    
    const title = document.createElement('h3')
    title.classList.add('sidePanel-title')
    title.textContent='Pokedex'

    
    container.appendChild(title)

    const list = List()
    container.appendChild(list)

    return container
}

export default Pokedex