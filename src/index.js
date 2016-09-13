import React from 'react';
import ReactDOM from 'react-dom';
import Idora from './App';
import './index.css';

function gen_random_carousel_items(num) {
  var carousel_items = [], height, width, i, new_carousel_item;

  for (i = 0; i <= num; i++) {
    height = 100 + Math.round(Math.random() * 80)
    width = 100 + Math.round(Math.random() * 150)
    new_carousel_item = {
       'src': `https://placekitten.com/${width}/${height}`,
    }
    if (i % 2 === 0) {
      new_carousel_item.txt = `Cat is napping ${i}`
    }
    carousel_items.push(new_carousel_item)
  }

  return carousel_items;
}

ReactDOM.render(
  <Idora carousel_items={gen_random_carousel_items(10)}/>,
  document.getElementById('root')
);
