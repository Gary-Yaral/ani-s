import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonModal } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { ReloadService } from 'src/app/services/reload.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { CHANGES_TYPE, FORM_ACTIONS } from 'src/app/utilities/constants';
import { Limit, clearErrors, detectChange, getFormData, textValidator, validateFields, validateFile } from 'src/app/utilities/functions';
import { API_PATHS } from 'src/constants';

@Component({
  selector: 'app-chairs',
  templateUrl: './chairs.page.html',
  styleUrls: ['./chairs.page.scss'],
})
export class ChairsPage{
  constructor(
    private restApi: RestApiService,
    private reloadService: ReloadService,
    private Swal: SweetAlertService,
    private alert: AlertService
  ) {}


  // Formulario HTML
  @ViewChild('formToSend') formRef!: ElementRef;

  // Path para cargar los datos de la tabla
  pathLoad: string = API_PATHS.chairs
  // Cabeceras de la tabla
  theads: string[] = ['N°', 'Nombre', 'Precio', 'Descripción', 'Imagen', 'Opciones']
  // Campos o propiedades que se extraeran de cada objeto, lo botones se generan por defecto
  fields: string[] = ['index', 'name', 'price', 'description', 'image']
  // Campos de la consulta que se renderizaran como imagenes
  images: string[] = ['image']
  // Campos que son de moneda
  money: string[] = ['price']
  // Ruta para consultar la imagenes
  pathImages: string = API_PATHS.images
  // Nombre de endopoint para filtrar en la tabla, será concatenado con path principal
  pathFilter: string = 'filter'
  // Titulo de la sección
  sectionTitle: string = 'Silla'
  // Action que hará el formulario
  formAction: string = 'Nueva'
  // Id seleccionado para editar
  selectedId!: number
  // Imagen que guardaras al enviar el formulario
  selectedFile!: File
  // Mensajes de error de formulario
  formData: FormData = new FormData()
  errors: any = {
    name: '',
    price: '',
    image: '',
    description:'',
    result: ''
  }
  // Propiedades del formulario
  formGroup: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, textValidator()]),
    price: new FormControl('', Validators.required),
    description: new FormControl('', [Validators.required, textValidator()]),
    image: new FormControl('', Validators.required),
  })

  // Detectar errores mientras se llena el formulario
  detectChange: Function = ($event: any, name: string, limit: Limit = {}) => detectChange(this.formGroup, this.errors)($event, name, limit)

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
    let optionals = [...this.images]
    const isValid = validateFields(this.formGroup, this.errors, optionals)
    if(isValid.valid) {
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
  }

  async showDelete(data: any) {
    this.selectedId = data.id
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
}

