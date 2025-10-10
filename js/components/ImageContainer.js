/**
 * Creates a semantic image container (<figure> with <img>)
 * 
 * @param {Object} params.pokemon - The pokemon object data
 *  
 * @param {string} [className] - Optional additional CSS class for custom styling
 * @returns {HTMLElement} a <figure> element containing the <img>
 */
const Image=({className,pokemon})=>{
    const {name,sprite} = pokemon

    const imageEl = document.createElement('figure')
    imageEl.classList.add(className)
    
    const image = document.createElement('img')
    image.src=sprite
    image.alt=name

    imageEl.appendChild(image)
    return imageEl
}

export default Image