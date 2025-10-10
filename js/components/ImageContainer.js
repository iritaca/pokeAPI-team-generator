/**
 * Creates a semantic image container (<figure> with <img>)
 * 
 * @param {string} sprite - the image source to be shown
 * @param {string} imgAlt - A string for <img alt=''/> attribute
 * @param {string} [className] - Optional additional CSS class for custom styling
 * @returns {HTMLElement} a <figure> element containing the <img>
 */
const Image=({className,sprite,imgAlt})=>{
    const imageEl = document.createElement('figure')
    imageEl.classList.add(className)
    
    const image = document.createElement('img')
    image.src=sprite
    image.alt=imgAlt
    
    imageEl.appendChild(image)
    return imageEl
}

export default Image