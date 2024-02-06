import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WINDOW_TITLES } from 'src/constants';
import { pathName } from '../interfaces';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder!: string;
  private activatedRoute = inject(ActivatedRoute);
  constructor() {}

  ngOnInit() {
    const path = this.activatedRoute.snapshot.paramMap.get('id') as string;
    // Verificar que path sea una clave válida en WINDOW_TITLES
    if (WINDOW_TITLES.hasOwnProperty(path)) {
      this.folder = WINDOW_TITLES[path];
    } else {
      this.folder = WINDOW_TITLES['home'];
    }

  }
}
