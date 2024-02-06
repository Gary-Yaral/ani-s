import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChairsPage } from './chairs.page';

describe('ChairsPage', () => {
  let component: ChairsPage;
  let fixture: ComponentFixture<ChairsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ChairsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
