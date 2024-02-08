import { SESSION_PROPS, STORAGE_KEY } from "src/constants"
import { storageData } from "../interfaces"

export function loadStorage() {
  const readData = localStorage.getItem(STORAGE_KEY)
  if(readData) {
    let data: any = JSON.parse(readData)
    for (let propiedad of SESSION_PROPS) {
      if (!data.hasOwnProperty(propiedad)) {
        return {
          error: 'Faltan propiedades'
        }
      }
    }
    return { data }
  }

  return {
    error: 'No existe esa clave'
  }
}

export function clearStorage() {
  localStorage.removeItem(STORAGE_KEY)
}

export function createStorage(data: storageData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function getData() {
  const loaded = loadStorage()
  if(loaded.error) {
    return loaded
  }
  return loaded.data
}

export function refreshToken(token: string) {
  if(!getData().error) {
    const data = {...getData()}
    data.token = token
    createStorage(data)
  }
}


