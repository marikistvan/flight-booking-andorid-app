import { Component, Input } from '@angular/core'
import { Blog } from '~/app/models/blog';
import { AuthService } from '~/app/services/auth.service';

@Component({
  selector: 'ns-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
})
export class BlogComponent {
  @Input({ required: true }) blog!: Blog;

  constructor(public authService: AuthService){}

}
