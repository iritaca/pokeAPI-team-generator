import {team$} from './utils/observer.js'
import GeneralButton from './components/Button.js'

/**
 * @typeof {Object} TeamOptions
 * @property {Array<object>} pokemonList - the list of available pokemons to pick from
 * @property {number} teamSize - Number of pokemons to include in the team
 */

/**
 * Creates a list of random set of pokemons
 * @param {TeamOptions} options
 * @returns  {Array<Object>} The generated team
 */
const generateTeam = ({pokemonList,teamSize})=>{
    return Array.from({length:teamSize},()=>{
        const index = Math.floor(Math.random() * pokemonList.length)
        return pokemonList[index]
    })
}

/**
 * Button component that generates and broadcasts a random pokemon team
 * @param {TeamOptions} props
 * @returns {HTMLButtonElement} The generated team
 */
export const PickRandomTeam=({pokemonList,teamSize=6})=>{
    const handleClick =()=>{
        const team = generateTeam({pokemonList,teamSize})
        team$.notify(team) // broadcast and update currentValue of the team
    }

    return GeneralButton({className:'generate-team',label:'Generate team', onClick:handleClick
    })
}




export default PickRandomTeam