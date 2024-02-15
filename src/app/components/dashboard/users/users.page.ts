import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonModal } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { ReloadService } from 'src/app/services/reload.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { CHANGES_TYPE, FORM_ACTIONS } from 'src/app/utilities/constants';
import { detectChange, dniValidator, emailValidator, passwordValidator, textValidator, usernameValidator } from 'src/app/utilities/functions';
import { clearErrors, getFormData, validateFields, validateOnlyTextFields } from 'src/app/utilities/validateFields';
import { API_PATHS } from 'src/constants';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {
  constructor(
    private restApi: RestApiService,
    private reloadService: ReloadService,
    private Swal: SweetAlertService,
    private alert: AlertService
  ) {}

  // Formulario HTML
  @ViewChild('formToSend') formRef!: ElementRef;
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
    'UserStatus.name']
  // Campos de la consulta que se renderizaran como imagenes
  images: string[] = []
  // Roles que tendrán los usuarios
  roles: any = []
  // Estados que tendrá el usuario
  statuses: any = []
  // Ruta para consultar la imagenes
  pathImages: string = API_PATHS.images
  // Nombre de endopoint para filtrar en la tabla, será concatenado con path principal
  pathFilter: string = 'filter'
  // Titulo de la sección
  sectionTitle: string = 'Usuario'
  // Action que hará el formulario
  formAction: string = 'Nuevo'
  // Id seleccionado para editar
  selectedId!: number
  // Imagen que guardaras al enviar el formulario
  selectedFile!: File
  // Para validar que las contraseñas fueron camparadas
  passwordCompared: boolean = false
  // Mensajes de error de formulario
  formData: FormData = new FormData()
  errors: any = {
    dni: '',
    name: '',
    lastname: '',
    telephone: '',
    email: '',
    role: '',
    username:'',
    password:'',
    result: ''
  }
  // Propiedades del formulario
  formGroup: FormGroup = new FormGroup({
    dni: new FormControl('', [Validators.required, dniValidator()]),
    name: new FormControl('', [Validators.required, textValidator(true)]),
    lastname: new FormControl('', [Validators.required,  textValidator(true)]),
    telephone: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, emailValidator()]),
    role: new FormControl('', Validators.required),
    username: new FormControl('', [Validators.required, usernameValidator()]),
    password: new FormControl('', [Validators.required, passwordValidator()]),
    status: new FormControl('', Validators.required),
  })

  // Detectar errores mientras se llena el formulario
  detectChange: Function = ($event: any, name: string) => detectChange(this.formGroup, this.errors)($event, name)

  ngOnInit(): void {
    this.loadStatusses()
    this.loadRoles()
    this.loadRows()

  }

  // Cargamos los estados que serpan listado en el formulario
  loadStatusses() {
    this.restApi.get(API_PATHS.status).subscribe((response: any) => {
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
    this.restApi.get(API_PATHS.role).subscribe((response: any) => {
      if(response.error){
        console.error(response.error);
      }

      if(response.data) {
        this.roles = response.data
        this.formGroup.get('role')?.setValue(this.roles[0].id)
      }
    })
  }
  // Cargamos los registros de la tabla
  loadRows() {
    this.restApi.get(API_PATHS.roles).subscribe((response: any) => {
      if(response.error){
        console.error(response.error);
      }
      console.log(response);

      /* if(response.data) {
        this.roles = response.data
        this.formGroup.get('role')?.setValue(this.roles[0].id)
      } */
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

  // Ventana modal de Si o No
  @ViewChild(IonModal) modal!: IonModal;

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  onWillDismiss(event: any) {
    const modal = event.target
  }

  loadFile($event: any) {
    if($event.target.files.length > 0) {
      const file = $event.target.files[0]
      this.selectedFile = file
      this.errors['image'] = ''
    }
  }

  saveRegister() {
    console.log(this.formGroup.value);
    console.log(this.formGroup.value);
    return
    if(this.formGroup.invalid){
      // Validamos y mostrarmos mensajes de error
      validateFields(this.formGroup.value, this.errors)
    } else {
      this.restApi.post(API_PATHS.chairs, getFormData(this.formRef)).subscribe((result: any) => {
        if(result.error) {
          this.errors['result'] = result.error
        } else {
          clearErrors(this.errors)
          this.Swal.fire({
            icon: 'success',
            title: 'Ok',
            text: result.message
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
    const isValid = validateOnlyTextFields(this.formGroup, this.images, this.errors)
    if(isValid) {
      this.restApi.put(API_PATHS.chairs + this.selectedId, getFormData(this.formRef)).subscribe((result: any) => {
        if(result.error) {
          this.errors['result'] = result.error
        } else {
          this.Swal.fire({
            icon: 'success',
            title: 'Ok',
            text: result.message
          }).then((value: any) => {
            // Reseteamos el formGroup
            this.formGroup.reset()
            this.cancel()
          })

          // Notificamos que hubo cambios para que se refresque la tabla
          this.reloadService.addChanges({changes: true, type: CHANGES_TYPE.UPDATE})
          // Limpiamos los errores de los campos
          clearErrors(this.errors)
        }
      })
    } else {
      this.errors.result = 'Complete todos los campos requeridos'
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
    // Cargamos datos por defecto una vez se renderice el formulario
    this.formGroup.get('role')?.setValue(this.roles[0].id)
    this.formGroup.get('status')?.setValue(this.statuses[0].id)
  }

  showUpdate(data: any) {
    // Limpiamos el formulario
    this.formGroup.reset()
    // Limpiamos los errores
    clearErrors(this.errors)
    // Definimos el id que fue seleccionado
    this.selectedId = data['User.id']
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
    // Mostramos el formulario
    this.modal.present()
    // Rellenamos el formulario con los datos del registro que actualizaremos
    this.formGroup.setValue(value)
  }

  async showDelete(id: any) {
    this.selectedId =id
    // Creamos la modal que mostraremos
    await this.alert.getDeleteAlert(() =>{
      this.deleteRegister()
    })
  }

  deleteRegister() {
    this.restApi.delete(API_PATHS.chairs + this.selectedId).subscribe((result:any) => {
      if(result.error) {
        this.Swal.fire({
          title: 'Error',
          icon: 'error',
          text: result.error
        })
      } else {
        this.Swal.fire({
          title: 'Ok',
          icon: 'success',
          text: result.messaje
        })
        // Hacemos que la tabla se refresque notificando que hubo cambios
        this.reloadService.addChanges({changes: true, type: CHANGES_TYPE.DELETE})
      }
    })
  }

  // Detecta cuando se está escribiendo en los campo de texto y verifica los errores
  comparePassword($event: any) {
    const value = ($event.target as HTMLInputElement).value
    const password = this.formGroup.get('password')?.value
    if(value !== password) {
      this.errors['verifyPassword'] = 'Las contraseñas no coinciden'
      this.passwordCompared = false
    } else {
      this.errors['verifyPassword'] = ''
      this.passwordCompared = password !== ''
    }
  }
}


