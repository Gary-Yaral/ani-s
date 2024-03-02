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
  "drink-types": 'Tipos de bebidas',
  "food-types": 'Tipos de comida',
}

export const SESSION_PROPS = ['id', 'userId', 'roleId', 'token']

export const  STORAGE_KEY = 'anis-reservation'

export const API_SERVER = 'http://localhost:4000/api'

export const API_PATHS = {
  auth: API_SERVER + '/admin/auth',
  users: API_SERVER + '/users/',
  roles: API_SERVER + '/roles/',
  role: API_SERVER + '/role/',
  chairs: API_SERVER + '/chairs/',
  drinkTypes: API_SERVER + '/drink-types/',
  dishTypes: API_SERVER + '/dish-types/',
  decorations: API_SERVER + '/decorations/',
  status: API_SERVER + '/status/',
  menus: API_SERVER + '/menus/',
  tables: API_SERVER + '/tables/',
  images: API_SERVER + '/images/',
  refreshToken: API_SERVER + '/token/refresh'
}

export const FIND_USER_PATH = API_PATHS.roles + 'find-one/'
