import { Component, inject, OnInit, Renderer2, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { getRepoDirectoryContents } from '../services/github';

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

    const image_thumbnails: HTMLElement | null = document.getElementById("image-thumbs");
    if (image_thumbnails) {
        getRepoDirectoryContents(image_folder).then(files => {
          files.forEach((file: any) => {
              const filename : string = file.download_url;
              // console.log(filename);
              if (filename.endsWith('png')) {
                  image_path_names.push(filename);
              }
          });

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