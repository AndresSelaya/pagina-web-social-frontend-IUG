import { Component } from '@angular/core';
import { Institution } from '../../posts/models/institution';
import { PostService } from '../../posts/services/post.service';
import { Router } from '@angular/router';
import { Follower } from '../../posts/models/follower';
import { environment } from '../../../environments/environment';
import { UserDetail } from '../../posts/models/user-detail';
import { AuthService } from '../../authentication/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  uuidIntitutionDric = `${environment.INSTITUTION_ID}`;
  public currentUser!: UserDetail;
  public isAuthenticated: boolean = false;
  
  institution!: Institution
  totalFollowers: number = 127;

  isPostsRoute = false;

  constructor(
    private readonly postService: PostService, 
    private readonly router: Router,
    private readonly authService: AuthService
  ){}

  ngOnInit() {
    this.isAuthenticated = this.authService.isAuthenticated();
    if (this.isAuthenticated) {
      this.postService.getUser().subscribe({
        next: (responseUser) => {
          this.currentUser = responseUser;
        },
        error: (error) => {
          console.log('Error al obtener al user', error);
        }
      })
    }
    this.getInstitutionData(this.uuidIntitutionDric);
    this.getNumberFollowers(this.uuidIntitutionDric);
    this.router.events.subscribe(() => {
      this.isPostsRoute = this.router.url === '/posts';
    });
  }

  getInstitutionData(uuid: string) {
    this.postService.getInstitution(uuid).subscribe({
      next: (dataInstitution:Institution) => {
        this.institution = dataInstitution;
      },
      error(error){
        console.log(error)
      }
    })
  }

  getNumberFollowers(uuid: string) {
    this.postService.getNumberFollowers(uuid).subscribe({
      next: (numberFollowers: number) => {
        this.totalFollowers = numberFollowers;
      //next: (followers: Follower) => {
       // this.totalFollowers = followers.total_followers;
      }, error(error) {
        console.log(error);
      }
    });
  }

}
