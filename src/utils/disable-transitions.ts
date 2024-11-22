let timeout: NodeJS.Timeout | undefined;

export function disableTransitions() {
    if (timeout) clearTimeout(timeout);
    const { classList } = document.documentElement;
    classList.add('disable-transitions');
    timeout = setTimeout(() => classList.remove('disable-transitions'), 100);
  }