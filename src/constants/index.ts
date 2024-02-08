import { titles } from "src/app/interfaces"

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
  settings: 'Configuración',
}

export const API_SERVER = 'http://localhost:4000/api'

export const API_PATHS = {
  auth: API_SERVER + '/admin/auth',
  users: API_SERVER + '/users/',
  chairs: API_SERVER + '/chairs/',
  menus: API_SERVER + '/menus/',
  tables: API_SERVER + '/tables/',
  images: API_SERVER + '/images/'
}
