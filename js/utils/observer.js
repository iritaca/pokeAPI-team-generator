/**
 * Creates an observable state container
 * Allows components/functions to share reactive state via subscriptions.
 * 
 * @param {*} initialValue - the starting value for the observable
 * - getValue(): returns the current value
 * - notify(newValue): updates the value and notifies subscribers
 * - subscribe(callback) : adds a subscriber, immediately called with current value.
 *                        Returns an unsubscribe function
 */
function createObservable(initialValue=undefined){
    let value = initialValue
    let subscribers=[]

    const getValue = ()=> value

    /**
     * Stores the value from a given observer
     * @param {*} newValue 
     */
    const notify = newValue =>{
        value = newValue
        subscribers.forEach(cb=>{
            try{
                cb(value)
            }catch (err){
                console.error('Error in subscriber', err)
            }
        })
    }

    /**
     * Grants access to the subscribed value
     */
    const subscribe=cb=>{
        subscribers.push(cb)
        cb(value)
        return ()=>{
            subscribers=subscribers.filter(fn=>fn !==cb)
        }
    }

    return {getValue,notify,subscribe}
}

// Creates the stores
export const team$ = createObservable([])

export const selectedPokemon$ = createObservable(undefined)

export const modalSelectedTab$ = createObservable(undefined)

export const filtersList$ = createObservable([])

export const pokedex$ = createObservable([])