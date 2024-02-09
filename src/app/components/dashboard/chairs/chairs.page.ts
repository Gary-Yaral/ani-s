import { Component, ElementRef, OnInit, ViewChild, asNativeElements } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonModal } from '@ionic/angular';
import { FileService } from 'src/app/services/file.service';
import { ReloadService } from 'src/app/services/reload.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { CHANGES_TYPE } from 'src/app/utilities/constants';
import { clearErrors, getFormData, resetForm, validateFields, validateOnlyTextFields } from 'src/app/utilities/validateFields';
import { API_PATHS } from 'src/constants';

@Component({
  selector: 'app-chairs',
  templateUrl: './chairs.page.html',
  styleUrls: ['./chairs.page.scss'],
})
export class ChairsPage {
  constructor(
    private restApi: RestApiService,
    private fileService: FileService,
    private reloadService: ReloadService,
    private Swal: SweetAlertService
  ) {}

  // Formulario HTML
  @ViewChild('formToSend') formRef!: ElementRef;

  // Path para cargar los datos de la tabla
  pathLoad: string = API_PATHS.chairs
  // Cabeceras de la tabla
  theads: string[] = ['N°', 'Tipo', 'Precio', 'descripción', 'images', 'opciones']
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
            this.cancel()
            resetForm(this.chair, this.errors)
            this.reloadService.addChanges({changes: true, type: CHANGES_TYPE.ADD})
          })
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
          clearErrors(this.errors)
          this.Swal.fire({
            icon: 'success',
            title: 'Ok',
            text: result.message
          }).then((value: any) => {
            this.cancel()
            this.chair.reset()
            this.reloadService.addChanges({changes: true, type: CHANGES_TYPE.UPDATE})
          })
        }
      })
      console.log('se envia');

    } else {
      this.errors.result = 'Complete todos los campos requeridos'
    }
  }

  showToAdd() {
    resetForm(this.chair, this.errors)
    this.alertButtons[1].handler = () => this.saveRegister()
    this.modal.present()
  }

  showUpdate(data: any) {
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

  deleteRow(data: any) {
    console.log(data);
  }

  detectChange($event: any, name: string) {
    const value = ($event.target as HTMLInputElement).value
    let cleanText = value.replace(/\s/g, '')
    const isEmpty = cleanText === ''
  }
}

