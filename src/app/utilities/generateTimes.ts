export function generateTimes() {
  const max = 23 // Solo hasta las 24 horas
  const times = []
  let hour = 1
  let interval = 0.5
  for(let i = 1; i <= max; i++) {
    times.push({
      id: i,
      label: generateLabel(hour),
      hour
    })
    hour = hour + interval
  }
  return times
}

function generateLabel(hour: number) {
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
