import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonModal } from '@ionic/angular';
import { strkey } from 'src/app/interfaces';
import { FileService } from 'src/app/services/file.service';
import { ReloadService } from 'src/app/services/reload.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { CHANGES_TYPE } from 'src/app/utilities/constants';
import { clearErrors, resetForm, validateFields } from 'src/app/utilities/validateFields';
import { API_PATHS } from 'src/constants';
import Swal from 'sweetalert2'

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
  // Mensajes de error de formulario
  errors: strkey = {
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
    image: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
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
      const loaded = $event.target.files[0];
      this.fileService.base64(loaded)
      .then((data: any) => {
        this.chair.patchValue({
          image: data
        });
      }).catch((e) => {
        this.chair.get('image')?.reset()
        console.log(e);
      })
    } else {
      this.chair.get('image')?.reset()
    }
  }

  saveRegister() {
    if(this.chair.invalid){
      validateFields(this.chair.value, this.errors)
    } else {
      this.restApi.post(API_PATHS.chairs, this.chair.value).subscribe((result: any) => {
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
    console.log(this.chair.value);

    /* if(this.chair.invalid){
      validateFields(this.chair.value, this.errors)
    } else {
      this.restApi.post(API_PATHS.chairs, this.chair.value).subscribe((result: any) => {
        if(result.error) {
          this.errors['result'] = result.error
        } else {
          clearErrors(this.errors)
          Swal.fire({
            icon: 'success',
            title: 'Ok',
            text: result.message
          }).then((value: any) => {
            this.cancel()
            this.chair.reset()
            this.reloadService.addChanges({changes: true, type: CHANGES_TYPE.ADD})
          })
        }
      })
    } */

  }

  showToAdd() {
    resetForm(this.chair, this.errors)
    this.alertButtons[1].handler = () => this.saveRegister()
    this.modal.present()
  }

  showUpdate(data: any) {
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
