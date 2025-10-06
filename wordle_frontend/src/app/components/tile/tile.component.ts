import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { LetterStatus } from '../../models/game.types';

@Component({
  selector: 'app-tile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tile.component.html',
  styleUrl: './tile.component.css',
})
export class TileComponent {
  @Input({ required: true }) letter: string = '';
  @Input({ required: true }) status: LetterStatus = 'empty';
  @Input() position: number = 0; // index in row (for aria-posinset)
}
