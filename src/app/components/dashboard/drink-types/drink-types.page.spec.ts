import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DrinkTypesPage } from './drink-types.page';

describe('DrinkTypesPage', () => {
  let component: DrinkTypesPage;
  let fixture: ComponentFixture<DrinkTypesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DrinkTypesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
