import { ApplicationConfig, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { getRepoPathContents } from '../services/github';
import { App } from './app';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideAppInitializer(() => {
        return getRepoPathContents("cards").then(async card_folders => {
          const subfolder_promises = []
          for (const card_folder of card_folders) {
            if (card_folder.name.startsWith("_")) {
              continue;
            }
            subfolder_promises.push(
              getRepoPathContents(card_folder.path).then(characters => {
                  for (const character of characters) {
                    if (character.name.startsWith("_")) {
                        continue;
                    }
                    App.CUSTOM_PATH_MAP.set(character.name, character.path + "/");
                  }
              })
            );
          }
          await Promise.all(subfolder_promises);
        });
    })
  ]
};
