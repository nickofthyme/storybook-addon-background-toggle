import { Icons } from '@storybook/components';
import { styled } from '@storybook/theming';

import React from 'react'

interface Props {
  background: string;
  important?: boolean;
}

export const Color = ({ background, important }: Props) => {
  return (
    <Container>
      {important && (
        <div title="!important">
          <StyledIcon icon="alert" />
        </div>
      )}
      <Background background={background} />
    </Container>
  );
}

export const Container = styled.div`
  display: flex;
`;

export const StyledIcon = styled(Icons)`
  margin-right: 0.5rem !important;
  opacity: 1 !important;
  fill: #FF4C29;
`;

export const Background = styled.div(
  ({ background }: { background: string }) => ({
    borderRadius: '1rem',
    height: '1rem',
    width: '1rem',
    position: 'relative',
    background,
  }),
  ({ theme: { appBorderColor } }) => ({
    boxShadow: `${appBorderColor} 0 0 0 1px inset`,
  })
);
