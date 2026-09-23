import { Routes } from '@angular/router';
import { CharacterGallery } from '../components/character_gallery/character_gallery';
import { BasicCharacterList } from '../components/basic_list/basic_list';

export const routes: Routes = [
    {
        path: 'character/:id',
        component: CharacterGallery,
    },
    {
        path: '',
        component: BasicCharacterList,
    },
];
