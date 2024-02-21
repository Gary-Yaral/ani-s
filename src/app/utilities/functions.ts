import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';

const TYPES = {
  cedula: 'Ingrese una cédula valida',
  telephone: 'Ingrese un número de telefono válido',
  required: 'Campo es requerido',
  email: 'Ingrese un email valido',
  username: 'Campo debe tener al menos 8 caracteres, al menos una minuscula, una mayuscula, un número y un caracter especial. No se admiten espacios en blanco',
  password: 'Campo debe tener al menos 8 caracteres, al menos una minuscula, una mayuscula, un número y un caracter especial. No se admiten espacios en blanco',
  number: 'Solo se permiten números positivos enteros o decimales',
  text: 'No se permiten espacios al pricipio ni al final, tampoco espacios dobles máximo 40 caracteres'
}

export function dniValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;
    // No se aplica la validación si el valor es nulo
    if (!value) {
      return null;
    }

    // Verificar la longitud del valor
    if (value.length !== 10) {
      return { 'cedula': true }; // Longitud incorrecta
    }

    // Verificar si es un número válido
    if (!(/^\d+$/.test(value))) {
      return { 'cedula': true }; // No es un número válido
    }

    // Verificar el primer dígito
    const provinciaCode = parseInt(value.substr(0, 2), 10);
    if (provinciaCode < 1 || provinciaCode > 24) {
      return { 'cedula': true }; // Código de provincia inválido
    }

    // Algoritmo de validación para el último dígito
    const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
    const verificador = parseInt(value.charAt(9), 10);
    let suma = 0;

    for (let i = 0; i < coeficientes.length; i++) {
      let valor = parseInt(value.charAt(i), 10) * coeficientes[i];
      if (valor >= 10) {
        valor -= 9;
      }
      suma += valor;
    }

    if ((suma % 10 !== 0) && ((suma + verificador) % 10 !== 0)) {
      return { 'cedula': true }; // Dígito verificador inválido
    }

    return null; // El número de cédula es válido
  };
}

export function textValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const textRegex = /^[a-zA-Z0-9áéíóúñÁÉÍÓÚ\,\_\-]+( [a-zA-Z0-9áéíóúñÁÉÍÓÚ\,\_\-]+)*$/;
    // Si no cumple con los parametros
    if (!textRegex.test(control.value)) {
      return { 'text': true };
    }
    return null;
  };
}

export function numberValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const numberRegex = /^(0|[1-9]\d*)(\.\d+)?$/;

    if (!numberRegex.test(control.value)) {
      return { 'number': true };
    }

    return null;
  };
}

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=\-{}[\]:;\"'<>?,./])\S{8,}$/;

    if (!passwordRegex.test(control.value)) {
      return { 'password': true };
    }

    return null;
  };
}

export function usernameValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const usernameRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=\-{}[\]:;\"'<>?,./])\S{8,}$/;

    if (!usernameRegex.test(control.value)) {
      return { 'username': true };
    }

    return null;
  };
}

export function emailValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(control.value)) {
      return { 'email': true };
    }
    return null;
  };
}

export function telephoneValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const telephoneRegex = /^0[1-9]\d{8}$/
    if (!telephoneRegex.test(control.value)) {
      return { 'telephone': true };
    }
    return null;
  };
}

// limit: {exists: boolean, max: number, min: number}
export interface Limit {
  exists: boolean,
  max?: number,
  min?: number
}

// Detecta cuando se está escribiendo en los campo de texto y verifica los errores
export function detectChange(formGroup: FormGroup, errors: any) {
  return ($event: any, name: string, limit: Limit = {exists: false}) => {
    const value = $event.target.value
    // Evaluamso si se definió limite de maximo y minimo, recortamos en caso de superar el maximo
    if(limit.exists === true) {
      if(limit.max) {
        formGroup.get(name)?.setValue(value.substring(0, limit.max))
      }
    }
    // Obtenemos los errores generados y los evaluamos
    const currentErrors = formGroup.get(name)?.errors
    if(currentErrors) {
      // Valida los campos de texto
      if(currentErrors['text']) {
          errors[name] = TYPES.text
      }

      // Valida que se ingrese una cédula valida
      if(currentErrors['cedula']) {
        errors[name] = TYPES.cedula
      }

      // Valida que se ingresen números enteros y decimales mayores a 0
      if(currentErrors['number']) {
        errors[name] = TYPES.number
      }

      // Valida que se ingresen números enteros y decimales mayores a 0
      if(currentErrors['telephone']) {
        errors[name] = TYPES.telephone
      }

      // Valida que se escriban nombres de usuarios válidas
      if(currentErrors['username']) {
          errors[name] = TYPES.username
      }
      // Valida que se escriban conatraseña fuertes y válidas
      if(currentErrors['password']) {
          errors[name] = TYPES.password
      }

      // Validamos si hay error de email
      if(currentErrors['email']) {
        errors[name] = 'Ingrese un email valido'
      }

      // Si ha dejado el campo en blanco
      if(currentErrors['required']) {
        errors[name] = 'Campo es requerido'
      }

    } else {
      if(limit.min) {
        if(formGroup.get(name)?.value.length < limit.min){
          errors[name] = `Se require mínimo ${limit.min} caracteres.`
        } else {
          errors[name] = ''
        }
      } else {
        errors[name] = ''
      }
    }
  }
}

// Detecta cuando se está escribiendo en los campo de texto y verifica los errores
function showErrors(type: string) {
    // Valida los campos de texto
    let error = ''
    if(type === 'text') {
        error = TYPES.text
    }

    // Valida que se ingrese una cédula valida
    if(type === 'cedula') {
      error = TYPES.cedula
    }

    // Valida que se ingresen números enteros y decimales mayores a 0
    if(type === 'number') {
      error = TYPES.number
    }

    // Valida que se ingresen números enteros y decimales mayores a 0
    if(type === 'telephone') {
      error = TYPES.telephone
    }

    // Valida que se escriban nombres de usuarios válidas
    if(type === 'username') {
      error = TYPES.username
    }
    // Valida que se escriban conatraseña fuertes y válidas
    if(type === 'password') {
        error = TYPES.password
    }


    // Validamos si hay error de email
    if(type === 'email') {
      error = TYPES.email
    }

    // Si ha dejado el campo en blanco
    if(type === 'required') {
      error = TYPES.required
    }
    return error
}

export function evaluateFieldsExcept(formGroup: FormGroup, excludeFields: string[] = []) {
  const errors: object[] = []
  Object.keys(formGroup.controls).forEach( name => {
    if(!excludeFields.includes(name)) {
      const control = formGroup.get(name);
      if (control?.errors != null) {
        let keys = Object.keys(control.errors)
        if(keys.length > 0) {
          const data = {
            errorType: keys,
            field: name,
            message: showErrors(keys[0])
          }
          errors.push(data)
        }
      }
    }
  });
  return errors
}

export function fillErrors(errorsObject: any, errorsArray:any[]) {
  errorsArray.forEach(error => {
    errorsObject[error.field] = error.message
  })
}
