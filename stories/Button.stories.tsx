import React from "react";
import { Button } from "./Button";

export default {
  title: "Button",
  component: Button,
  parameters: {},
};

const Example = () => {
  const setBackground = (backgroundId?: string) => () => {
    console.log(backgroundId);

    const urlString = window.parent.location.toString();
    const url = new URL(urlString);
    url.searchParams.delete('globals');

    if (backgroundId) {
      url.searchParams.append('globals', `background:${backgroundId}`);
    }

    const newUrl = url.toString();

    if (newUrl !== urlString) {
      window.parent.location.replace(newUrl);
    }
  }

  return (
    <div>
      <Button onClick={setBackground('white')}>Set url background param to white</Button>
      <Button onClick={setBackground('black')}>Set url background param to black</Button>
      <Button onClick={setBackground()}>Clear url background param</Button>
    </div>
  );
};

export const Example1 = Example.bind({});
Example1.storyName = 'Global defaults'

export const Example2 = Example.bind({});
Example2.storyName = 'Story level overrides'
Example2.parameters = {
  background: {
    default: 'black',
  }
};

