import React, { useEffect, useMemo } from 'react'
import { DecoratorFunction, useParameter } from '@storybook/addons';

import { Parameters } from '../types';

const getTargetSelector = ({ selector }: Parameters) => (Array.isArray(selector) ? selector.join(', ') : selector) ?? 'body';

/**
 * Decorator to handle applying background style to elements.
 *
 * Note: Does not remove styles, so changing selectors outside of the global parameters
 * could cause issues.
 */
export const BackgroundDecorator: DecoratorFunction<JSX.Element> = (Story, context) => {
  const backgroundParams = useParameter<Parameters | null>('background', null);
  const selectedId: string = context.globals.background ? String(context.globals.background) : undefined;
  const background = useMemo(
    () => (backgroundParams?.options ?? []).find(({ id }) => id === selectedId),
    [backgroundParams, selectedId]
  );

  useEffect(() => {
    const targets = backgroundParams && document.querySelectorAll<HTMLElement>(getTargetSelector(backgroundParams));

    if (targets) {
      const backgroundStyle = background?.background ?? background?.color ?? '';
      const flag = backgroundStyle && background?.important ? 'important' : '';

      targets.forEach((e) => {
        e.style.setProperty('background', backgroundStyle, flag);
      });
    }
  }, [background, backgroundParams]);

  return <Story {...context} />
}
