import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Row as RowType, Tile as TileType } from '../../models/game.types';
import { TileComponent } from '../tile/tile.component';

@Component({
  selector: 'app-row',
  standalone: true,
  imports: [CommonModule, TileComponent],
  templateUrl: './row.component.html',
  styleUrl: './row.component.css',
})
export class RowComponent {
  @Input({ required: true }) row: RowType | null = null;
  @Input() currentInput: string | null = null;

  // Build the 5 tiles to render based on row or current input (pending row)
  get tiles(): TileType[] {
    if (this.row) {
      // Completed/locked row already has statuses
      return this.row;
    }
    const input = (this.currentInput ?? '').slice(0, 5);
    const tiles: TileType[] = Array.from({ length: 5 }, (_, i) => {
      const ch = input[i] ?? '';
      return { letter: ch, status: 'empty' };
    });
    return tiles;
  }

  trackByIndex = (i: number) => i;
}
