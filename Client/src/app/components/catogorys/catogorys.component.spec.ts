import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatogorysComponent } from './catogorys.component';

describe('CatogorysComponent', () => {
  let component: CatogorysComponent;
  let fixture: ComponentFixture<CatogorysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatogorysComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatogorysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
