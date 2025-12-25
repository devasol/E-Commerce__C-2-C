const reportWebVitals = (onPerfEntry?: any) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals' as any).then((webVitalsModule: any) => {
      const webVitals = webVitalsModule.default || webVitalsModule;
      webVitals.getCLS && webVitals.getCLS(onPerfEntry);
      webVitals.getFID && webVitals.getFID(onPerfEntry);
      webVitals.getFCP && webVitals.getFCP(onPerfEntry);
      webVitals.getLCP && webVitals.getLCP(onPerfEntry);
      webVitals.getTTFB && webVitals.getTTFB(onPerfEntry);
    }).catch((error) => {
      console.error("Web vitals import failed:", error);
    });
  }
};

export default reportWebVitals;