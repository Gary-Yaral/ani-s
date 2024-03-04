import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalPackagePage } from './modal-package.page';

describe('ModalPackagePage', () => {
  let component: ModalPackagePage;
  let fixture: ComponentFixture<ModalPackagePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ModalPackagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
