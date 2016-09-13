import React from 'react';
import ReactDOM from 'react-dom';
import Idora from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Idora carousel_items={[]}/>, div);
});
