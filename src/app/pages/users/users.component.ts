import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NzBreadCrumbModule} from 'ng-zorro-antd/breadcrumb';
import {UsersService} from '../../data/services/users.service';
import {User} from '../../data/domain/user';
import {UserList} from '../../components/usersList/usersList.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    NzLayoutModule,
    NzBreadCrumbModule,
    UserList
  ],
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {
  users: User[] = [];

  constructor(private usersService: UsersService) {
  }

  ngOnInit(): void {
    this.usersService.getAllUsers()
      .subscribe({
        next: (data) => {
          this.users = data;
          console.log(this.users);
        },
        error: (error) => {
          console.error('Произошла ошибка при получении пользователей:', error);
        }
      });
  }
}
