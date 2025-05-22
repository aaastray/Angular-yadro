import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CommonModule} from '@angular/common';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {UserDetailComponent} from '../../components/userDetail/userDetail.component';
import {User} from '../../data/domain/user';
import {UsersService} from '../../data/services/users.service';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, NzButtonModule, UserDetailComponent],
  templateUrl: 'userInfo.component.html',
})
export class UserInfoComponent implements OnInit {
  userId: string | null = null;
  user: User | null = null;
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('id');
      if (this.userId) {
        this.getUserById(parseInt(this.userId, 10));
      }
    });
  }

  getUserById(id: number): void {
    this.loading = true;
    this.error = null;

    this.usersService.getUserById(id).subscribe({
      next: (data) => {
        this.user = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Произошла ошибка при получении пользователя: ' + error.message;
        this.loading = false;
        console.error('Произошла ошибка при получении пользователя:', error);
      }
    });
  }

  goBack(): void {
    window.history.back();
  }
}
