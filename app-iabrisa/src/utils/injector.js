import { useEffect } from 'react';

const ScriptInjector = ({ scriptString }) => {
  useEffect(() => {
    const container = document.createElement('div');
    container.innerHTML = scriptString;

    const scripts = container.querySelectorAll('script');
    scripts.forEach(script => {
      const newScript = document.createElement('script');
      newScript.text = script.textContent;
      if (script.src) {
        newScript.src = script.src;
      }
      document.body.appendChild(newScript);
    });

    return () => {
      scripts.forEach(script => {
        if (script.src) {
          const addedScript = document.querySelector(
            `script[src="${script.src}"]`
          );
          if (addedScript) {
            document.body.removeChild(addedScript);
          }
        } else {
          const addedScript = Array.from(
            document.querySelectorAll('script')
          ).find(s => s.text === script.textContent);
          if (addedScript) {
            document.body.removeChild(addedScript);
          }
        }
      });
    };
  }, [scriptString]);

  return null;
};

export default ScriptInjector;
