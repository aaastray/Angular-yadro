import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzMessageModule} from 'ng-zorro-antd/message';
import {UserFormComponent} from '../../components/userForm/userForm.component';
import {User} from '../../data/domain/user';
import {UsersService} from '../../data/services/users.service';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [
    CommonModule,
    UserFormComponent,
    NzMessageModule
  ],
  template: `
    <app-user-form
      *ngIf="user"
      [user]="user"
      [loading]="loading"
      (formSubmit)="updateUser($event)"
      (cancelForm)="navigateToUserDetail()">
    </app-user-form>
  `
})
export class UserEditComponent implements OnInit {
  userId: number | null = null;
  user: User | null = null;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usersService: UsersService,
    private message: NzMessageService
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.userId = +id;
        this.loadUserDetails(this.userId);
      } else {
        this.navigateToUsersList();
      }
    });
  }

  loadUserDetails(id: number): void {
    this.loading = true;

    this.usersService.getUserById(id).subscribe({
      next: (user) => {
        this.user = user;
        console.log('Данные о пользователе получены')
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error('Ошибка при загрузке данных пользователя:', err);
        this.message.error('Не удалось загрузить данные пользователя');
        this.navigateToUsersList();
      }
    });
  }

  updateUser(user: User): void {
    this.loading = true;

    this.usersService.updateUser(user).subscribe({
      next: (updatedUser) => {
        this.loading = false;
        this.message.success('Пользователь успешно обновлен');
        this.router.navigate(['/users', updatedUser.id]);
      },
      error: (error) => {
        this.loading = false;
        console.error('Ошибка при обновлении пользователя:', error);
        this.message.error('Произошла ошибка при обновлении пользователя');
      }
    });
  }

  navigateToUserDetail(): void {
    if (this.userId) {
      this.router.navigate(['/users', this.userId]);
    } else {
      this.navigateToUsersList();
    }
  }

  navigateToUsersList(): void {
    this.router.navigate(['/users']);
  }
}
