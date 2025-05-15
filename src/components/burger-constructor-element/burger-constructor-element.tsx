import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch } from '../../services/store';
import { moveDownIngredient, moveUpIngredient, removeIngredient } from '../../services/slices/BurgerConstructorSlice';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {

    const dispath = useDispatch();

    const handleMoveDown = () => {
      dispath(moveUpIngredient(index));
    };

    const handleMoveUp = () => {
      dispath(moveDownIngredient(index));
    };

    const handleClose = () => {
      dispath(removeIngredient(ingredient));
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
  }
);
