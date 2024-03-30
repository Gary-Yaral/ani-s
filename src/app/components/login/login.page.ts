import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RestApiService } from 'src/app/services/rest-api.service';
import { StorageData } from 'src/app/utilities/storage';
import { BUSSINESS_NAME } from 'src/constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit{
  appName: string = BUSSINESS_NAME
  errorsDefault: any = {
    username: 'Usuario es requerido',
    password: 'Contraseña es requerida',
    access: 'Error de usuario o contraseña'
  }

  errors: any = {
    username: '',
    password: '',
    access: ''
  }

  login: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  })

  constructor(
    private restApi: RestApiService,
    private router: Router,
  ){}

  ngOnInit(): void {}

  getAuth() {
    if(this.login.invalid) {
      this.validateFields()
    } else {
      this.restApi.postAuth(this.login.value).subscribe((result: any) => {
        if(result.error) {
          this.errors.access = result.error
        }
        if(result.data) {
          let { data } = result
          this.clearErrors()
          this.login.reset()
          StorageData.set({
            roleName: data.roleName,
            token: data.token,
            refreshToken: data.refreshToken
          })
          this.router.navigate(['/dashboard'])
        }
      })
    }
  }

  validateFields() {
    const keys = Object.keys(this.login.value)
    keys.forEach((key: string) => {
      const field = this.login.get(key)
      if(field?.getError('required')){
        this.errors[key] = this.errorsDefault[key]
      }
    })
  }

  detectChange($event: any, name: string) {
    const value = ($event.target as HTMLInputElement).value
    let cleanText = value.replace(/\s/g, '')
    const isEmpty = cleanText === ''
    // Si el campo queda vacio retornamos mensaje de error
    if(isEmpty) {
      this.errors[name] = this.errorsDefault[name]
      return
    }
    // Si ingresa mas de 64 caracteres recortamos el texto a 64
    if(cleanText.length > 64) {
      cleanText = cleanText.substring(0, 64)
      return
    }
    this.login.get(name)?.setValue(cleanText)

    if(cleanText.length < 8) {
      this.errors[name] = 'Este campo requiere mínimo 8 caracteres'
      return
    }

    if(cleanText !='') {
      this.errors[name] = ''
    }
  }

  clearErrors() {
    const keys = Object.keys(this.login.value)
    keys.forEach((key: string) => {
      this.errors[key] = ''
    })
  }

}
