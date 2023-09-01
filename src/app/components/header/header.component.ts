import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [MatIconModule],
})
export class HeaderComponent {

  @Input() text: string = '';
  @Input() icon: string = '';
 
}
