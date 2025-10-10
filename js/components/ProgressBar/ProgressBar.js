import { classNames } from '../../utils/utils.js'

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
    if(progress<=33) return 'tomato'
    if(progress<=66) return 'orange'
    return 'yellowgreen'
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
const ProgressBar=(initialProgress=0,className)=>{
    const progressContainer = document.createElement('div')
    progressContainer.className=classNames(['progress-container',className])

    const progressBar = document.createElement('div')
    progressBar.classList.add('progress-bar')

    progressContainer.appendChild(progressBar)

    const setProgress=(progress)=>{
        progressBar.style.width= `${progress}%`
        progressBar.style.backgroundColor=getProgressColor(progress)

    }

    setProgress(initialProgress)

    progressContainer.update=setProgress

    return progressContainer
}

export default ProgressBar