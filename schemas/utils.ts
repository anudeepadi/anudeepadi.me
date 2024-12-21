import React from 'react';
import { IconType } from 'react-icons';

export const defineIcon = (Icon: IconType) => {
  return React.createElement(Icon);
}