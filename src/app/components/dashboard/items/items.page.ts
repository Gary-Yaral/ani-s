import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  templateUrl: './items.page.html',
  styleUrls: ['./items.page.scss'],
})
export class ItemsPage implements OnInit{
  constructor(
    private restApi: RestApiService,
    private reloadService: ReloadService,
    private Swal: SweetAlertService,
    private alert: AlertService
  ) {}
  ngOnInit(): void {
    this.loadCategories()
  }

  categories: any  = []
  subcategories: any  = []

  // Formulario HTML
  @ViewChild('formToSend') formRef!: ElementRef;

  // Path para cargar los datos de la tabla
  pathLoad: string = API_PATHS.items
  // Cabeceras de la tabla
  theads: string[] = ['N°', 'Nombre', 'Precio', 'Descripción', 'Categoria', 'Subcategoría', 'Imagen', 'Opciones']
  // Campos o propiedades que se extraeran de cada objeto, lo botones se generan por defecto
  fields: string[] = ['index', 'name', 'price', 'description', 'Subcategory.Category.name', 'Subcategory.name', 'image']
  // Campos de la consulta que se renderizaran como imagenes
  images: string[] = ['image']
  // Campos que son de moneda
  money: string[] = ['price']
  // Ruta para consultar la imagenes
  pathImages: string = API_PATHS.images
  // Nombre de endopoint para filtrar en la tabla, será concatenado con path principal
  pathFilter: string = 'filter'
  // Titulo de la sección
  sectionTitle: string = 'Item'
  // Action que hará el formulario
  formAction: string = 'Nueva'
  // Id seleccionado para editar
  selectedId!: number
  // Categoria que ha sido seleccionada
  selectedCatId!: number
  // Imagen que guardaras al enviar el formulario
  selectedFile!: File
  // Mensajes de error de formulario
  formData: FormData = new FormData()
  errors: any = {
    name: '',
    price: '',
    image: '',
    description:'',
    categoryId:'',
    subcategoryId:''
  }
  // Propiedades del formulario
  formGroup: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, textValidator()]),
    price: new FormControl('', Validators.required),
    description: new FormControl('', [Validators.required, textValidator()]),
    image: new FormControl('', Validators.required),
    categoryId: new FormControl('', Validators.required),
    subcategoryId: new FormControl('', Validators.required),
  })

  // Detectar errores mientras se llena el formulario
  detectChange: Function = ($event: any, name: string, limit: Limit = {}, callback: Function = () => {}) => detectChange(this.formGroup, this.errors)($event, name, limit)

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
      let params = this.getParams()
      if(!params.valid) {
        this.Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Debes seleccionar correctamente la subcategoria'
        })
        return
      }

      this.restApi.post(API_PATHS.items, getFormData(this.formRef), params.data).subscribe((result: any) => {
        if(result.error) {
          this.Swal.fire({
            icon: 'error',
            title: 'Error',
            text: result.msg
          })
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

  getParams() {
    const subcategoryId = this.formGroup.get('subcategoryId')?.value
    if(subcategoryId !== '' && subcategoryId !== null) {
      const result = this.subcategories.find((cat: any)=> cat.id === parseInt(subcategoryId))
      if(result) {
        return {valid: true, data: { subcategory: result.name.toUpperCase() }}
      } else {
        return {
          valid: false,
          data: null
        }
      }
    } else {
      return {
        valid: false,
        data: null
      }
    }

  }


  update() {
    let optionals = [...this.images]
    const isValid = validateFields(this.formGroup, this.errors, optionals)
    if(isValid.valid) {
      let params = this.getParams()
      if(!params.valid) {
        this.Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Debes seleccionar correctamente la subcategoria'
        })
        return
      }
      this.restApi.put(API_PATHS.items + this.selectedId, getFormData(this.formRef), params.data).subscribe((response: any) => {
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
    this.loadCategories()
    if(this.categories.length === 0) {
      this.Swal.fire({
        title: 'Atención',
        icon: 'warning',
        text: 'Debes registrar al menos una categoría'
      })
    } else {
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

    this.formGroup.get('categoryId')?.setValue(data['Subcategory.Category.id'])
    this.loadSubcategories() // Cargamos las subcategorias para poder selecionarla
    this.formGroup.get('subcategoryId')?.setValue(data['Subcategory.id'])

    // Actualizamos el método que ejecutará el boton de aceptar
    this.alertButtons[1].handler = () => this.update()
    // Definimos la acción que realizará el formulario
    this.formAction = FORM_ACTIONS.UPDATE
    // Mostramos el formulario
    this.modal.present()
  }

  async showDelete(data: any) {
    this.selectedId = data.id
    // Creamos la modal que mostraremos
    await this.alert.getDeleteAlert(() =>{
      this.delete()
    })
  }

  delete() {
    this.restApi.delete(API_PATHS.items + this.selectedId).subscribe((result:any) => {
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

  loadCategories() {
    this.restApi.get(API_PATHS.categories + 'list').subscribe((response) => {
      if(response.data) {
        this.categories = response.data
      }
    })
  }

  loadSubcategories() {
    let id = this.formGroup.get('categoryId')?.value
    if(id !== '' || id === null) {
      this.restApi.get(API_PATHS.subcategories + 'list/'+ id).subscribe((response) => {
        if(response.data) {
          this.subcategories = response.data
        }
      })
    } else {
      this.subcategories = []
    }
  }
}

