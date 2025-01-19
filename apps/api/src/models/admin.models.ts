export interface Store {
    store_name: string
    address: string
    latitude: number
    longitude: number
}

export interface User {
    name: string
    id: number
    role: string
}

export interface StoreAdmin {
    store_id: number
    user_id: number
}