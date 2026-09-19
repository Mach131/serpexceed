import { Component, inject, OnInit, Renderer2, signal } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { getRepoPathContents } from '../../services/github';

@Component({
  imports: [RouterOutlet],
  selector: 'character',
  styleUrl: './character_gallery.css',
  templateUrl: './character_gallery.html',
})
export class CharacterGallery implements OnInit {
  protected readonly title = signal('Character Gallery');
  protected readonly renderer2 = inject(Renderer2);

  private activatedRoute = inject(ActivatedRoute);

  ngOnInit() {
    const character_id = this.activatedRoute.snapshot.paramMap.get('id');
    if (character_id) {
      setupImageLoader(this.renderer2, character_id);
    }
  }
}

const image_prefix = "https://raw.githubusercontent.com/Mach131/serpexceed/master/"


function setupImageLoader(renderer2 : Renderer2, character_id : string) {
  const char_folder : string = `cards/pokemon/${character_id}/`; // TODO: prob need a big route list under app, along with other constants
  const image_path_names : string[] = [];
  const sort_order : string[] = [];
  const omit_cards : string[] = [];

  const image_thumbnails: HTMLElement | null = document.getElementById("image-thumbs");
  if (image_thumbnails) {
    // metadata and extra images
    getRepoPathContents(char_folder + "_meta.json").then(result => {
      const jsonString = atob(result.content);
      const jsonObject = JSON.parse(jsonString);
      for (const extra_card of jsonObject.extra_cards) {
        image_path_names.push(image_prefix + extra_card);
      }
      sort_order.push(...jsonObject.sort_order);
      if (jsonObject.omit_cards) {
        omit_cards.push(...jsonObject.omit_cards);
      }

      // version check
      getRepoPathContents(char_folder).then(folder_contents => {
        console.log(folder_contents);
        let version_key_map = new Map();
        let version_list = [];
        for (const item of folder_contents) {
          if (item.name == "_meta.json") {
            continue;
          }
          const version_string : string = item.name.replace(/[^\d_]/g, "");
          version_key_map.set(item.name, version_string.replace(/d+/g, n => String(+n+100)));
          version_list.push(item.name);
        }
        const newest_version = version_list.sort((p1, p2) => {
          let diff = version_key_map.get(p1) - version_key_map.get(p2);
          if (diff == 0) {
            return p1.localeCompare(p2);
          }
          return diff;
        }).at(-1);
        let image_folder = char_folder + newest_version;

        // card images
        getRepoPathContents(image_folder).then(files => {
          files.forEach((file: any) => {
            const filename : string = file.download_url;
            if (filename.endsWith('png') && omit_cards.indexOf(filename.substring(filename.lastIndexOf('/')+1)) == -1) {
              image_path_names.push(filename);
            }
          });

          var sorted_paths = image_path_names.sort((p1, p2) => _getImageSortKey(p1, sort_order) - _getImageSortKey(p2, sort_order))
          for (const image_file of image_path_names) {
            var img_element : HTMLImageElement = renderer2.createElement("img");
            img_element.src = image_file;
            img_element.alt = "sample text";
            img_element.classList.add("card_image");
            img_element.onclick = ((elt) => {return () => elt.classList.toggle("full")})(img_element);
            image_thumbnails.appendChild(img_element);
          }
    })})});
  }
}

const _sortKeyCache : Map<string, number> = new Map();
function _getImageSortKey(image_name : string, sort_order : string[]) {
  const cached_key = _sortKeyCache.get(image_name);
  if (cached_key != undefined) {
    return cached_key;
  }

  const filename_part = image_name.substring(image_name.lastIndexOf("/") + 1);
  let result = sort_order.indexOf(filename_part);
  if (result == -1) {
    result = 999;
  }
  _sortKeyCache.set(image_name, result);
  return result;
}