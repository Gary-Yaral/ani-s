import { titles } from "src/app/interfaces"

export const  BUSSINESS_NAME = `Ani's`

export const WINDOW_TITLES: titles = {
  home: 'Inicio',
  users: 'Usuarios',
  drinks: 'Bebidas',
  menus: 'Menus',
  tables: 'Mesas',
  chairs: 'Sillas',
  decorations: 'Decoraciones',
  reservations: 'Reservaciones',
  packages: 'Paquetes',
  payments: 'Pagos',
  rooms: 'Locales',
  "drink-types": 'Tipos de bebidas',
  "food-types": 'Tipos de comida',
}

export const SESSION_PROPS = ['refreshToken', 'roleName', 'token']

export const  STORAGE_KEY = 'anis-reservation'

export const API_SERVER = 'http://localhost:4000/api'

export const API_PATHS: any = {
  auth: API_SERVER + '/admin/auth',
  users: API_SERVER + '/users/',
  roles: API_SERVER + '/roles/',
  role: API_SERVER + '/role/',
  status: API_SERVER + '/status/',
  rooms: API_SERVER + '/rooms/',
  packages: API_SERVER + '/packages/',
  images: API_SERVER + '/images/',
  items: API_SERVER + '/items/',
  categories: API_SERVER + '/categories/',
  subcategories: API_SERVER + '/subcategories/',
  refreshToken: API_SERVER + '/token/refresh'
}

export const FIND_USER_PATH = API_PATHS.roles + 'find-one/'
