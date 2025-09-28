import { modalSelectedTab$ } from '../utils/observer.js'
import { classNames } from '../utils/utils.js'

/**
 * Creates a navigation element with interactive tabs
 * @param {Array<string>} tabs - Labels for each tab
 * @param {string} [className]  - Optional additional CSS class for custom styling
 * @returns {HTMLNavElement} a <nav> element containing tab elements
 */
const Tabs =({tabs,className})=>{
    const tabsContainer = document.createElement('nav')
    tabsContainer.className= classNames('tabs-container',className)
    
    // Use event delegation to handle clicks on tab elements
    tabsContainer.addEventListener('click', e=>{
        const tab = e.target.closest('.tab')
        const selectedTab = tab.dataset.id
        modalSelectedTab$.notify(selectedTab)
    })
    
    // Renders each tab as a <li> with its label and data-id
    tabs.map(tab=>{
        const tabEl = document.createElement('li')
        tabEl.className=classNames('tab')
        tabEl.textContent=tab
        tabEl.dataset.id = tab
        tabsContainer.appendChild(tabEl)
    })

    modalSelectedTab$.notify(tabs[0])

    // Update active tab styling whenever the selected tab changes
    modalSelectedTab$.subscribe(selectedTab=>{
        Array.from(tabsContainer.children).forEach(tabEl=>{
            tabEl.classList.toggle('is-active',tabEl.dataset.id===selectedTab)
        })
    })

    return tabsContainer
}

export default Tabs