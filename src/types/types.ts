export type Guitar = { /* Definimos los Types o interfaces al usar TS */
    id: number,
    name: string,
    image: string,
    description: string,
    price: number
}

/* Creamos nuevo type exclusivo para item de cart, ya que tendra la propiedrad de quantity, heredamos de guitar y 
añadimos la nueva propiedad */
/* export interface CartItem extends Guitar {}  // Si usaramos (interface) */
export type CartItem = Guitar & {
    quantity: number
}


