import { Routes } from '@angular/router';
import { CharacterGallery } from '../components/character_gallery/character_gallery';

export const routes: Routes = [
    {
        path: 'character/:id',
        component: CharacterGallery,
    },
];
