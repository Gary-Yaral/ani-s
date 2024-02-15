import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';

export function dniValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;

    if (!value) {
      return null; // No se aplica la validación si el valor es nulo
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

    for (let i = 0; i < 9; i++) {
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

export function textValidator(limit = false, length = 40): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const textRegex = /^[a-zA-Z0-9áéíóúñÁÉÍÓÚ\,\_\-]+( [a-zA-Z0-9áéíóúñÁÉÍÓÚ\,\_\-]+)*$/;
    // Si se restringe el número de caracteres
    if(limit && control.value) {
      if(control.value.length > length) {
        return { 'length': true };
      }
    }

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
    ;

    if (!emailRegex.test(control.value)) {
      return { 'email': true };
    }

    return null;
  };
}

export function telephoneValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const telephoneRegex = /^0[1-9]\d{8}$/
    ;

    if (!telephoneRegex.test(control.value)) {
      return { 'email': true };
    }

    return null;
  };
}

// Detecta cuando se está escribiendo en los campo de texto y verifica los errores
export function detectChange(formGroup: FormGroup, errors: any) {
  return ($event: any, name: string) => {
    const currentErrors = formGroup.get(name)?.errors
    console.log($event);

    if(currentErrors) {
      // Valida los campos de texto
      if(currentErrors['text']) {
          errors[name] = 'No se permiten espacios al pricipio ni al final, tampoco espacios dobles máximo 40 caracteres'
      }

      // Valida que se ingrese una cédula valida
      if(currentErrors['cedula']) {
        errors[name] = 'Ingrese una cédula valida'
      }

      // Valida que se ingresen números enteros y decimales mayores a 0
      if(currentErrors['number']) {
        errors[name] = 'Solo se permiten números positivos enteros o decimales'
      }

      // Valida que se escriban nombres de usuarios y conatraseña fuertes y válidas
      if(currentErrors['username'] || currentErrors['password']) {
        if(currentErrors['pattern']) {
          errors[name] = 'Campo debe tener al menos 8 caracteres, al menos una minuscula, una mayuscula, un número y un caracter especial'
        }
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
      errors[name] = ''
    }
  }
}

