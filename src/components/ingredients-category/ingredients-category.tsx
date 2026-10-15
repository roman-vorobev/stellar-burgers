import { IngredientsCategoryUI } from '@ui';
import { useMemo } from 'react';

import type { TIngredientsCategoryProps } from './type';
import type { TIngredient } from '@utils-types';
import { useSelector } from '@/services/store';
import { selectBun, selectItems } from '@/services/slices/constructorSlice';

export const IngredientsCategory = ({
  title,
  titleRef,
  ingredients,
  ref,
}: TIngredientsCategoryProps): React.JSX.Element => {
  // TODO: Взять переменную из стора
  const constructorItems = useSelector(selectItems);
  const bun = useSelector(selectBun);

  const ingredientsCounters = useMemo(() => {
    const counters: Record<string, number> = {};
    ingredients.forEach((ingredient: TIngredient) => {
      if (!counters[ingredient._id]) counters[ingredient._id] = 0;
      counters[ingredient._id]++;
    });
    if (bun) counters[bun._id] = 2;
    return counters;
  }, [constructorItems, bun]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
};
