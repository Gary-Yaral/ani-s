import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonCheckbox, IonInput } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { RestApiService } from 'src/app/services/rest-api.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { CHANGES_TYPE } from 'src/app/utilities/constants';
import { Limit, areSameObject, areSamePassword, clearErrors, detectChange, dniValidator, emailValidator, evaluateFieldsExcept, fillErrors, passwordValidator, telephoneValidator, textValidator, usernameValidator, validateFields } from 'src/app/utilities/functions';
import { getData } from 'src/app/utilities/storageOptions';
import { API_PATHS, FIND_USER_PATH } from 'src/constants';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit, OnDestroy {
  // Detectar errores mientras se llena el formulario
  constructor(
    private restApi: RestApiService,
    private Swal: SweetAlertService
    ) { }

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
  subscriptionPut!:Subscription
  // Para validar que las contraseñas fueron camparadas
  passwordCompared: boolean = false
  // Comparador de contraseña
  comparatorPassword!: string
  // Copia de la info original al cargar por primera vez
  orignalInfo!: any
  // Para validar si el usuario podrá o no actualizar su contraseña
  updatePassword: boolean = false
  // Id del usuario cargado
  selectedId!: number
  // Id del rol que se actualizará
  userRoleId!: number
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

  @ViewChild('verifyPassword') verifyPassword!: IonInput
  @ViewChild('checkbox') checkbox!: IonCheckbox

  // Propiedades de botonoes de alerta
  public alertButtons = [
    {
      text: 'No',
      cssClass: 'alert-button-cancel',
    },
    {
      text: 'Si',
      cssClass: 'alert-button-confirm',
      handler: () => { this.sendData()}
    },
  ];

  detectChange: Function = ($event: any, name: string, limit: Limit = {exists: false}) => detectChange(this.formGroup, this.errors)($event, name, limit)

  sendData() {
    let optionals = ['password', 'role', 'status']
    let validationErrors = evaluateFieldsExcept(this.formGroup, optionals)
    console.log(this.formGroup.value);
    console.log(areSameObject(this.orignalInfo, this.formGroup.value));
    if(areSameObject(this.orignalInfo, this.formGroup.value)) {
      this.Swal.fire({
        title: 'Ok',
        text: 'Usuario actualizado correctamente',
        icon: 'success'
      })
    }
    if(validationErrors) {

    }
  }

  updateRegister() {
    let optionals = ['password', 'role', 'status']
    let isValid = validateFields(this.formGroup, this.errors, ['password'])
    if(this.updatePassword){
      isValid= validateFields(this.formGroup, this.errors)
      const password = this.formGroup.get('password')?.value
      const comparator = areSamePassword(password, this.comparatorPassword)
      if(!isValid.valid && !comparator.equals) {
        this.errors.verifyPassword = comparator.message
        return
      }
    }

    if(isValid.valid) {
      this.subscriptionPut = this.restApi.put(API_PATHS.users + this.selectedId +'/'+ this.userRoleId, this.formGroup.value).subscribe((response: any) => {
        if(response.error) {
          this.errors['result'] = response.error
        }

        if(response.result) {
          this.Swal.fire({
            icon: 'success',
            title: 'Ok',
            text: response.message
          }).then((value: any) => {
            // Reseteamos el formGroup
            this.formGroup.reset()
          })
          this.resetData()
          // Notificamos que hubo cambios para que se refresquen los datos en el menu
          this.restApi.setChanges()
        }
      })
    } else {
      this.errors.result = 'Complete correctamente todos los campos requeridos'
    }
  }

  resetData() {
    this.formGroup.reset()
    this.loadUserData()
    clearErrors(this.errors)
    this.comparatorPassword = ''
    this.verifyPassword.value = ''
    this.updatePassword = false
    this.checkbox.checked = false
  }

  showPassword($event: any) {
    this.updatePassword = $event.detail.checked
  }

  // Detecta cuando se está verificando la segunda contraseña
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
            // Guardamos una copia para verificar si se trata de la misma información
            this.orignalInfo = data.User
            this.formGroup.setValue(data.User)
          }
        })
    } catch(error) {
      console.log(error);
    }
  }
}
