import { FormGroup } from "@angular/forms"

export function validateFields(dataObj: any, errorsObj:any) {
  const props = Object.keys(dataObj)
  for (let i = 0; i < props.length; i++) {
    if ((dataObj[props[i]] === '')) {
      errorsObj[props[i]] = 'Campo es requerido'
    } else {
      errorsObj[props[i]] = ''
    }
  }
}

export function clearErrors(errorsObj:any) {
  const props = Object.keys(errorsObj)
  for (let i = 0; i < props.length; i++) {
      errorsObj[props[i]] = ''
  }
}

export function resetForm(formGroup: FormGroup, errorsObj:any) {
  const props = Object.keys(formGroup.value)
  const errors = Object.keys(errorsObj)
  props.forEach((prop: any) => {
    formGroup.get(prop)?.setValue('')
  })

  errors.forEach((err:any) => {
    errorsObj[err] = ''
  })
}

