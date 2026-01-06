// export function documentWasTotallyScrolled() {
//   //   console.log(window);
//   //   const galleryNode = document.getElementById("gallery");
//   //   console.log(galleryNode.getBoundingClientRect());

//   const rootHeight = document.documentElement.scrollHeight;
//   //height of an element's content, including content not visible on the screen due to overflow.

//   const rootClientHeight = document.documentElement.clientHeight;
//   // inner height of an element in pixels. It includes padding but excludes borders, margins, and horizontal scrollbars
//   const rootScrollTop = document.documentElement.scrollTop;
//   // number of pixels by which an element's content is scrolled from its top edge

//   const innerHeight = window.innerHeight;
//   //interior height of the window in pixels
//   // window.innerHeight doesn't include horizintal scrollbar in Chrome / Edge / Safari / Firefox
//   // Engines treat scrollbars as overlay UI, not layout content
//   const scrollOffset = Math.round(window.pageYOffset);
//   // pixels a document has scrolled from the upper left corner of the window
//   // pageYOffset is same as scrollY but has better browser compatibility

//   console.log({
//     rootHeight,
//     innerHeight,
//     scrollOffset,
//   });
//   console.log(rootHeight === innerHeight + scrollOffset);
//   if (rootHeight === innerHeight + scrollOffset) {
//     console.log("bottom of the page", rootHeight, innerHeight + scrollOffset);
//   } else console.log(rootHeight, innerHeight + scrollOffset);

//   //15px if hor scrollBar is on the page, but it's hacky to add this
// }

export function scrollUp() {
  //   console.log(window.scroll())

  window.scroll({ top: 0, left: 0, behavior: "smooth" });
  //   console.log(window.scrollBy())
  //   console.log(window.scrollTo())
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

  console.log({ rootHeight, rootClientHeight, rootScrollTop });
  console.log(rootHeight - rootClientHeight - rootScrollTop);

  const isBottom = Math.abs(rootHeight - rootClientHeight - rootScrollTop) <= 1;

  if (isBottom) {
    console.log("bottom of the page", isBottom);
    // return true;
  }

  return isBottom;
  // correct way to wrestle infinite scroll task but maybe this should be rewritten for my purpose for gallery, not document
}
