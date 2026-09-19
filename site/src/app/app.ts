import { Component, inject, OnInit, Renderer2, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { getRepoPathContents } from '../services/github';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App implements OnInit {
  protected readonly title = signal('test_docs');
  protected readonly renderer2 = inject(Renderer2);

  ngOnInit() {
    setupImageLoader(this.renderer2);
  }
}


function setupImageLoader(renderer2 : Renderer2) {
  const image_folder = "cards/pokemon/serperior/v1_0_0/";
  const image_path_names : string[] = [];
  const sort_order : string[] = []

  const image_thumbnails: HTMLElement | null = document.getElementById("image-thumbs");
  if (image_thumbnails) {
    getRepoPathContents("cards/pokemon/serperior/_meta.json").then(result => {
      const jsonString = atob(result.content);
      const jsonObject = JSON.parse(jsonString);
      image_path_names.concat(jsonObject.extra_cards);
      sort_order.concat(jsonObject.sort_order);
    });

    getRepoPathContents(image_folder).then(files => {
      files.forEach((file: any) => {
        const filename : string = file.download_url;
        if (filename.endsWith('png')) {
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

  const filename_part = image_name.substring(image_name.lastIndexOf("/"));
  let result = sort_order.indexOf(filename_part);
  if (result == -1) {
    result = 999;
  }
  _sortKeyCache.set(image_name, result);
  return result;
}