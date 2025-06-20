import { db } from "../data/db";
import { CartItem, Guitar } from "../types/types";

export type CartActions =
    {type: 'add-to-cart', payload: {item:Guitar}} |
    {type: 'remove-from-cart', payload: {id:Guitar['id']}} |
    {type: 'increase-quantity', payload: {id:Guitar['id']}} |
    {type: 'decrease-quantity', payload: {id:Guitar['id']}} |
    {type: 'clear-cart'}

export type CartState ={
    data:Guitar[],
    cart:CartItem[]
}

/* A TypeScript se el dificulta saber el tipo de dato cuando se utilizan localstorage o se obtienen datos de fuentes similares
para esto le agregamos nuestro type de (Guitar) pero le agregamos ([]) para que lo convierta en arreglo */
    const initialCart = ():CartItem[] => {
        const localStorageCart = localStorage.getItem('cart');
        return localStorageCart ? JSON.parse(localStorageCart) : []
    }

export const initialState:CartState = {
    data: db,
    cart: initialCart()
}

    const MAX_ITEMS = 5;
    const MIN_ITEMS = 1;

export const cartReducer = (state:CartState = initialState, action:CartActions) => {
    if(action.type === 'add-to-cart') {
        const itemExists = state.cart.find(guitar => guitar.id === action.payload.item.id) /* Comprobamos si ya existe */
        
        let updatedCart:CartItem[] = []
        if (itemExists) { /* Existe en el carrito */
            updatedCart = state.cart.map(item => {
                if(item.id === action.payload.item.id) {
                    if(item.quantity < MAX_ITEMS) {
                        return {...item, quantity: item.quantity + 1} /* Le subimos la cantidad */
                    } else {
                        return item /* Si llego al limite retornamos el actual */
                    }
                } else {
                    return item /* Retornamos los que ya estan */
                }
            })
        } else { /* No existe */
            /* Si no existe, entonces tenemos que setearlo al item de CartItem, que si contiene el quantity, tomamos una copia y le agregamos el quantity */
            const newItem : CartItem = {...action.payload.item, quantity : 1};
            /* item.quantity = 1 */
            updatedCart = [...state.cart, newItem]
        }

        return {
            ...state,
            cart: updatedCart
        }
    }

    if(action.type === 'remove-from-cart') {
        const updatedCart = state.cart.filter(item => item.id !== action.payload.id)
        return {
            ...state,
            cart: updatedCart
        }
    }

    if(action.type === 'increase-quantity') {
        const updatedCart = state.cart.map(item => {
            if (item.id === action.payload.id && item.quantity < MAX_ITEMS) {
                return {
                    ...item,
                    quantity: item.quantity + 1
                }
            }
            return item /* Retornamos los demas objetos que no son del mismo id para no modificarlos */
        })
        return {
            ...state,
            cart: updatedCart
        }
    }

    if(action.type === 'decrease-quantity') {
        const updatedCart = state.cart.map(item => {
            if (item.id === action.payload.id && item.quantity > MIN_ITEMS) {
                return {
                    ...item,
                    quantity: item.quantity - 1
                }
            }
            return item /* Retornamos los demas items que no vamos a modificar */
        })
        return {
            ...state,
            cart: updatedCart
        }
    }

    if(action.type === 'clear-cart') {
        return {
            ...state,
            cart: [ ]
        }
    }

    return state
}