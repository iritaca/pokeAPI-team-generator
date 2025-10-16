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
 * @param {number} initialProgress - The progress percentage (0-100)
 * @param {string} label - adds a label above the progress bar
 * @param {boolean} showValue - Display the numeric value of the progress
 * @param {string} [className]  - Optional additional CSS class for custom styling
 * 
 * Uses `getProgressColor` to add a custom color based on the progress value
 * 
 * @returns {HTMLDivElement} <div> element containing the colored progress bar
 */
const ProgressBar=({initialProgress=0,className,label,showValue})=>{
    const progressContainer = document.createElement('div')
    progressContainer.className=classNames(['progress-container',className])

    const progressRoot = document.createElement('div')
    progressRoot.classList.add('progress-root')
    const progressBar = document.createElement('div')
    progressBar.classList.add('progress-bar')

    let progressValueEl = null

    if(label){
        const progressLabel = document.createElement('h4')
        progressLabel.classList.add('progress-label')
        progressLabel.textContent=label
        progressContainer.appendChild(progressLabel)
    }

    if(showValue){
        progressValueEl = document.createElement('p')
        progressValueEl.classList.add('progress-value')
        progressValueEl.textContent=initialProgress
        progressContainer.appendChild(progressValueEl)
    }

    progressRoot.appendChild(progressBar)
    progressContainer.appendChild(progressRoot)

    const setProgress=(progress)=>{
        progressBar.style.width= `${progress}%`
        progressBar.style.backgroundColor=getProgressColor(progress)
        if(showValue) progressValueEl.textContent=`${Math.floor(progress)}%`

    }

    setProgress(initialProgress)

    progressContainer.update=setProgress

    return progressContainer
}

export default ProgressBar