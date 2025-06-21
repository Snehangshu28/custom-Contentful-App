import React, { useEffect, useState } from 'react';
import { init } from '@contentful/app-sdk';
import type { AppExtensionSDK } from '@contentful/app-sdk';
import LayoutEditor from './components/LayoutEditor';
import './App.css';

const App: React.FC = () => {
  const [sdk, setSdk] = useState<AppExtensionSDK | null>(null);

  useEffect(() => {
    init((sdkInstance: AppExtensionSDK) => {
      setSdk(sdkInstance);
      // The `window` property is available on page, dialog and sidebar apps
      if ('window' in sdkInstance) {
        // We use a type assertion here because the type narrowing is not working
        // correctly with the complex union types from the Contentful App SDK.
        (sdkInstance as any).window.startAutoResizer();
      }
    });
  }, []);

  if (!sdk) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Contentful Visual Layout Editor</h1>
      <LayoutEditor sdk={sdk} />
    </div>
  );
};

export default App;
