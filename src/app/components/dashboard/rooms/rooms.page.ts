import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonModal } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { ReloadService } from 'src/app/services/reload.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ALERT_BTNS, ALERT_HEADERS } from 'src/app/utilities/alertModal';
import { CHANGES_TYPE, FORM_ACTIONS } from 'src/app/utilities/constants';
import { Limit, clearErrors, detectChange, emailValidator, getFormData, numberValidator, telephoneValidator, textValidator, validateFields, validateFile } from 'src/app/utilities/functions';
import { API_PATHS } from 'src/constants';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.page.html',
  styleUrls: ['./rooms.page.scss'],
})
export class RoomsPage implements OnInit {
  constructor(
    private restApi: RestApiService,
    private reloadService: ReloadService,
    private Swal: SweetAlertService,
    private alert: AlertService
  ) {}

  // Formulario HTML
  @ViewChild('formToSend') formRef!: ElementRef;

  // Path para cargar los datos de la tabla
  pathLoad: string = API_PATHS.rooms
  // Cabeceras de la tabla
  theads: string[] = ['N°', 'Nombre', 'Email', 'Teléfono','Dirección','Alquiler', 'Imagen', 'Opciones']
  // Campos o propiedades que se extraeran de cada objeto, lo botones se generan por defecto
  fields: string[] = ['index', 'name', 'email','telephone','address', 'rent', 'image']
  money: string[] = ['rent']
  // Campos de la consulta que se renderizaran como imagenes
  images: string[] = ['image']
  // Ruta para consultar la imagenes
  pathImages: string = API_PATHS.images
  // Nombre de endopoint para filtrar en la tabla, será concatenado con path principal
  pathFilter: string = 'filter'
  // Titulo de la sección
  sectionTitle: string = 'Bebida'
  // Action que hará el formulario
  formAction: string = 'Nueva'
  // Id seleccionado para editar
  selectedId!: number
  // Imagen que guardaras al enviar el formulario
  selectedFile!: File
  // Titulo de alerta
  alertHeader!: string
  // Lista de los tipos de bebidas
  drinkTypes: any = []
  // Mensajes de error de formulario
  formData: FormData = new FormData()
  errors: any = {
    name: '',
    address:'',
    email: '',
    telephone: '',
    rent: '',
    image: '',
    request: ''
  }
  // Propiedades del formulario
  formGroup: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, textValidator()]),
    address: new FormControl('', [Validators.required, textValidator()]),
    rent: new FormControl('', [Validators.required, numberValidator()]),
    telephone: new FormControl('', [Validators.required, telephoneValidator()]),
    email: new FormControl('', [Validators.required, emailValidator()]),
    image: new FormControl('', Validators.required),
  })

  ngOnInit(): void {
    this.loadTypes()
  }

  loadTypes() {
    this.restApi.get(API_PATHS.dishTypes+'list').subscribe((response:any)=>{
      if(response.data && Array.isArray(response.data)) {
        let { data } = response
        this.drinkTypes = data
      }
    })
  }

  // Detectar errores mientras se llena el formulario
  detectChange: Function = ($event: any, name: string, limit: Limit = {exists: false}) => detectChange(this.formGroup, this.errors)($event, name, limit)

  // Propiedades de botonoes de alerta
  public alertButtons = [ ...ALERT_BTNS ];

  // Ventana modal de Si o No
  @ViewChild(IonModal) modal!: IonModal;

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  onWillDismiss(event: any) {
    const modal = event.target
  }

  loadFile($event: any) {
    const file = validateFile($event, this.formGroup, this.errors, 'image')
    if(file) {
      this.selectedFile = file
    }
  }

  saveRegister() {
    if(this.formGroup.invalid){
      // Validamos y mostrarmos mensajes de error
      validateFields(this.formGroup, this.errors)
    } else {
      // Creamos el FormData
      const formData = getFormData(this.formRef)
      // Añadimos el valor del select al FormData
      formData.append('typeId', this.formGroup.get('typeId')?.value)
      this.restApi.post(this.pathLoad, formData).subscribe((result: any) => {
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
    let optionals = [...this.images]
    const isValid = validateFields(this.formGroup, this.errors, optionals)
    if(isValid.valid) {
      // Creamos el FormData
      const formData = getFormData(this.formRef)
      // Añadimos el valor del select al FormData
      formData.append('typeId', this.formGroup.get('typeId')?.value)
      this.restApi.put(this.pathLoad + this.selectedId, formData).subscribe((result: any) => {
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
    // Asignamos valor por defecto para el tipo de bebida
    this.formGroup.get('typeId')?.setValue("")
    // Cambiamos el texto de la alerta a guardar registro
    this.alertHeader = ALERT_HEADERS.save
  }

  showUpdate(data: any) {
    // Limpiamos el formulario
    this.formGroup.reset()
    // Limpiamos los errores
    clearErrors(this.errors)
    // Definimos el id que fue seleccionado
    this.selectedId = data.id
    // Rellenamos el formulario con los datos del registro que actualizaremos
    const keys = Object.keys(this.formGroup.value)
    keys.forEach((key:any) =>{
      if(this.images.includes(key)){
        this.formGroup.get(key)?.setValue('')
      } else {
        this.formGroup.get(key)?.setValue(data[key])
      }
    })

    // Actualizamos el método que ejecutará el boton de aceptar
    this.alertButtons[1].handler = () => this.updateRegister()
    // Definimos la acción que realizará el formulario
    this.formAction = FORM_ACTIONS.UPDATE
    // Mostramos el formulario
    this.modal.present()
    // Cambiamos el texto de la alerta a guardar cambios
    this.alertHeader = ALERT_HEADERS.update
  }

  async showDelete(data: any) {
    this.selectedId = data.id
    // Creamos la modal que mostraremos
    await this.alert.getDeleteAlert(() =>{
      this.deleteRegister()
    })
  }

  deleteRegister() {
    this.restApi.delete(this.pathLoad + this.selectedId).subscribe((result:any) => {
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
}



