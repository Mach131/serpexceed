import { ChangeDetectorRef, Component, inject, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { getRepoPathContents } from '../../services/github';
import { IMAGE_URL_PREFIX } from '../../constants';
import { CUSTOM_DATA_MAP } from '../../combined_meta_json';

@Component({
  imports: [RouterOutlet],
  selector: 'character',
  styleUrl: './character_gallery.css',
  templateUrl: './character_gallery.html',
})
export class CharacterGallery implements OnInit {
  protected readonly renderer2 = inject(Renderer2);
  protected readonly activatedRoute = inject(ActivatedRoute);
  protected readonly changeDetector = inject(ChangeDetectorRef);

  public character_name : string = ""
  public character_description : string = ""

  ngOnInit() {
    const character_id = this.activatedRoute.snapshot.paramMap.get('id');
    // todo: probably get and set the name/description from the global map if possible
    if (character_id) {
      setupImageLoader(this.renderer2, character_id, this.changeDetector, this);
    }
  }
}

function setupImageLoader(renderer2 : Renderer2, character_id : string, change_detector : ChangeDetectorRef, gallery : CharacterGallery) {
  const char_meta = CUSTOM_DATA_MAP[character_id];
  const char_folder : string | undefined = char_meta['_folder_path'];
  if (!char_folder) {
    return ;
  }
  
  // metadata and extra images
  const sort_order : string[] = char_meta.sort_order;
  const omit_cards : string[] = char_meta.omit_cards ?? [];
  const image_path_names : string[] = [];
  for (const extra_card of char_meta.extra_cards) {
    image_path_names.push(IMAGE_URL_PREFIX + extra_card);
  }

  const image_thumbnails: HTMLElement | null = document.getElementById("image-thumbs");
  if (image_thumbnails) {
      gallery.character_name = char_meta.name;
      gallery.character_description = char_meta.description;
      change_detector.detectChanges();

      const newest_version = char_meta._most_recent_version;
      const image_folder = char_folder + "/" + newest_version;

      // card images
      getRepoPathContents(image_folder).then(files => {
        files.forEach((file: any) => {
          const filename : string = file.download_url;
          if (filename && filename.endsWith('png') && omit_cards.indexOf(filename.substring(filename.lastIndexOf('/')+1)) == -1) {
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
    });
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