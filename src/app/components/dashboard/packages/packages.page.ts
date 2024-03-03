import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonModal } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { ReloadService } from 'src/app/services/reload.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { CHANGES_TYPE, FORM_ACTIONS } from 'src/app/utilities/constants';
import { clearErrors, getFormData, validateFields } from 'src/app/utilities/functions';
import { API_PATHS } from 'src/constants';

@Component({
  selector: 'app-packages',
  templateUrl: './packages.page.html',
  styleUrls: ['./packages.page.scss'],
})
export class PackagesPage {
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
  theads: string[] = ['N°', 'Tipo', 'Precio', 'Descripción', 'Imagen', 'Opciones']
  // Campos o propiedades que se extraeran de cada objeto, lo botones se generan por defecto
  fields: string[] = ['index', 'type', 'price', 'description', 'image']
  // Campos de la consulta que se renderizaran como imagenes
  images: string[] = ['image']
  // Items de la sección visible
  items: any = ['image']
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
  // Sección seleccionada para cargar
  selectedSection!: string;
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

  sections: any = {
    chairs:       'chairs',
    tables:       'tables',
    drinks:       'drinks',
    dishes:       'dishes',
    decorations:  'decorations'
  }

  sectionNames: any = {
    chairs:       'Asientos',
    tables:       'Mesas',
    drinks:       'Bebidas',
    dishes:       'Comidas',
    decorations:  'Decoraciones'
  }

  formGroup: FormGroup = new FormGroup({
    section: new FormControl(null)
  })

/*   ngOnInit(){
    this.formGroup.get('section')?.valueChanges.subscribe((value) => {
      console.log('se ejecuta');

    })
  }

  ngOnDestroy(): void {

  } */

  getSectionName() {
    let name = this.sectionNames[this.formGroup.get('section')?.value]
    return name

  }

  onRadioChange($event: any) {
    this.loadSection()
  }

  loadSection() {
    let section = this.formGroup.get('section')?.value
    console.log(section);
    console.log(API_PATHS[section]);

    this.restApi.get(API_PATHS[section]+'list').subscribe((response) => {
      console.log(response.data);

      if(response.result) {
        this.items = response.data
      }

    })
  }
/*   // Propiedades del formulario
  formGroup: FormGroup = new FormGroup({
    type: new FormControl('', [Validators.required]),
    price: new FormControl('', Validators.required),
    description: new FormControl('', [Validators.required]),
    image: new FormControl('', Validators.required),
  }) */
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

  saveRegister() {
    /* if(this.formGroup.invalid){
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
 */
  }

  updateRegister() {
    /* const isValid = validateFields(this.formGroup, this.images, this.errors)
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
    } else {
      this.errors.result = 'Complete todos los campos requeridos'
    } */
  }

  showToAdd() {
    // Asignamos el manejador del evento
    this.alertButtons[1].handler = () => this.saveRegister()
/*     // Reseteamos el formulario
// Limpiamos los errores
clearErrors(this.errors) */
// Definimos la acción del formulario
    this.formGroup.reset()
    this.formAction = FORM_ACTIONS.ADD
    // Mostramos el formulario
    this.modal.present()
  }

  showUpdate(data: any) {
    // Actualizamos el método que ejecutará el boton de aceptar
    this.alertButtons[1].handler = () => this.updateRegister()
    // Definimos la acción que realizará el formulario
    this.formAction = FORM_ACTIONS.UPDATE
    // Mostramos el formulario
    this.modal.present()
    this.formGroup.get('section')?.setValue('')
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

}



