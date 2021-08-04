import { BackgroundParameter } from '../src/types';
import { Decorator } from './Decorator';

import './styles.css'

export const decorators = [Decorator];

export const parameters: BackgroundParameter = {
  background: {
    default: 'white',
    selector: ['body', '#custom-bg'],
    blurOnSelect: true,
    onChange(background) {
      console.log('Background changed:');
      console.log(background);
    },
    ignoreQueryParams: false,
    persist: false,
    options: [
      {
        id: 'white',
        title: 'White',
        color: '#fff',
      },
      {
        id: 'hexEEEEEE',
        title: '#EEEEEE',
        color: '#EEEEEE',
      },
      {
        id: 'hexEFB7B7',
        title: '#EFB7B7',
        color: '#EFB7B7',
      },
      {
        id: 'hexBD4B4B',
        title: '#BD4B4B',
        color: '#BD4B4B',
      },
      {
        id: 'hex334756',
        title: '#334756',
        color: '#334756',
      },
      {
        id: 'black',
        title: 'Black',
        color: '#000',
      },
      {
        id: 'black-important',
        title: 'Black - Important',
        important: true,
        color: '#000',
      },
      {
        id: 'raindow',
        title: 'Raindow',
        background: 'linear-gradient(to right, red,orange,yellow,green,blue,indigo,violet)',
        color: 'linear-gradient(to right, red,orange,yellow,green,blue,indigo,violet)',
      },
    ],
  }
};


