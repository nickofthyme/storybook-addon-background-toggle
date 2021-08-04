import React, { ComponentProps, FC } from 'react'
import { TooltipLinkList, Icons } from '@storybook/components';

import { Parameters, Background } from '../types';
import { Color } from './Color';

type Link = ComponentProps<typeof TooltipLinkList>['links'][number];

interface Props {
  selected?: Background;
  setBackground: (backgroundId?: string, toggleTooltip?: boolean) => void;
  backgroundParams: Parameters;
}

export const Tooltip: FC<Props> = ({ selected, setBackground, backgroundParams }) => {
  const links: Link[] = backgroundParams.options.map(({ id, title, color, important }) => ({
    id,
    key: id,
    title: title ?? id,
    active: selected && id === selected.id,
    onClick: () => setBackground(id),
    right: <Color background={color} important={important} />
  }));

  if (selected && (backgroundParams.clearable ?? true)) {
    links.unshift(getClearLink(setBackground));
  }

  return <TooltipLinkList links={links} />
}

const getClearLink = (setBackground: (backgroundId?: string, toggleTooltip?: boolean) => void): Link => {
  const id = '__clearable__link___';
  return {
    id,
    key: id,
    loading: false,
    title: 'Clear selected background',
    active: false,
    onClick: () => setBackground(),
    right: <Icons icon="cross" />
  }
};
