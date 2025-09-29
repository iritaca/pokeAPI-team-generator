import { classNames } from '../utils/utils.js'

/**
 * Creates a styled button element with a click handler
 * 
 * @param {string} label  - The button's visible text
 * @param {function} onClick - Callback invoked when the button is clicked
 * @param {string} [className]  - Optional additional CSS class for custom styling
 * @returns {HTMLButtonElement} a configured <button> element
 */
const GeneralButton=({className,label,onClick})=>{
    const button = document.createElement('button')
    button.className = classNames(className)
    button.textContent = label
    button.addEventListener('click',onClick)
    return button
}

export default GeneralButton