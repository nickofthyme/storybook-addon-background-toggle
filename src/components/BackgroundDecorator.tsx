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
  const selectedId = context.globals.background ? String(context.globals.background) : undefined;
  const background = useMemo(
    () => (backgroundParams?.options ?? []).find(({ id }) => id === selectedId),
    [backgroundParams, selectedId]
  );
  const targets = useMemo(() => {
    if (!backgroundParams) return null;
    const selector = (Array.isArray(backgroundParams.selector) ? backgroundParams.selector.join(', ') : backgroundParams.selector) ?? 'body';
    return selector ? document.querySelectorAll<HTMLElement>(selector) : null;
  }, [backgroundParams])

  useEffect(() => {
    if (targets) {
      const backgroundStyle = background?.background ?? background?.color ?? '';
      const flag = backgroundStyle && background?.important ? 'important' : '';

      targets.forEach((e) => {
        e.style.setProperty('background', backgroundStyle, flag);
      });
    }
  }, [background, targets]);

  return <Story {...context} />
}
