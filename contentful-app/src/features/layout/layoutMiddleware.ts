import type { Middleware } from '@reduxjs/toolkit';
import { updateHistory, reorderComponents, addComponent } from './layoutSlice';

export const layoutMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);

  if (reorderComponents.match(action) || addComponent.match(action)) {
    store.dispatch(updateHistory());
  }

  return result;
}; 