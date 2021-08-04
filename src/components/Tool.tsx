import React, { useEffect, useCallback, useState, useRef, FC } from "react";
import { API, useGlobals, useParameter } from "@storybook/api";
import { Icons, IconButton, WithTooltip } from '@storybook/components';

import { TOOL_ID } from "../constants";
import { Parameters } from '../types';
import { Tooltip } from "./Tooltip";
import { CURRENT_STORY_WAS_SET, SET_STORIES } from "@storybook/core-events";

interface Props {
  api: API;
}

const iconBtnId = "sotrybook-addon-background-toggle-icon-btn";

export const Tool: FC<Props> = ({ api }) => {
  const [expanded, setExpanded] = useState(false);
  const [globals, updateGlobals] = useGlobals();
  const selectedId = globals.background ? String(globals.background) : undefined;
  const backgroundParams = useParameter<Parameters | null>('background', null);

  const backgroundParamsRef = useRef(backgroundParams);
  useEffect(() => {
    backgroundParamsRef.current = backgroundParams;
  }, [backgroundParams])

  const getBackground = useCallback(
    (backgroundId?: string) => (backgroundParams?.options ?? []).find(({ id }) => id === (backgroundId ?? selectedId)),
    [backgroundParams, selectedId]
  );

  const setBackground = useCallback(
    (backgroundId?: string, forcedUpdate = false) => {
      if (backgroundId !== selectedId) {
        const newBackground = getBackground(backgroundId ?? '');
        backgroundParams?.onChange?.(newBackground);
        updateGlobals({ background: backgroundId })
      }

      // This is needed because storybook `WithTooltip` component does not
      // honor the `tooltipShown` prop to control its visibility
      if (!forcedUpdate && (backgroundParams?.blurOnSelect ?? true)) {
        const iconBtn = document.querySelector<HTMLButtonElement>(`#${iconBtnId}`);
        iconBtn?.click?.();
      }
    },
    [updateGlobals, selectedId, getBackground]
  );

  useEffect(() => {
    const setDefaultBackground = () => {
      const value = backgroundParamsRef.current?.persist ? selectedId : backgroundParamsRef.current?.default
      setBackground(value, true);
    };
    api.on(CURRENT_STORY_WAS_SET, setDefaultBackground);
    return () => api.off(CURRENT_STORY_WAS_SET, setDefaultBackground);
  }, [backgroundParamsRef, selectedId]);

  useEffect(() => {
    const setInitialBackground = () => {
      if (backgroundParamsRef.current && !selectedId) {
        const backgroundId = getBackgroundFromUrl(backgroundParamsRef.current) ?? backgroundParamsRef.current?.default;
        updateGlobals({ background: backgroundId })
      }
    };
    api.on(SET_STORIES, setInitialBackground);
    return () => api.off(SET_STORIES, setInitialBackground);
  }, [])

  if (!backgroundParams || backgroundParams.disable || backgroundParams.options?.length === 0) return null;

  const background = getBackground();

  return (
    <WithTooltip
      placement="top"
      trigger="click"
      startOpen={false}
      tooltipShown={expanded}
      onVisibilityChange={setExpanded}
      tooltip={
        <Tooltip
          selected={background}
          backgroundParams={backgroundParams}
          setBackground={setBackground}
        />
      }
    >
      <IconButton
        id={iconBtnId}
        key={TOOL_ID}
        active={Boolean(background)}
        title="Select background"
        onClick={() => setExpanded(true)}
      >
        <Icons icon={backgroundParams.icon ?? 'mirror'} />
      </IconButton>
    </WithTooltip>
  );
};

/**
 * Strip and validate background id from globals query param
 * This is needed as the initial globals are ALWAYS empty
 */
function getBackgroundFromUrl({ options, ignoreQueryParams }: Parameters) {
  if (ignoreQueryParams ?? true) return null;

  const re = /background:([^;]*)/;
  const globals = new URL(window.location.toString()).searchParams.get('globals') ?? '';
  const [, backgroundId] = re.exec(globals) ?? [];
  return options.find(({ id }) => id === backgroundId) ? backgroundId : (re.test(globals) ? '' :  null);
}
