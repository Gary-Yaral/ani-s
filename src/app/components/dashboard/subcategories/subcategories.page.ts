import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonModal } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { ReloadService } from 'src/app/services/reload.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ALERT_BTNS, ALERT_HEADERS } from 'src/app/utilities/alertModal';
import { CHANGES_TYPE, FORM_ACTIONS } from 'src/app/utilities/constants';
import { Limit, clearErrors, detectChange, getFormData, textValidator, validateFields, validateFile } from 'src/app/utilities/functions';
import { API_PATHS } from 'src/constants';

@Component({
  selector: 'app-food-types',
  templateUrl: './subcategories.page.html',
  styleUrls: ['./subcategories.page.scss'],
})
export class SubcategoriesPage implements OnInit{
  constructor(
    private restApi: RestApiService,
    private reloadService: ReloadService,
    private Swal: SweetAlertService,
    private alert: AlertService
  ) {}

  // Formulario HTML
  @ViewChild('formToSend') formRef!: ElementRef;

  // Path para cargar los datos de la tabla
  pathLoad: string = API_PATHS.subcategories
  // Cabeceras de la tabla
  theads: string[] = ['N°', 'Nombre', 'Categoria', 'Opciones']
  // Campos o propiedades que se extraeran de cada objeto, lo botones se generan por defecto
  fields: string[] = ['index', 'name', 'Category.name']
  // Nombre de endopoint para filtrar en la tabla, será concatenado con path principal
  pathFilter: string = 'filter'
  // Titulo de la sección
  sectionTitle: string = 'Subcategoría'
  // Action que hará el formulario
  formAction!: string
  // Id seleccionado para editar
  selectedId!: number
  // Titulo de ventana de alerta
  alertHeader!: string
  // Mensajes de error de formulario
  formData: FormData = new FormData()
  errors: any = {
    name: '',
    categoryId: ''
  }
  // Propiedades del formulario
  formGroup: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, textValidator()]),
    categoryId: new FormControl('', [Validators.required])
  })

  // Arreglo de las categorias
  categories: any = []

  // Detectar errores mientras se llena el formulario
  detectChange: Function = ($event: any, name: string, limit: Limit = {}) => detectChange(this.formGroup, this.errors)($event, name, limit)

  // Propiedades de botonoes de alerta
  public alertButtons = [ ...ALERT_BTNS ];

  // Ventana modal de Si o No
  @ViewChild(IonModal) modal!: IonModal;

  ngOnInit(): void {
    this.loadCategories()
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  saveRegister() {
    if(this.formGroup.invalid){
      // Validamos y mostrarmos mensajes de error
      validateFields(this.formGroup, this.errors)
    } else {
      this.restApi.post(this.pathLoad, this.formGroup.value).subscribe((response: any) => {
        if(response.error) {
          this.Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.msg
          })
        }
        if(response.done) {
          clearErrors(this.errors)
          this.Swal.fire({
            icon: 'success',
            title: 'Ok',
            text: response.msg
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
      }, (errorData) => {
        if(errorData.status === 400) {
          if(errorData.error) {
            let { errorKeys, errors } = errorData.error
            errorKeys.forEach((key: any) => {
              this.errors[key] = errors[key][0].msg
            });
          }
        }
      })
    }
  }

  updateRegister() {
    const isValid = validateFields(this.formGroup, this.errors)
    if(isValid.valid) {
      this.restApi.put(this.pathLoad + this.selectedId, this.formGroup.value).subscribe((response: any) => {
        if(response.error) {
          this.Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.msg
          })
        }
        if(response.done) {
          this.Swal.fire({
            icon: 'success',
            title: 'Ok',
            text: response.msg
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
    // Actualizamos el mensaje de la alerta
    this.alertHeader = ALERT_HEADERS.save
    // Mostramos el formulario
    this.modal.present()
  }

  showUpdate(subcategory: any) {
    // Limpiamos el formulario
    this.formGroup.reset()
    // Limpiamos los errores
    clearErrors(this.errors)
    // Definimos el id que fue seleccionado
    this.selectedId = subcategory.id
    this.formGroup.setValue({
      name: subcategory.name,
      categoryId: subcategory.categoryId
    })
    // Actualizamos el método que ejecutará el boton de aceptar
    this.alertButtons[1].handler = () => this.updateRegister()
    // Definimos la acción que realizará el formulario
    this.formAction = FORM_ACTIONS.UPDATE
    // Actualizamos el mensaje de la alerta
    this.alertHeader = ALERT_HEADERS.update
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
    this.restApi.delete(this.pathLoad + this.selectedId).subscribe((response:any) => {
      if(response.error) {
        this.Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.msg
        })
      }
      if(response.done) {
        this.Swal.fire({
          title: 'Ok',
          icon: 'success',
          text: response.message
        })
        // Hacemos que la tabla se refresque notificando que hubo cambios
        this.reloadService.addChanges({changes: true, type: CHANGES_TYPE.DELETE})
      }
    })
  }

  loadCategories() {
    this.restApi.get(API_PATHS.categories + 'list').subscribe((response) => {
      if(response.data) {
        this.categories = response.data
      }
    })
  }
}


