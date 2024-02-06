import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DecorationsPage } from './decorations.page';

describe('DecorationsPage', () => {
  let component: DecorationsPage;
  let fixture: ComponentFixture<DecorationsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DecorationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
