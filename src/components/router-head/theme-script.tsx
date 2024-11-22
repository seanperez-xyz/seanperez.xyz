export const ThemeScript = () => {
  const themeScript = `
  (function() {
    document.documentElement.classList.add('no-transition');

    // Handle regular theme mode
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);

    // Handle material theme
    const savedMaterialTheme = localStorage.getItem('material-theme');
    if (savedMaterialTheme) {
      const sheet = globalThis['material-theme'] ??= new CSSStyleSheet();
      if (!document.adoptedStyleSheets.includes(sheet)) {
        document.adoptedStyleSheets.push(sheet);
      }
      sheet.replaceSync(savedMaterialTheme);
    }
  })();
`;
  return <script dangerouslySetInnerHTML={themeScript} />;
};
