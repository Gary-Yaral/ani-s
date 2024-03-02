import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FoodTypesPage } from './food-types.page';

describe('FoodTypesPage', () => {
  let component: FoodTypesPage;
  let fixture: ComponentFixture<FoodTypesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(FoodTypesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
