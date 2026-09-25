import { Component, inject, OnInit, Renderer2, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App implements OnInit {
  protected readonly title = signal("Serp's Exceed Customs");
  protected readonly renderer2 = inject(Renderer2);

  ngOnInit() {
  }
}