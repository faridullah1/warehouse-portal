import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadPicturesToExistingFileComponent } from './upload-pictures.component';

describe('UploadPicturesToExistingFileComponent', () => {
  let component: UploadPicturesToExistingFileComponent;
  let fixture: ComponentFixture<UploadPicturesToExistingFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadPicturesToExistingFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadPicturesToExistingFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
