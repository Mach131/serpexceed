import { ChangeDetectorRef, Component, inject, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CUSTOM_DATA_MAP } from '../../combined_meta_json';

@Component({
  imports: [RouterLink, RouterOutlet, CommonModule],
  selector: 'basic_list',
  styleUrl: './basic_list.css',
  templateUrl: './basic_list.html',
})
export class BasicCharacterList implements OnInit {
  protected readonly renderer2 = inject(Renderer2);
  protected readonly activatedRoute = inject(ActivatedRoute);
  protected readonly changeDetector = inject(ChangeDetectorRef);

  public character_path_map = new Map();
  public category_list = new Map();

  public category_order : string[] = [];

  ngOnInit() {
    for (const char_id in CUSTOM_DATA_MAP) {
      const char_meta = CUSTOM_DATA_MAP[char_id];
      const char_name = char_meta.name;
      const char_category = char_meta.category;

      if (!this.category_list.has(char_category)) {
        this.category_list.set(char_category, []);
        if (char_category !== "Joke" && char_category !== "Other") {
          this.category_order.push(char_category);
        }
      }
      this.category_list.get(char_category).push(char_name);

      this.character_path_map.set(char_name, `/character/${char_id}`);
    }

    for (const char_list of this.category_list.values()) {
      char_list.sort();
    }
    this.category_order.sort();
    this.category_order.push("Other");
    this.category_order.push("Joke");
  }
}