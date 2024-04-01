import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ReloadService } from 'src/app/services/reload.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { CHANGES_TYPE } from 'src/app/utilities/constants';
import { Paginator } from 'src/app/utilities/paginator';

@Component({
  selector: 'app-table-common',
  templateUrl: './table-common.component.html',
  styleUrls: ['./table-common.component.scss']
})
export class TableCommonComponent implements OnChanges, OnInit, OnDestroy, AfterViewInit{
  @Input() sectionName: string = '';
  @Input() path!: string;
  @Input() pathFilter!: string;
  @Input() pathImages: string = '';
  @Input() theads: string[] = [];
  @Input() fields: string[] = [];
  @Input() images: string[] = [];
  @Input() money: string[] = [];
  @Input() wasUpdated: boolean = false;

  @Output() prepareFormToUpdate = new EventEmitter<any>();
  @Output() prepareToDelete = new EventEmitter<any>();
  subscription!: Subscription

  table: Paginator = new Paginator()
  items: any[] = []
  total: number = 0
  perPage: FormGroup = new FormGroup({
    number: new FormControl('')
  });
  search: FormGroup = new FormGroup({
    filter: new FormControl('')
  });
  constructor(
    private restApi: RestApiService,
    private cdr: ChangeDetectorRef,
    private hadChangedService: ReloadService
  ) {}

  ngOnInit(): void {
    this.subscription = this.hadChangedService.hadChanged$.subscribe(newValue => {
      if(newValue.changes) {
        if(newValue.type === CHANGES_TYPE.ADD) {
          this.getItems()
        }
        if(newValue.type === CHANGES_TYPE.UPDATE) {
          this.getItems()
        }
        if(newValue.type === CHANGES_TYPE.DELETE) {
          if(this.items.length === 1) {
            this.table.path = this.path
            this.perPage.get('number')?.setValue(this.table.perPages[0])
            this.table.currentPage = 1
            this.search.get('filter')?.setValue('')
            this.getItems()
          } else {
            this.getItems()
          }
        }
      }
    });
  }

  ngOnDestroy() {
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // Inicializamos la tabla luego de que los componente carguen
  ngAfterViewInit(): void {
    this.loadDefault()
  }

  loadDefault() {
    this.table.path = this.path
    this.perPage.get('number')?.setValue(this.table.perPages[0])
    this.table.currentPage = 1
    this.getItems()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['wasUpdated']) {
      if(changes['wasUpdated'].currentValue) {
        if(this.search.get('filter')?.value === '') {
          this.getItems()
        } else {
          this.getItemsByFilter()
        }
      }
    }
  }

  // Evento cuando cambia el número de registros por página
  detectChange(event: any) {
    this.table.currentPage = 1
    let value = this.perPage.get('number')?.value
    if(value) {
      this.table.itemsPerPage = parseInt(value)
      if(!this.search.get('filter')?.value) {
        this.getItems()
        this.table.getTotalPages()
      } else {
        this.getItemsByFilter()
      }
    }
  }

  // Evento cuando escriben en el buscador o filtro de la tabla
  onInput(event:any) {
    this.filterData(false)
  }

  filterData(btnPress: boolean) {
    if(!btnPress) {
      this.table.currentPage = 1
    }
    if(this.search.get('filter')?.value) {
      const filter = this.search.get('filter')?.value
      if(filter !== '') {
        this.getItemsByFilter()
      }
    } else {
      this.getItems()
    }
  }

  getItems() {
    const dataToSend = {
      currentPage: this.table.currentPage,
      perPage: this.table.itemsPerPage
    }
    // Si no está cargada aun no hará nada
    if(!this.table.path) { return }
    this.restApi.get(this.table.path, dataToSend).subscribe((response: any) => {
      console.log(response);
      if(response.data) {
        response.data.rows.map((el:any, i:number) => {
          el.index = ((this.table.currentPage - 1) * this.perPage.get('number')?.value) + (i+1)
        })
        this.items =  response.data.rows
        this.table.setTotal(response.data.count)
      }
    }, (errorData) => {
      console.log(errorData);
    })
  }

  getItemsByFilter() {
    // Preparamos los datos a enviar
    const dataToSend = {
      currentPage:this.table.currentPage,
      perPage: this.table.itemsPerPage,
      filter: this.search.get('filter')?.value
    }
    // Hacemos la consulta y enviamos los datos
    this.restApi.post(
      this.table.path + this.pathFilter,
      dataToSend
    ).subscribe((response: any) => {
      if(!response.error) {
        if(response.data) {
          // Le creamos un indice para que se muestre en la tabla
          response.data.rows.map((el:any, i:number) => {
            el.index = ((this.table.currentPage - 1) * this.perPage.get('number')?.value) + (i+1)
          })
          // Guardamos los items que nos trae el filtrado
          this.items = response.data.rows
          // Guardamos el total de registros que coinciden con la busqueda para generar nueva paginacion
          this.table.setTotal(response.data.count)
          // Para que angular detecte los cambios
          this.cdr.markForCheck()
        } else {
          this.items = []
        }
      }
    })
  }

  previousPage() {
    this.table.previousPage()
    this.filterData(true)
  }

  nextPage() {
    this.table.nextPage()
    this.filterData(true)
  }

  changePage(n:number) {
    this.table.setCurrentPage(n)
    this.filterData(true)
  }

  openFormToUpdate(item: any) {
    const clone = {...item}
    if(clone.index) {
      delete clone.index
    }

    this.prepareFormToUpdate.emit(clone);
  }

  askToDelete(item: any) {
    const clone = {...item}
    if(clone.index) {
      delete clone.index
    }
    this.prepareToDelete.emit(clone)
  }

  createExcel() {
    /* this.restApi.getExcel(EXCEL_PATH, {
      data: [...this.getExcelData()],
      file_name: this.sectionName,
      is_filtered: this.search.get('filter')?.value !== ''
    }).subscribe((response: any) => {
        let blob: Blob = response.body
        this.restApi.dowloadFile(blob, this.getFileName(response))
      },
    ); */
  }

  getExcelData() {
    let clone = [...this.items]
    let data =  clone.map((item) => {
      let obj: any = {}
      // Extraemos los datos que queremos en nuestro excel
      Object.keys(item).forEach(key => {
        if(key === 'index') {
          obj[key] = item[key]
        }
        if(typeof item[key] === 'string') {
          obj[key] = item[key]
        }
      })
      //Creamos un arreglo con los datos de la fila ordenada
      let arr: (string | number)[] = []
      this.fields.forEach(key => {
        arr.push(obj[key])
      })
      return arr
    })
    let titles = [...this.theads]
    titles.pop()
    data.unshift(titles)

    return data
  }

  openImage(path: string) {
    window.open(path, '_blank')
  }

  getFileName(response: any) {
    const contentDisposition = response.headers.get('content-disposition');
    if(contentDisposition) {
      let filename = contentDisposition.split('=')[1];
      return filename + ".xlsx"
    }
    return 'report.xlsx';
  }
}
