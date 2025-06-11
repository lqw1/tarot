export const getScrollTop = (el: Document | Element): number => {
  return (
    (el as Element).scrollTop ||
    Math.max(
      window.scrollY || window.pageYOffset,
      document.documentElement.scrollTop,
      document.body.scrollTop
    )
  );
};

export const getScrollHeight = (el: Document | Element): number => {
  return (
    (el as Element).scrollHeight ||
    Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)
  );
};

export const getClientHeight = (el: Document | Element): number => {
  return (
    (el as Element).clientHeight ||
    Math.max(document.documentElement.clientHeight, document.body.clientHeight)
  );
};
