import { AfterViewInit, Component, ElementRef, ViewChild, input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonModal, ModalController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { ReloadService } from 'src/app/services/reload.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { CHANGES_TYPE } from 'src/app/utilities/constants';
import { clearErrors, getFormData, validateFields, validateOnlyTextFields } from 'src/app/utilities/validateFields';
import { API_PATHS } from 'src/constants';

@Component({
  selector: 'app-chairs',
  templateUrl: './chairs.page.html',
  styleUrls: ['./chairs.page.scss'],
})
export class ChairsPage implements AfterViewInit{
  constructor(
    private restApi: RestApiService,
    private reloadService: ReloadService,
    private Swal: SweetAlertService,
    private alert: AlertService,
    private elementRef: ElementRef,
    private modalController: ModalController,
  ) {}
  ngAfterViewInit() {
    const modalElement = this.elementRef.nativeElement;
    // Accede a los elementos del modal dentro de modalElement
    console.log(modalElement);
  }
  // Formulario HTML
  @ViewChild('formToSend') formRef!: ElementRef;

  // Path para cargar los datos de la tabla
  pathLoad: string = API_PATHS.chairs
  // Cabeceras de la tabla
  theads: string[] = ['N°', 'Tipo', 'Precio', 'Descripción', 'Imagen', 'Opciones']
  // Campos o propiedades que se extraeran de cada objeto, lo botones se generan por defecto
  fields: string[] = ['index', 'type', 'price', 'description', 'image']
  // Campos de la consulta que se renderizaran como imagenes
  images: string[] = ['image']
  // Ruta para consultar la imagenes
  pathImages: string = API_PATHS.images
  // Titulo de la sección
  sectionTitle: string = 'Nuevo'
  // Action que hará el formulario
  formAction: string = 'Silla'
  // Id seleccionado para editar
  selectedId!: number
  // Imagen que guardaras al enviar el formulario
  selectedFile!: File
  // Mensajes de error de formulario
  formData: FormData = new FormData()
  errors: any = {
    type: '',
    price: '',
    image: '',
    description:'',
    result: ''
  }
  // Propiedades del formulario
  chair: FormGroup = new FormGroup({
    type: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    image: new FormControl('', Validators.required),
  })
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
      /* this.formData.set('image', file, file.name) */
    }
  }

  saveRegister() {
    if(this.chair.invalid){
      // Validamos y mostrarmos mensajes de error
      validateFields(this.chair.value, this.errors)
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
            this.chair.reset()
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
    const isValid = validateOnlyTextFields(this.chair, this.images, this.errors)
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
            this.chair.reset()
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
    this.chair.reset()
    // Limpiamos los errores
    clearErrors(this.errors)
    this.modal.present()
  }

  showUpdate(data: any) {
    // Limpiamos el formulario
    this.chair.reset()
    // Limpiamos los errores
    clearErrors(this.errors)
    // Definimos el id que fue seleccionado
    this.selectedId = data.id
    // Rellenamos el formulario con los datos del registro que actualizaremos
    const keys = Object.keys(this.chair.value)
    keys.forEach((key:any) =>{
      if(this.images.includes(key)){
        this.chair.get(key)?.setValue('')
      } else {
        this.chair.get(key)?.setValue(data[key])
      }
    })

    // Actualizamos el método que ejecutará el boton de aceptar
    this.alertButtons[1].handler = () => this.updateRegister()
    // Mostramos el formulario
    this.modal.present()
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
        // Hacemos que la tabla se refresque diciendo que hubo cambios
        this.reloadService.addChanges({changes: true, type: CHANGES_TYPE.DELETE})
      }
    })
  }

  detectChange($event: any, name: string) {
    const value = ($event.target as HTMLInputElement).value
    let cleanText = value.replace(/\s/g, '')
    const isEmpty = cleanText === ''
  }
}

