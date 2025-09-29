const movesMap = new Map()

/**
 * Generates an array with 4 random numbers from 0 to listSize-1
 * 
 * Uses a recursive approach to skip duplicates and ensures only unique numbers are selected
 * 
 * @param {number} listSize - the size of the list
 *  
 * @returns {number[]} An array of unique random numbers
 */
const recursiveRandomNumbers = (listSize,numbers=[])=>{
    // Base case to break the recursion 
    if(numbers.length===4 || numbers.length===listSize) return numbers
    
    const index = Math.floor(Math.random()*listSize)

    if(!numbers.includes(index)) return recursiveRandomNumbers(listSize, numbers.concat(index))
    
    return recursiveRandomNumbers(listSize,numbers)
}

/**
 * Get the selected moves from the list by using the list of random numbers
 * 
 * @param {Object} params
 * @param {Array<{move: {name: string}}>} params.moves - Array of pokemon moves object
 * @param {string} params.id - The pokemon id
 * @param {string} params.name - The pokemon name
 * 
 * @returns {string[]} - Array of 4 unique random pokemon moves names
 */
const getPokemonMoves=({moves,id,name})=>{
    const key = `${id}-${name}`
    
    if(movesMap.has(key)) return movesMap.get(key)
    const randomNumbers = recursiveRandomNumbers(moves.length)
    const pokemonMoves = randomNumbers.map(moveId => moves[moveId].move.name)
    movesMap.set(key,pokemonMoves)

    return movesMap.get(key)
}

/**
 * Renders a list of 4 pokemon moves as `<li>` elements inside a DocumentFragment
 * 
 * Uses `getPokemonMoves` to select unique moves
 * 
 * @param {Object} params
 * @param {Array<{move: {name: string}}>} params.moves - Array of pokemon moves object
 * @param {string} params.id - The pokemon id
 * @param {string} params.name - The pokemon name
 * 
 * @returns {DocumentFragment} a DocumentFragment containing <li> elements 
 */
const PokemonMoves = ({moves,id,name})=>{
    const pokemonMoves = getPokemonMoves({moves,id,name})

    const movesList = document.createDocumentFragment()
    pokemonMoves.map(move => {
        const liEl= document.createElement('li')
        liEl.classList.add('move-item')
        liEl.textContent=move
        movesList.appendChild(liEl)
    })
    return movesList
}

export default PokemonMoves