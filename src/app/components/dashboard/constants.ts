export const routesPath: any = {
  home: { title: 'Inicio', url: '/dashboard/home', icon: 'home' },
  users:{ title: 'Usuarios', url: '/dashboard/users', icon: 'person' },
  items: { title: 'Items', url: '/dashboard/items', icon: 'list'},
  categories: { title: 'Categorías', url: '/dashboard/categories', icon: 'checkbox'},
  subcategories: { title: 'Subcategorias', url: '/dashboard/subcategories', icon: 'checkmark-done-circle'},
  packages: { title: 'Paquetes', url: '/dashboard/packages', icon: 'cube' },
  payments: { title: 'Pagos', url: '/dashboard/payments', icon: 'card' },
  rooms: { title: 'Locales', url: '/dashboard/rooms', icon: 'business' },
  reservations: { title: 'Reservaciones', url: '/dashboard/reservations', icon: 'qr-code' },
  settings: { title: 'Configuración', url: '/dashboard/settings', icon: 'options' }
}

export const appPages = Object.keys(routesPath).map((key)=> routesPath[key])
