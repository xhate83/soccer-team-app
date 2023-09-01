import { Component, inject, Inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'app-confitmation',
  templateUrl: './confitmation.component.html',
  standalone: true,
  imports: [MatIconModule, MatDialogModule, MatButtonModule],
})
export class ConfitmationComponent {

  dialogRef = inject(MatDialogRef<ConfitmationComponent>);

  constructor(@Inject(MAT_DIALOG_DATA) public text: string = '')
  {}
 
}
