/**
 * Formats a pokemon ID as a three-digit string (3=>"003")
 * @param {number} number - The pokemon ID to format
 * @returns {string} A zero-padded string (e.g. 3 => 003)
 *  
 * */ 
export const displayIdNumber =(number)=>{
    return String(number).padStart(3,'0')
}


/**
 * Utility to combine class names a single string
 * Accepts strings, arrays, or objects where truthy values
 * @param {...(string|string[]|Object)} args - Class name inputs
 * @returns {string} A space-separated class string
 * 
 * @example 
 * - classNames('btn',{active:isActive},['extra',null]) => 'btn active extra'
 *  */ 
export const classNames =(...args)=>{
    return args
        .flatMap(arg=>{
            if(!arg) return []
            if(typeof arg ==='string') return [arg]
            if(Array.isArray(arg)) return arg.filter(Boolean)
            if(typeof arg ==='object'){
                return Object.entries(arg)
                    .filter(([_,value])=> Boolean(value))
                    .map(([key])=> key)
            }
            return []
        })
        .join(' ')
     
}

 /**
  * Creates a debounce version of a function that delays its 
  * execution, until after `delay` milliseconds have passed since the last call
  * 
  * @param {Function} fn - Function to debounce
  * @param {number} delay  - Delay in milliseconds
  * 
  * @returns {Function} Debounce function
  */
export function debounce(fn,delay){
    let timer
    return(...args)=>{
        clearTimeout(timer)
        timer = setTimeout(()=>fn(...args),delay)
    }
}