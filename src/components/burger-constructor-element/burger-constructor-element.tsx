import { BurgerConstructorElementUI } from '@ui';
import { memo } from 'react';

import type { BurgerConstructorElementProps } from './type';
import { useDispatch } from '@/services/store';
import {
  moveDownConstructorItems,
  moveUpConstructorItems,
  removeConstructorItems,
} from '@/services/slices/constructorSlice';

export const BurgerConstructorElement = memo(function BurgerConstructorElement({
  ingredient,
  index,
  totalItems,
}: BurgerConstructorElementProps): React.JSX.Element {
  const dispatch = useDispatch();
  const handleMoveDown = (): void => {
    dispatch(moveDownConstructorItems(ingredient.id));
    // TODO
  };

  const handleMoveUp = (): void => {
    dispatch(moveUpConstructorItems(ingredient.id));
    // TODO
  };

  const handleClose = (): void => {
    dispatch(removeConstructorItems(ingredient.id));
    // TODO
  };

  return (
    <BurgerConstructorElementUI
      ingredient={ingredient}
      index={index}
      totalItems={totalItems}
      handleMoveUp={handleMoveUp}
      handleMoveDown={handleMoveDown}
      handleClose={handleClose}
    />
  );
});
