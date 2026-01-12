export function scrollUp() {
  window.scroll({ top: 0, left: 0, behavior: "smooth" });
}

export function documentWasTotallyScrolled() {
  const rootElement = document.documentElement;
  //   const rootElement = document.querySelector(".filterButtonsSection");

  const rootHeight = rootElement.scrollHeight;
  //height of an element's content, including content not visible on the screen due to overflow.

  const rootClientHeight = rootElement.clientHeight;
  // inner height of an element in pixels. It includes padding but excludes borders, margins, and horizontal scrollbars
  const rootScrollTop = rootElement.scrollTop;
  // number of pixels by which an element's content is scrolled from its top edge

  const isBottom = Math.abs(rootHeight - rootClientHeight - rootScrollTop) <= 1;
  return isBottom; // bottom of the page if true
}

export function galleryWasScrolled() {
  const gallery = document.querySelector(".gallery");
  const galleryElemHalfHeight =
    document.querySelector(".gallery-item").getBoundingClientRect().height / 2;
  if (!!gallery) {
    const { bottom } = gallery.getBoundingClientRect();
    // bottom is distance from bottom of ELEMENT to the top of viewport
    // top is similar. top === y
    // horizontal scrollbar can move slightly bottom value but it can be neglected
    // window.innerHeight = inner hight of viewport
    // window.innerHeight doesn't include horizintal scrollbar in Chrome / Edge / Safari / Firefox
    // Engines treat scrollbars as overlay UI, not layout content

    //bottom < window.innerHeight bottom of gallery intersected viewport
    //bottom - galleryElemHalfHeight < window.innerHeight should fetch

    // will return true if gallery if half of element to the intersection:
    return bottom - galleryElemHalfHeight < window.innerHeight;
    // return bottom < window.innerHeight;
  }
}
