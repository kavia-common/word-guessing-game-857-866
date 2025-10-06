import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { Subscription } from 'rxjs';

interface ToastItem { id: number; text: string; }

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
})
export class ToastComponent implements OnInit, OnDestroy {
  private readonly game = inject(GameService);
  private sub?: Subscription;
  toasts: ToastItem[] = [];
  private nextId = 1;

  ngOnInit(): void {
    this.sub = this.game.toast$.subscribe((msg) => {
      const id = this.nextId++;
      this.toasts = [...this.toasts, { id, text: msg }];
      // Auto hide after 2.5s (use globalThis to appease strict lint in SSR/TS)
      const g: any = globalThis as any;
      g.setTimeout(() => this.dismiss(id), 2500);
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  // PUBLIC_INTERFACE
  /** Dismiss a toast by id. */
  dismiss(id: number): void {
    this.toasts = this.toasts.filter((t) => t.id !== id);
  }

  trackById = (_: number, item: ToastItem) => item.id;
}
