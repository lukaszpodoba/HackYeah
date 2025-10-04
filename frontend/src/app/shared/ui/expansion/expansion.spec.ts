import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Expansion } from './expansion';

describe('Expansion', () => {
  let component: Expansion;
  let fixture: ComponentFixture<Expansion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Expansion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Expansion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
