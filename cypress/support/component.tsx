// ***********************************************************
// This example support/component.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

import store from '@/_store';
import _theme from '@/_theme';
import { customStorageManager } from '@/_theme/customStorageManager';
import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider } from '@chakra-ui/react';
import { MountOptions, MountReturn, mount } from 'cypress/react18';
import { NextIntlClientProvider } from 'next-intl';
import { Provider } from 'react-redux';

// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.
declare global {
  namespace Cypress {
    interface Chainable {
      mountWithProviders(
        component: React.ReactNode,
        options?: MountOptions & {
          reduxStore?: typeof store,
          locale?: string,
        }
      ): Cypress.Chainable<MountReturn>
    }
  }
}

Cypress.Commands.add('mountWithProviders', (component, options = {}) => {
  // Use the default store if one is not provided
  const { reduxStore = store, locale = 'en', ...mountOptions } = options;

  const wrapped = (
    <NextIntlClientProvider locale={locale}>
      <Provider store={store} /*serverState={preloadedState}*/>
        <CacheProvider>
          <ChakraProvider theme={_theme} colorModeManager={customStorageManager}>
            {component}
          </ChakraProvider>
        </CacheProvider>
      </Provider>
    </NextIntlClientProvider>
  );

  return mount(wrapped, mountOptions);
});

// Example use:
// cy.mount(<MyComponent />)