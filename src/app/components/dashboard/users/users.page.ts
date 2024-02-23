import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonCheckbox, IonInput, IonModal } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { ReloadService } from 'src/app/services/reload.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { CHANGES_TYPE, FORM_ACTIONS } from 'src/app/utilities/constants';
import { Limit, areSamePassword, clearErrors, detectChange, dniValidator, emailValidator, evaluateFieldsExcept, fillErrors, passwordValidator, telephoneValidator, textValidator, usernameValidator, validateFields } from 'src/app/utilities/functions';
import { API_PATHS } from 'src/constants';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit, OnDestroy {
  constructor(
    private restApi: RestApiService,
    private reloadService: ReloadService,
    private Swal: SweetAlertService,
    private alert: AlertService
  ) {}

  // Formulario HTML
  @ViewChild('formToSend') formRef!: ElementRef;
  isChecked: boolean = false
  verifyPassword: string = ''
  @ViewChild(IonModal) modal!: IonModal;
  // Path para cargar los datos de la tabla
  pathLoad: string = API_PATHS.roles
  // Cabeceras de la tabla
  theads: string[] = [
    'N°',
    'Cédula',
    'Nombre',
    'Apellidos',
    'Teléfono',
    'Email',
    'Usuario',
    'Rol',
    'Estado',
    'Opciones'
  ]
  // Campos o propiedades que se extraeran de cada objeto, lo botones se generan por defecto
  fields: string[] = [
    'index',
    'User.dni',
    'User.name',
    'User.lastname',
    'User.telephone',
    'User.email',
    'User.username',
    'Role.role',
    'UserStatus.name'
  ]

  // Roles que tendrán los usuarios
  roles: any = []
  // Estados que tendrá el usuario
  statuses: any = []
  // Nombre de endopoint para filtrar en la tabla, será concatenado con path principal
  pathFilter: string = 'filter'
  // Titulo de la sección
  sectionTitle: string = 'Usuario'
  // Action que hará el formulario
  formAction: string = 'Nuevo'
  // Id seleccionado para editar
  selectedId!: number
  // Id del rol que se actualizará
  userRoleId!: number
  // Comparador de contraseña
  comparatorPassword: string = ''
  // Para validar si el usuario podrá o no actualizar su contraseña
  updatePassword: boolean = false
  // Mensajes de error de formulario
  showCheckbox:boolean = false
  // Subscripciones
  subscriptionPost!: Subscription
  subscriptionGet!: Subscription
  subscriptionPut!: Subscription
  subscriptionDelete!: Subscription
  // Errores que se mostrarán en los campos del formulario
  errors: any = {
    dni: '',
    name: '',
    lastname: '',
    telephone: '',
    email: '',
    role: '',
    username:'',
    password:'',
    result: '',
    verifyPassword:''
  }
  // Propiedades del formulario
  formGroup: FormGroup = new FormGroup({
    dni: new FormControl('', [Validators.required, dniValidator()]),
    name: new FormControl('', [Validators.required, textValidator()]),
    lastname: new FormControl('', [Validators.required,  textValidator()]),
    telephone: new FormControl('', [Validators.required, telephoneValidator()]),
    email: new FormControl('', [Validators.required, emailValidator()]),
    role: new FormControl('', Validators.required),
    username: new FormControl('', [Validators.required, usernameValidator()]),
    password: new FormControl('', [Validators.required, passwordValidator()]),
    status: new FormControl('', Validators.required),
  })

  // Detectar errores mientras se llena el formulario
  detectChange: Function = ($event: any, name: string, limit: Limit = {exists: false}) => detectChange(this.formGroup, this.errors)($event, name, limit)

  ngOnInit(): void {
    this.loadStatusses()
    this.loadRoles()
  }

  ngOnDestroy(): void {
    if(this.subscriptionGet) {
      this.subscriptionGet.unsubscribe()
    }
    if(this.subscriptionPost) {
      this.subscriptionPost.unsubscribe()
    }
    if(this.subscriptionPut) {
      this.subscriptionPut.unsubscribe()
    }
    if(this.subscriptionGet) {
      this.subscriptionGet.unsubscribe()
    }
  }

  // Cargamos los estados que serpan listado en el formulario
  loadStatusses() {
    this.subscriptionGet = this.restApi.get(API_PATHS.status).subscribe((response: any) => {
      if(response.error){
        console.error(response.error);
      }

      if(response.data) {
        this.statuses = response.data
        this.formGroup.get('status')?.setValue(this.statuses[0].id)
      }
    })
  }
  // Cargamos los roles que serán listados en el formulario
  loadRoles() {
    this.subscriptionGet = this.restApi.get(API_PATHS.role).subscribe((response: any) => {
      if(response.error){
        console.error(response.error);
      }

      if(response.data) {
        this.roles = response.data
        this.formGroup.get('role')?.setValue(this.roles[0].id)
      }
    })
  }

  // Propiedades de botonoes de alerta
  public alertButtons = [
    {
      text: 'No',
      cssClass: 'alert-button-cancel',
    },
    {
      text: 'Si',
      cssClass: 'alert-button-confirm',
      handler: () => {}
    },
  ];

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  onWillDismiss(event: any) {
    const modal = event.target
    this.formGroup.reset()
  }

  saveRegister() {
    if(this.formGroup.invalid){
      let validationErrors = evaluateFieldsExcept(this.formGroup)
      // Rellenamos los campos de errores
      fillErrors(this.errors, validationErrors)
      this.errors.result = 'Complete todos los campos requeridos'
      // Limpiamos el error general
      this.errors.result = ''
    }
    if(this.formGroup.valid) {
      if(this.formGroup.get('password')?.value !== this.comparatorPassword) {
        this.errors['verifyPassword'] = 'Las contraseñas no coinciden'
        this.errors.result = ''
        return
      }

      this.subscriptionPost = this.restApi.post(API_PATHS.users, this.formGroup.value).subscribe((response: any) => {
        if(response.error) {
          this.errors['result'] = response.error
        }

        if(response.result){
          clearErrors(this.errors)
          this.Swal.fire({
            icon: 'success',
            title: 'Ok',
            text: response.message
          }).then((value: any) => {
            // Reseteamos el formGroup
            this.formGroup.reset()
            this.cancel()
          })
          // Notificamos que hubo cambios para que se refresque la tabla
          this.reloadService.addChanges({changes: true, type: CHANGES_TYPE.ADD})
          // Limpiamos los errores de los campos
          clearErrors(this.errors)
        }
      })
    }

  }

  updateRegister() {
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
          this.Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.message
          })
          console.log(response.error)
        }
        if(response.result) {
          this.Swal.fire({
            icon: 'success',
            title: 'Ok',
            text: response.message
          }).then((value: any) => {
            // Reseteamos el formGroup
            this.formGroup.reset()
            this.cancel()
          })

          // Notificamos que hubo cambios para que se refresque la tabla
          this.reloadService.addChanges({changes: true, type: CHANGES_TYPE.UPDATE})
          // Limpiamos los errores de los campos
          clearErrors(this.errors)
        } else {
          this.Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.message
          })
        }
      })
    } else {
      this.errors.result = 'Complete correctamente todos los campos requeridos'
    }
  }

  showToAdd() {
    // Asignamos el manejador del evento
    this.alertButtons[1].handler = () => this.saveRegister()
    // Reseteamos el formulario
    this.formGroup.reset()
    // Limpiamos los errores
    clearErrors(this.errors)
    // Definimos la acción del formulario
    this.formAction = FORM_ACTIONS.ADD
    // Mostramos el formulario
    this.modal.present()
    // Oculto el checkbox
    this.showCheckbox = false
    // Cargamos datos por defecto una vez se renderice el formulario
    this.formGroup.get('role')?.setValue(this.roles[0].id)
    this.formGroup.get('status')?.setValue(this.statuses[0].id)
  }

  showUpdate(data: any) {
    // Limpiamos el formulario
    this.formGroup.reset()
    // Definimos el id que fue seleccionado
    this.selectedId = data['User.id']
    // Definimos el id del rol de usuario modificaremos
    this.userRoleId = data['id']
    // Creamos un objeto con el valor del formulario
    const value = {
      dni: data['User.dni'],
      name: data['User.name'],
      lastname: data['User.lastname'],
      telephone: data['User.telephone'],
      email: data['User.email'],
      role: data['Role.id'],
      username: data['User.username'],
      status: data['statusId'],
      password: ''
    }
    // Actualizamos el método que ejecutará el boton de aceptar
    this.alertButtons[1].handler = () => this.updateRegister()
    // Definimos la acción que realizará el formulario
    this.formAction = FORM_ACTIONS.UPDATE
    // Habilito el checkbox
    this.showCheckbox = true
    // Mostramos el formulario
    this.modal.present()
    // Rellenamos el formulario con los datos del registro que actualizaremos
    this.formGroup.setValue(value)
    // Validamos por si hay un dato erroneo guardado previamente
    validateFields(this.formGroup, this.errors, ['password'])
    // Pongo la propiedade checked en false
    this.isChecked = false
    // Oculto el bloque de la contraseña
    this.updatePassword = false
  }

  async showDelete(data: any) {
    this.selectedId = data['User.id']
    // Creamos la modal que mostraremos
    await this.alert.getDeleteAlert(() =>{
      this.deleteRegister()
    })
  }

  deleteRegister() {
    this.subscriptionDelete = this.restApi.delete(API_PATHS.users+ this.selectedId).subscribe((response:any) => {
      if(response.error) {
        this.Swal.fire({
          title: 'Error',
          icon: 'error',
          text: response.error
        })
      }
      if(response.result) {
        this.Swal.fire({
          title: 'Ok',
          icon: 'success',
          text: response.message
        })
        // Hacemos que la tabla se refresque notificando que hubo cambios
        this.reloadService.addChanges({changes: true, type: CHANGES_TYPE.DELETE})
      }
      if(!response.result) {
        this.Swal.fire({
          title: 'Error',
          icon: 'error',
          text: response.message
        })
      }
    })
  }

  // Detecta cuando se está escribiendo en los campo de texto y verifica los errores
  comparePassword($event: any) {
    const value = ($event.target as HTMLInputElement).value
    this.comparatorPassword = value
    const password = this.formGroup.get('password')?.value
    const comparator = areSamePassword(password, this.comparatorPassword)
    this.errors['verifyPassword'] = comparator.message
  }

  showPassword($event: any) {
    this.updatePassword = $event.detail.checked
    // Limpiamos el campo que sirve para comparar contraseñas
    this.verifyPassword = ''
  }
}


