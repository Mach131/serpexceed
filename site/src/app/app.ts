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
    // Initialize theme on page load
    document.addEventListener('DOMContentLoaded', () => {
      const theme = this.getTheme();
      this.setTheme(theme);
      
      // Add toggle listener
      const toggle = document.getElementById('themeToggle');
      toggle?.addEventListener('click', () => this.toggleTheme());
    });
  }

  // Get saved theme or default to system preference
  private getTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'dark' 
      : 'light';
  }

  // Apply theme
  private setTheme(theme : string) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update toggle button
    this.updateThemeToggle(theme);
  }

  // Toggle between themes
  private toggleTheme() {
    const currentTheme = this.getTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  // Update button appearance
  private updateThemeToggle(theme : string) {
    const lightIcon : any = document.querySelector('.light-icon');
    const darkIcon : any = document.querySelector('.dark-icon');
    
    if (theme === 'dark') {
      lightIcon.style.display = 'none';
      darkIcon.style.display = 'block';
    } else {
      lightIcon.style.display = 'block';
      darkIcon.style.display = 'none';
    }
  }
}