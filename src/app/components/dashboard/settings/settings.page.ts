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
    this.loadUserData()
  }

  ngOnDestroy() {
    if(this.subscriptionLoad) {
      this.subscriptionLoad.unsubscribe()
    }
    if(this.subscriptionPut) {
      this.subscriptionPut.unsubscribe()
    }
  }

  // Subscripciones
  subscriptionLoad!:Subscription
  subscriptionPut!:Subscription
  // Para validar que las contraseñas fueron camparadas
  passwordsAreEquals: boolean = false
  // Id del usuario cargado
  selectedId!: number
  // Id del rol que se actualizará
  userRoleId!: number
  differentPasswordsError = 'Las contraseñas no coinciden'
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
    status: new FormControl(''),
    checkbox: new FormControl(false, Validators.required),
    verifyPassword: new FormControl(false, Validators.required)
  })

  errors: any = {
    dni: '',
    name: '',
    lastname: '',
    telephone: '',
    email: '',
    username: '',
    password: '',
    verifyPassword: '',
    result: ''
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

  detectChange: Function = ($event: any, name: string, limit: Limit = {}) => detectChange(this.formGroup, this.errors)($event, name, limit)

  sendData() {
    // Verificamos si habilitó el cuadro para cambiar contraseña
    let isChecked = this.formGroup.get('checkbox')?.value
    let isValid = validateFields(this.formGroup, this.errors)
    let dataToSend = this.formGroup.value
    if(!isChecked){
      delete dataToSend.password
      isValid = validateFields(this.formGroup, this.errors, ['password', 'verifyPassword'])
    } else {
      isValid.valid = isValid.valid && this.passwordsAreEquals
      if(!isValid.valid) {
        this.errors.verifyPassword = this.differentPasswordsError
      }
    }

    // Si es valido y no hay errores entonces actualizamos
    if(isValid.valid) {
      this.subscriptionPut = this.restApi.put(API_PATHS.users + this.selectedId +'/'+ this.userRoleId, dataToSend).subscribe((response: any) => {
        if(response.result) {
          this.Swal.fire({
            icon: 'success',
            title: 'Ok',
            text: response.message
          })
          // Resetamos la ventanas y volverá a cargar todos los nuevos datos
          this.resetData()
          // Notificamos que hubo cambios para que se refresquen los datos en el menu
          this.restApi.setChanges()
        } else {
          this.Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.message
          })
        }
      }, (errorData) => {
        if(errorData.status === 400) {
          if(errorData.error) {
            let { errorKeys, errors } = errorData.error
            errorKeys.forEach((key: any) => {
              this.errors[key] = errors[key][0].msg
            });
          }
          console.log(errorData.error)
        }
        if(errorData.status === 500) {
          this.errors.result = 'Error al actualizar el usuario'
          console.log(errorData.error)
        }
      })
    }
  }

  resetData() {
    this.formGroup.reset()
    this.passwordsAreEquals = false
    this.loadUserData()
    clearErrors(this.errors)
  }

  showPassword($event: any) {
    if(!$event.detail.checked) {
      this.formGroup.get('password')?.reset()
      this.formGroup.get('verifyPassword')?.reset()
      this.errors.password = ''
      this.errors.verifyPassword = ''
    }
  }

  // Detecta cuando se está verificando la segunda contraseña
  comparePassword($event: any = null) {
    const { password, verifyPassword } = this.formGroup.value
    this.passwordsAreEquals = password === verifyPassword

    if(!this.passwordsAreEquals) {
      this.errors.verifyPassword = this.differentPasswordsError
    } else {
      this.passwordsAreEquals = password !== '' && verifyPassword !== ''
      this.errors.verifyPassword = ''
    }
  }

  loadUserData() {
    try {
      // Leemos el id del usuario logueado desde el localStorage
      const { userId } = getData()
      // Consultamos el usuario
      this.subscriptionLoad = this.restApi.get(FIND_USER_PATH + userId).subscribe((data: any) => {
        if(data.User && data.Role && data.UserStatus) {
          const { User, Role, UserStatus } = data
            this.selectedId = User.id
            this.userRoleId = data.id
            // Añadimos los campos que faltan
            User.password = ''
            User.role = Role.id
            User.status = UserStatus.id
            User.verifyPassword = ''
            User.checkbox = false
            delete data.User.id
            this.formGroup.setValue(User)
          }
        })
    } catch(error) {
      console.log(error);
    }
  }

  resetField(name: string){
    this.formGroup.get(name)?.reset()
    this.errors[name] = ''
  }
}
