import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzMessageModule} from 'ng-zorro-antd/message';
import {UserFormComponent} from '../../components/userForm/userForm.component';
import {User} from '../../data/domain/user';
import {UsersService} from '../../data/services/users.service';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [
    CommonModule,
    UserFormComponent,
    NzMessageModule
  ],
  template: `
    <app-user-form
      [loading]="loading"
      (formSubmit)="createUser($event)"
      (cancelForm)="navigateToUsersList()">
    </app-user-form>
  `
})
export class UserCreateComponent {
  loading = false;

  constructor(
    private usersService: UsersService,
    private router: Router,
    private message: NzMessageService
  ) {
  }

  createUser(user: User): void {
    this.loading = true;

    this.usersService.createUser(user).subscribe({
      next: (createdUser) => {
        this.loading = false;
        this.message.success('Пользователь успешно создан');
        this.router.navigate(['/users', createdUser.id]);
      },
      error: (error) => {
        this.loading = false;
        console.error('Ошибка при создании пользователя:', error);
        this.message.error('Произошла ошибка при создании пользователя');
      }
    });
  }

  navigateToUsersList(): void {
    this.router.navigate(['/users']);
  }
}
