import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadSectionsPage } from './load-sections.page';

describe('LoadSectionsPage', () => {
  let component: LoadSectionsPage;
  let fixture: ComponentFixture<LoadSectionsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LoadSectionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
