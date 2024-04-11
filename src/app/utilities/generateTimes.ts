export function generateTimes() {
  const max = 24.5 // Solo hasta las 24 horas
  const times = []
  let hour = 1
  let i = 0
  let interval = 0.5
  while(hour < max) {
    times.push({
      id: i,
      label: generateLabel(hour),
      hour
    })
    i++
    hour = hour + interval
  }
  return times
}

export function generateLabel(hour: number) {
  if(hour.toString().includes('.')){
    let h = hour.toString().split('.')
    let minutes = (hour - parseInt(h[0])) * 60
    if(hour >= 2) {
      return `${h[0]} horas, ${minutes} minutos`
    } else {
      return `${h[0]} hora, ${minutes} minutos`
    }
  } else {
    if(hour > 1) {
      return `${hour} horas`
    } else {
      return `${hour} hora`
    }
  }
}

export function generateHourLabel(hour: number) {
  let h = '00'
  let m = '00'
  let r = hour
  if(hour.toString().includes('.')){
    let p = hour.toString().split('.')
    m = ((hour - parseInt(p[0])) * 60).toString()
    r = parseInt(p[0])
  }
  if(r < 10) { h = '0'+r } else {
    h = r.toString()
  }

  return h+':'+m+':00'
}

export function generateHours(initial: number, final: number) {
  const max = 23 // Solo hasta las 24 horas
  const times = []
  let hour = initial
  let interval = 0.5
  let i = 0
  while(hour < final) {
    times.push({
      id: i,
      hour: generateHourLabel(hour),
    })
    hour = hour + interval
    i++
  }
  return times
}

export function tranformTimeToHour(hour: string) {
  let time = hour.split(':')
  let h = parseInt(time[0])
  let m = parseInt(time[1])
  h = h + (m / 60)
  return h
}

export function formatTime(time: string, h: string = 'none', m: string = 'none', s: string = 'none' ) {
  let parts = time.split(':')
  let all: any = {
    h: parts[0],
    m: parts[1],
    s: parts[2]
  }
  let selectedParts = []
  if(all[h]) {
    selectedParts.push(all[h])
  }
  if(all[m]) {
    selectedParts.push(all[m])
  }
  if(all[s]) {
    selectedParts.push(all[s])
  }
  if(selectedParts.length === 0) {
    return time
  }
  return selectedParts.join(':')
}
