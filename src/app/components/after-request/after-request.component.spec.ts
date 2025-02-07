import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfterRequestComponent } from './after-request.component';

describe('AfterRequestComponent', () => {
  let component: AfterRequestComponent;
  let fixture: ComponentFixture<AfterRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AfterRequestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AfterRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
