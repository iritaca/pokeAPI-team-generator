import {MOVES_LIMIT, pokemonLimit} from './constants.js'

/**
 * Fetch the initial list of pokemon from the API
 */
const fetchList = async ()=>{
    try{
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=${pokemonLimit}`)
        const data = await res.json()
        return data.results
    }
    catch (error){
        console.error('Error caught', error)
    }
}

/**
 * Retrieves detailed Pokemon data from the API
 * - Uses cached data from localStorage if available
 * - Fetches individual Pokemon details in parallel
 * - Reduces data to a minimal set before caching to localStorage
 * 
 * @returns {Promise<Array<Object>>} - a list of simplified Pokemon objects
 * */
export const fetchAllPokemonData = async()=>{
    const cached = localStorage.getItem('pokemonList')
    if(cached) {
        console.log('using cached')
        return JSON.parse(cached)
    }

    const list = await fetchList()
    

    const allData = await Promise.all(
        list.map(async(p,_)=>{
            try{
                const res = await fetch(p.url)
                const data = await res.json()
                return data
            } catch (err){
                return null
            }
        }))

    // Extracts only essential fields to minimize storage size
    const minimalData = allData.map(p=>({
        id:p.id,
        name:p.name,
        types:p.types,
        sprite: p.sprites.front_default,
        stats:p.stats,
        species:p.species.url,
        moves:p.moves.slice(0,MOVES_LIMIT)
    }))

    localStorage.setItem('pokemonList',JSON.stringify(minimalData))

    return minimalData
}