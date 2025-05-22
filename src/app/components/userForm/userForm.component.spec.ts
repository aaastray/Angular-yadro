import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { UserFormComponent } from './userForm.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { By } from '@angular/platform-browser';
import { User } from '../../data/domain/user';
import { DebugElement } from '@angular/core';
import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { SaveOutline } from '@ant-design/icons-angular/icons';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';


describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;
  let mockUser: User;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NzFormModule,
        NzInputModule,
        NzButtonModule,
        NzGridModule,
        NzDividerModule,
        NzSpinModule,
        NzIconModule,
        UserFormComponent,
        NoopAnimationsModule
      ],
      providers: [
        { provide: NZ_ICONS, useValue: [SaveOutline] }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;

    mockUser = {
      id: 1,
      name: 'John Doe',
      username: 'johndoe',
      email: 'johndoe@example.com',
      phone: '1234567890',
      website: 'example.com',
      address: {
        street: 'Main St',
        suite: 'Apt. 1',
        city: 'Metropolis',
        zipcode: '12345',
        geo: {
          lat: '40.7128',
          lng: '74.0060',
        },
      },
      company: {
        name: 'Acme Corp',
        catchPhrase: 'Innovate and Inspire',
        bs: 'synergize scalable solutions',
      },
    };
  });

  it('должен создаваться компонент', () => {
    expect(component).toBeTruthy();
  });

  it('открыть форму в режиме редактирования, если выбран пользователь', () => {
    component.user = mockUser;
    component.ngOnInit();
    expect(component.isEditMode).toBeTrue();
    expect(component.userForm.value).toEqual(mockUser);
  });

  it('должен открыть форму в режиме создания, если пользователь не выбран', () => {
    component.user = null;
    component.ngOnInit();
    expect(component.isEditMode).toBeFalse();
    expect(component.userForm.value.id).toBeNull();
  });

  it('должен генерировать событие formSubmit с данными формы при отправке', () => {
    component.user = mockUser;
    component.ngOnInit();

    const formSubmitSpy = spyOn(component.formSubmit, 'emit');
    component.onSubmit();

    expect(formSubmitSpy).toHaveBeenCalledWith(mockUser);
  });

  it('не должен генерировать событие formSubmit, если форма недействительна', () => {
    component.user = null;
    component.ngOnInit();

    const formSubmitSpy = spyOn(component.formSubmit, 'emit');
    component.userForm.controls['name'].setValue(''); // Invalid name
    component.onSubmit();

    expect(formSubmitSpy).not.toHaveBeenCalled();
  });

  it('пометить поля как затронутые при отправке формы, если форма недействительна', () => {
    component.user = null;
    component.ngOnInit();

    const markAsTouchedSpy = spyOn(component.userForm, 'markAllAsTouched');
    component.onSubmit();

    expect(markAsTouchedSpy).toHaveBeenCalled();
  });

  it('должен выдавать событие cancelForm при отмене формы', () => {
    const cancelFormSpy = spyOn(component.cancelForm, 'emit');
    component.onCancel();
    expect(cancelFormSpy).toHaveBeenCalled();
  });

  it('должны отображаться сообщения об ошибках проверки для обязательных полей', () => {
    component.user = null;
    component.ngOnInit();

    const nameControl = component.userForm.get('name');
    nameControl?.setValue('');
    nameControl?.markAsTouched();

    fixture.detectChanges();

    const errorMessage = component.getErrorMessage('name');
    expect(errorMessage).toBe('Это поле обязательно');
  });

  it('должно отображаться сообщение об ошибке проверки для неверного адреса электронной почты', () => {
    component.user = null; // или нужный user
    component.ngOnInit();  // инициализация формы
    fixture.detectChanges();
    const emailControl = component.userForm.get('email')!;
    emailControl.setValue('y!!lala');
    emailControl.markAsTouched();
    fixture.detectChanges();
    expect(emailControl.errors).toEqual({ email: true });
    // проверить текст ошибки
    const errorMessage = component.getErrorMessage('email');
    expect(errorMessage).toBe('Некорректный формат email');
  });



  it('отобразить поля формы с начальными значениями в режиме редактирования', () => {
    component.user = mockUser;
    component.ngOnInit();
    fixture.detectChanges();

    const nameInput: DebugElement = fixture.debugElement.query(
      By.css('input[formControlName="name"]')
    );
    expect(nameInput.nativeElement.value).toBe(mockUser.name);

    const emailInput: DebugElement = fixture.debugElement.query(
      By.css('input[formControlName="email"]')
    );
    expect(emailInput.nativeElement.value).toBe(mockUser.email);
  });
});
