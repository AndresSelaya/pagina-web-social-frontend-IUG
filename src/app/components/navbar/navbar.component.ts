import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../../authentication/services/auth.service';
import { PostService } from '../../posts/services/post.service';
import { Institution } from '../../posts/models/institution';
import { CommentService } from '../../comments/services/comment.service';
import { Modal } from 'bootstrap';
import { environment } from '../../../environments/environment';
import { UserDetail } from '../../posts/models/user-detail';
import { TranslateService, TranslatePipe, TranslateDirective } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [TranslatePipe, TranslateDirective]
})
export class NavbarComponent {
  authenticated: boolean = false;
  institution!: Institution
  isMenuOpen = false;
  user!: UserDetail
  counterModeratedComments: number = 0;
  public selectedLanguage: string = '';

  @ViewChild('moderateCommentModal') modalElement!: ElementRef;

  constructor(
    private authService: AuthService,
    private postService: PostService,
    private commentService: CommentService,
    private translate: TranslateService
  ){
    this.translate.addLangs(['de', 'es', 'en']);
    this.translate.setDefaultLang('de');
    this.translate.use('de');
  }
  
  ngOnInit() {
    this.selectedLanguage = 'de';
    this.authenticated = this.authService.isAuthenticated();
    this.getInstitution();
    this.getUser();
    this.totalModeratedComments();
  }

  getInstitution() {
    const uuid = `${environment.INSTITUTION_ID}`;;
    this.postService.getInstitution(uuid).subscribe({
      next: (institutionData) => {
        this.institution = institutionData;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  getUser() {
    if (this.authenticated) {
      this.postService.getUser().subscribe({
        next: (infoUser) => {
          this.user = infoUser;
        },
        error: (error) => {
          console.log('Error al obtener al user', error);
        }
      })
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(){
    this.authService.logout();
    window.location.reload();
  }

  createAccount(){}

  totalModeratedComments() {
    this.commentService.countModeratedComments().subscribe((total) => {
      console.log(total);
      this.counterModeratedComments = total;
    });
  }

  showModeratedComments() {
    const modal = new Modal(document.getElementById('moderateCommentModal')!);
    modal.show();
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
    this.selectedLanguage = lang;
  }
}
