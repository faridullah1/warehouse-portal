import { Layout } from 'app/layout/layout.types';

// Types
export type Scheme = 'auto' | 'dark' | 'light';
export type Screens = { [key: string]: string };
export type Theme = 'theme-default' | string;
export type Themes = { id: string; name: string; translationKey: string }[];

/**
 * AppConfig interface. Update this interface to strictly type your config
 * object.
 */
export interface AppConfig
{
    layout: Layout;
    scheme: Scheme;
    screens: Screens;
    theme: Theme;
    themes: Themes;
}

/**
 * Default configuration for the entire application. This object is used by
 * FuseConfigService to set the default configuration.
 *
 * If you need to store global configuration for your app, you can use this
 * object to set the defaults. To access, update and reset the config, use
 * FuseConfigService and its methods.
 *
 * "Screens" are carried over to the BreakpointObserver for accessing them within
 * components, and they are required.
 *
 * "Themes" are required for Tailwind to generate themes.
 */
export const appConfig: AppConfig = {
    layout : 'classy',
    scheme : 'light',
    screens: {
        sm: '600px',
        md: '960px',
        lg: '1280px',
        xl: '1440px'
    },
    theme  : 'theme-default',
    themes : [
        {
            id  : 'theme-default',
            name: 'Default',
            translationKey: 'Theme_Default',
        },
        {
            id  : 'theme-brand',
            name: 'Brand',
            translationKey: 'Theme_Brand',
        },
        {
            id  : 'theme-teal',
            name: 'Teal',
            translationKey: 'Theme_Teal',
        },
        {
            id  : 'theme-rose',
            name: 'Rose',
            translationKey: 'Theme_Rose',
        },
        {
            id  : 'theme-purple',
            name: 'Purple',
            translationKey: 'Theme_Purple',
        },
        {
            id  : 'theme-amber',
            name: 'Amber',
            translationKey: 'Theme_Amber',
        }
    ]
};
