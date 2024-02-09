import { ElementRef } from "@angular/core"
import { FormGroup } from "@angular/forms"

export function validateFields(dataObj: any, errorsObj:any) {
  const props = Object.keys(dataObj)
  for (let i = 0; i < props.length; i++) {
    if ((dataObj[props[i]] === '' || !dataObj[props[i]])) {
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

export function validateOnlyTextFields(input: FormGroup, images: string[], errorObj: any) {
  const keys = Object.keys(input.value)
  let isValid = true
  for(let key of keys) {
    if(!images.includes(key)){
      if(input.value[key] === '') {
        errorObj[key] = 'Campo es requerido'
        isValid = false
      }
    }
  }

  return isValid
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

export function getFormData(ref: ElementRef) {
  const input = ref.nativeElement as HTMLFormElement;
  return new FormData(input)
}

