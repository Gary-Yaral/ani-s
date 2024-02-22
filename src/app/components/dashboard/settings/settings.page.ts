import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { RestApiService } from 'src/app/services/rest-api.service';
import { Limit, areSameObject, detectChange, dniValidator, emailValidator, passwordValidator, telephoneValidator, textValidator, usernameValidator } from 'src/app/utilities/functions';
import { getData } from 'src/app/utilities/storageOptions';
import { FIND_USER_PATH } from 'src/constants';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit, OnDestroy {
  // Detectar errores mientras se llena el formulario
  constructor(private restApi: RestApiService) { }

  ngOnInit() {
    console.log('init');
    this.loadUserData()

  }

  ngOnDestroy() {
    if(this.subscriptionLoad) {
      this.subscriptionLoad.unsubscribe()
    }
  }
  // Subscripciones
  subscriptionLoad!:Subscription
  // Para validar que las contraseñas fueron camparadas
  passwordCompared: boolean = false
  // Comparador de contraseña
  comparatorPassword!: string
  // Camparador de info orginal
  orignalInfo!: any
  // Para validar si el usuario podrá o no actualizar su contraseña
  updatePassword: boolean = false
  // Mensajes de error de formulario
  showCheckbox:boolean = false
  // Id del usuario cargado
  selectedId!: number
  // Propiedades del formulario
  formGroup: FormGroup = new FormGroup({
    dni: new FormControl('', [Validators.required, dniValidator()]),
    name: new FormControl('', [Validators.required, textValidator()]),
    lastname: new FormControl('', [Validators.required,  textValidator()]),
    telephone: new FormControl('', [Validators.required, telephoneValidator()]),
    email: new FormControl('', [Validators.required, emailValidator()]),
    username: new FormControl('', [Validators.required, usernameValidator()]),
    password: new FormControl('', [Validators.required, passwordValidator()]),
    role: new FormControl(''),
    status: new FormControl('')
  })

  errors: any = {
    dni: '',
    name: '',
    lastname: '',
    telephone: '',
    email: '',
    username: '',
    password: '',
    verifyPassword: ''
  }

  detectChange: Function = ($event: any, name: string, limit: Limit = {exists: false}) => detectChange(this.formGroup, this.errors)($event, name, limit)

  sendData() {
    console.log(this.formGroup.value);
    console.log(areSameObject(this.orignalInfo, this.formGroup.value));

  }

  resetData() {
    this.loadUserData()
  }

  showPassword($event: any) {
    this.updatePassword = $event.detail.checked
  }

  // Detecta cuando se está escribiendo en los campo de texto y verifica los errores
  comparePassword($event: any = null) {
    const value = ($event.target as HTMLInputElement).value
    this.comparatorPassword = value
    const password = this.formGroup.get('password')?.value
    if(value !== password) {
      this.errors['verifyPassword'] = 'Las contraseñas no coinciden'
      this.passwordCompared = false
    } else {
      this.errors['verifyPassword'] = ''
      this.passwordCompared = password !== ''
    }
  }

  loadUserData() {
    try {
      // Leemos el id del usuario logueado desde el localStorage
      const { userId } = getData()
      // Consultamos el usuario
      this.subscriptionLoad = this.restApi.get(FIND_USER_PATH + userId).subscribe((data: any) => {
          if(data.User) {
            this.selectedId = data.User.id
            // Añadimos los campos que faltan
            data.User.password = ''
            data.User.role = ''
            data.User.status = ''
            delete data.User.id
            this.orignalInfo = data.User
            this.formGroup.setValue(data.User)
          }
        })
    } catch(error) {
      console.log(error);

    }
  }
}
