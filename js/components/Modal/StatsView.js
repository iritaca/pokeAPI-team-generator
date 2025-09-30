const computedStats = new Map()

/**
 * Computes a random value for a Pokemon stat based on its maxValue
 * 
 * The computed value is cached per Pokemon and stat to ensure consistency
 * Values less than 0 are clamped to 3
 * 
 * @param {Object} params
 * @param {string} params.pokemonId - The pokemon Id
 * @param {string} params.statName - The stat name
 * @param {number} params.maxValue - The maximum value of the stat from the API
 * 
 * @returns {number} The computed stat value
 */
const getComputedStat=({pokemonId,statName,maxValue})=>{
    const key = `${pokemonId}-${statName}`
    if(!computedStats.has(key)){
        const value = maxValue - Math.ceil(Math.random() * 30)
        computedStats.set(key, value<0 ? 3 : value)
    }
    return computedStats.get(key)
}

/**
 * Returns a CSS color for a progress bar based on the value
 * 
 * @param {number} progress - Progress value (0-100)
 * 
 * @returns {string} A css color:
 *  - tomato = low
 *  - orange = medium
 *  - yellowgreen = high
 */
function getProgressColor(progress){
    if(progress<=25) return 'tomato'
    if(progress<=50) return 'orange'
    return 'yellowgreen'
}

/**
 * Computes the percentage of a stat value relative to its maxValue
 * 
 * @param {Object} params
 * @param {number} params.value - The computed stat value
 * @param {number} params.maxValue - The maximum stat value from the API
 * 
 * @returns {number} The progress percentage (0-100)
 */
function getProgress({value,maxValue}){
    return (value * 100) / maxValue
}

/**
 * Returns a formatted title for a pokemon stat
 * 
 * @param {string} title - Raw stat name
 * 
 * @returns Formatted stat name (e.g. hp => HP, special attack => sp. attack)
 */
const getStatTitle=(title)=>{
if(title ==='hp') return 'HP'
        if(title.includes('special')){
            const subtitle = title.split('-')[1]
            return `sp.${subtitle}`
        }
        return title
}

/**
 * Renders a <p> element to display the stat title
 * 
 * @param {string} title - The stat name
 * 
 * @returns {HTMLParagraphElement} <p> element with the stat title
 */
const StatTitle=(title)=>{
    const statsTitleEl = document.createElement('p')
    statsTitleEl.classList.add('stat-title')

    statsTitleEl.textContent = getStatTitle(title)
    return statsTitleEl
}

/**
 * Renders a <div> element displaying the stat value
 * 
 * @param {number} value - stat value
 * 
 * @returns {HTMLDivElement} <div> element with the stat value
 */
const StatValue =(value)=>{
    const statValueEl=document.createElement('div')
    statValueEl.classList.add('stat-value')
    statValueEl.textContent=value

    return statValueEl
}

/**
 * Renders a progress bar for a stat value
 * 
 * @param {number} progress - The progress percentage (0-100)
 * 
 * Uses `getProgressColor` to add a custom color based on the progress value
 * 
 * @returns {HTMLDivElement} <div> element containing the colored progress bar
 */
const StatBar=(progress)=>{
    const progressContainer = document.createElement('div')
    progressContainer.classList.add('progress-container')
    const progressBar = document.createElement('div')
    progressBar.classList.add('progress-bar')

    progressBar.style.width= `${progress}%`

    const progressColor = getProgressColor(progress)
    progressBar.style.backgroundColor=progressColor

    progressContainer.appendChild(progressBar)
    return progressContainer
}

/**
 * Computes the stat value and progress for a Pokemon stat
 * 
 * @param {Object} params
 * @param {Object} params.stat - The pokemon stat object from the API
 * @param {string} params.pokemonId - the pokemon ID
 * 
 * @returns a computed value , progress and the stat name
 */
function computeStatData({stat,pokemonId}){
    const {stat:statObj,base_stat:maxValue} = stat
    const statName = statObj.name
    const value = getComputedStat({pokemonId,statName,maxValue})
    const progress = getProgress({value,maxValue})
    return {statName,value,progress}
}

/**
 * Renders a <li> element containing the stat name, value, and progressbar
 * 
 * @param {Object} params
 * @param {Object} params.stat - The pokemon stat object
 * @param {string} params.pokemonId - the pokemon ID
 * 
 * @returns A <li> element
 */
const Stat=({stat,pokemonId})=>{
    const {statName,value,progress} = computeStatData({stat,pokemonId})
    
    const statContainer = document.createElement('li')
    statContainer.classList.add('stat-container')
    
    const statTitleEl = StatTitle(statName)
    const statBaseEl = StatValue(value)
    const statBarEl = StatBar(progress)

    statContainer.append(statTitleEl,statBaseEl,statBarEl)
    return statContainer
}

/**
 * Renders a DocumentFragment containing a list of Pokemon Stats
 * 
 * @param {Object} params
 * @param {Array<Object>} params.stats - The pokemon stats array
 * @param {string} params.pokemonId - the pokemon ID
 * 
 * @returns a DocumentFragment containing <li> elements for each stat
 */
const StatsList = ({stats,pokemonId})=>{
    const statsList = document.createDocumentFragment()
    stats.forEach(stat=>statsList.appendChild(Stat({stat,pokemonId})))
    return statsList
    
}

export default StatsList