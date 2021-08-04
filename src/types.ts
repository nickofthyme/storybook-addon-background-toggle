import { IconsProps } from "@storybook/components";

export interface Background {
  /**
   * id of the background
   */
  id: string;
  /**
   * Title of the background in background selector ui
   *
   * @default {@link Background#id}
   */
  title?: string;
  /**
   * Background string to be applied to targeted element(s) via selector(s)
   * See https://developer.mozilla.org/en-US/docs/Web/CSS/background
   *
   * @default {@link Background#color}
   */
  background?: string;
  /**
   * Adds the `!important` flag to the background style definition
   * See https://www.w3schools.com/css/css_important.asp
   *
   * @default false
   */
  important?: boolean;
  /**
   * Badge color in the background selector ui, also used as default background property
   * Can be any valid background string.
   * See https://developer.mozilla.org/en-US/docs/Web/CSS/background
   */
  color: string;
}

export interface Parameters {
  /**
   * Ignores global values in url params
   *
   * @default true
   */
  ignoreQueryParams?: false;
  /**
   * Tefault background id
   */
  default?: string;
  /**
   * Background options to be applied
   */
  options: Background[];
  /**
   * Selected background is clearable
   *
   * @default true
   */
  clearable?: boolean;
  /**
   * Disable addon at story level
   *
   * @default false
   */
  disable?: boolean;
  /**
   * Persist background selection between stories
   *
   * @default false
   */
  persist?: boolean;
  /**
   * Blur tooltip on background selection
   *
   * @default true
   */
  blurOnSelect?: boolean;
  /**
   * Override icon used in toolbar
   * See https://next--storybookjs.netlify.app/official-storybook/?path=/story/basics-icon--labels
   *
   * @default 'mirror'
   */
  icon?: IconsProps['icon'];
  /**
   * A callback that will be executed when the background changes
   */
  onChange?: (background: Background) => void;
  /**
   * Target element selector(s) to apply class(es)
   *
   * @default 'body'
   */
  selector?: string | string[];
}

/**
 * Parameters to be applied **gloabally** to configure background for background addon
 */
export interface BackgroundParameter {
  background?: Parameters;
}

/**
 * Parameters to be applied at a **story level** to configure background for background addon
 *
 * This is just type omition to somewhat prevent users from defining parameters that
 * could negatively affect the addon behaviour across all stories.
 */
 export interface StoryBackgroundParameter {
  background?: Pick<Parameters, 'default' | 'blurOnSelect' | 'disable' | 'ignoreQueryParams' | 'clearable'>;
}
