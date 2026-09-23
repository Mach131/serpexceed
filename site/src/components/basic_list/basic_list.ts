import { ChangeDetectorRef, Component, inject, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { getRepoPathContents } from '../../services/github';
import { IMAGE_URL_PREFIX, KNOWN_NAME_MAP } from '../../constants';
import { App } from '../../app/app';
import { CommonModule } from '@angular/common';

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
  public character_name_list : string[] = [];

  ngOnInit() {
    for (const char_id of App.CUSTOM_PATH_MAP.keys()) {
      const char_name = KNOWN_NAME_MAP.get(char_id.toString()) ?? char_id.toString();
      this.character_name_list.push(char_name);
      this.character_path_map.set(char_name, `/character/${char_id}`);
    }

    this.character_name_list.sort((c1, c2) => {
      const j_c1 = c1.indexOf("[Joke]") != -1 ? -1 : 1;
      const j_c2 = c2.indexOf("[Joke]") != -1 ? -1 : 1;
      if (j_c1 * j_c2 == -1) { return j_c2 - j_c1; }

      const s_c1 = c1.lastIndexOf('(');
      const s_c2 = c2.lastIndexOf('(');
      const m_c1 = c1.substring(s_c1 == -1 ? 0 : s_c1);
      const m_c2 = c2.substring(s_c2 == -1 ? 0 : s_c2);
      if (m_c1 !== m_c2) {
        return m_c1.localeCompare(m_c2);
      }
      return c1.localeCompare(c2);
    })
  }
}