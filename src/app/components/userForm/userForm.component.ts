import {Component, OnInit, Input, Output, EventEmitter, inject} from '@angular/core';
import {FormGroup, Validators, ReactiveFormsModule, NonNullableFormBuilder} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzDividerModule} from 'ng-zorro-antd/divider';
import {NzCardModule} from 'ng-zorro-antd/card';
import {NzAlertModule} from 'ng-zorro-antd/alert';
import {NzSpinModule} from 'ng-zorro-antd/spin';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {User} from '../../data/domain/user';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzGridModule,
    NzDividerModule,
    NzCardModule,
    NzAlertModule,
    NzSpinModule,
    NzIconModule
  ],
  templateUrl: './userForm.component.html'
})
export class UserFormComponent implements OnInit {
  @Input() user: User | null = null;
  @Input() loading = false;
  @Output() formSubmit = new EventEmitter<User>();
  @Output() cancelForm = new EventEmitter<void>();

  userForm!: FormGroup;
  isEditMode = false;
  submitAttempted = false;

  private fb = inject(NonNullableFormBuilder);

  ngOnInit(): void {
    this.isEditMode = !!this.user;
    console.log('Form initialized in edit mode:', this.isEditMode);
    console.log('User data:', this.user);
    this.initForm()

    if (this.user) {
      this.userForm.patchValue(this.user);
    }
  }

  initForm(): void {
    this.userForm = this.fb.group({
      id: [this.user?.id || null],
      name: this.fb.control('', [Validators.required, Validators.minLength(3)]),
      username: this.fb.control('', [Validators.required, Validators.minLength(3)]),
      email: this.fb.control('', [Validators.required, Validators.email]),
      phone: this.fb.control('', [Validators.required]),
      website: this.fb.control(''),
      address: this.fb.group({
        street: this.fb.control('', [Validators.required]),
        suite: this.fb.control(''),
        city: this.fb.control('', [Validators.required]),
        zipcode: this.fb.control('', [Validators.required]),
        geo: this.fb.group({
          lat: this.fb.control('0'),
          lng: this.fb.control('0')
        })
      }),
      company: this.fb.group({
        name: this.fb.control('', [Validators.required]),
        catchPhrase: this.fb.control(''),
        bs: this.fb.control('')
      })
    });
  }

  onSubmit(): void {
    this.submitAttempted = true;

    if (this.userForm.valid) {
      const formValue = this.userForm.value;

      if (!this.isEditMode && !formValue.id) {
        formValue.id = Math.floor(Math.random() * 1000) + 10;
      }

      this.formSubmit.emit(formValue);
    } else {
      this.userForm.markAllAsTouched();
      this.markFormGroupTouched(this.userForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      control.markAsDirty();
      control.updateValueAndValidity({onlySelf: true});

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    })
  }

  onCancel(): void {
    this.cancelForm.emit();
  }

  getErrorMessage(controlName: string): string {
    const control = this.userForm.get(controlName);
    if (control?.hasError('required')) {
      return 'Это поле обязательно';
    }
    if (control?.hasError('email')) {
      return 'Некорректный формат email';
    }
    if (control?.hasError('minlength')) {
      return `Минимальная длина ${control.getError('minlength').requiredLength} символов`;
    }
    return '';
  }

  getAddressErrorMessage(controlName: string): string {
    const control = this.userForm.get(`address.${controlName}`);
    if (control?.hasError('required')) {
      return 'Это поле обязательно';
    }
    return '';
  }

  getCompanyErrorMessage(controlName: string): string {
    const control = this.userForm.get(`company.${controlName}`);
    if (control?.hasError('required')) {
      return 'Это поле обязательно';
    }
    return '';
  }
}
