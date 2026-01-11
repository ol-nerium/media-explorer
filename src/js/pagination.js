import { state } from "../main";
import { galleryUpdate, isInfiniteScroll } from "./galleryCreate";
import { scrollUp } from "./scrollInterface";
const paginationRoot = document.getElementById("pagination");
paginationRoot.addEventListener("click", paginationInterface);

function createPaginationButtonsList() {
  let page = Number(state.page);
  let total_pages = Number(state.total_pages);
  // total_pages are limited as 500 but backend has bug with big numbers, so fix:
  if (total_pages > 500) total_pages = 500;

  // let resArr = [];
  const mainBtnList = [];
  if (total_pages <= 7) {
    for (let i = 1; i <= total_pages; i += 1) mainBtnList.push(i);
    return mainBtnList;
  }
  if (page < 7) return [1, 2, 3, 4, 5, 6, 7, "...", total_pages];
  if (page >= 7 && page < total_pages - 5) {
    for (let i = page - 3; i < page + 3; i += 1) mainBtnList.push(i);
    return [1, "...", ...mainBtnList, "...", total_pages];
  }
  for (let i = total_pages - 6; i <= total_pages; i += 1) mainBtnList.push(i);
  return [1, "...", ...mainBtnList];
}

function createPaginationMarkup() {
  const resArr = createPaginationButtonsList();
  if (resArr.length <= 1) {
    paginationRoot.innerHTML = "";
    return;
  }
  let resMarkup = resArr
    .map((i) => {
      if (i === "...")
        return `<div class="pageEllipsis">
          <svg>
            <use href="#ellipsis"></use>
          </svg>
      </div>`;
      else return `<button class="pagBtn" data-page=${i}>${i}</button>`;
    })
    .join("");
  const arrowMarkupObj = {
    rightArrow: `<button class="rightArrow" data-control="right">
          <svg>
            <use href="#arrow-right-circle"></use>
          </svg></button>`,
    leftArrow: `<button class="leftArrow" data-control="left">
          <svg>
            <use href="#arrow-left-circle"></use>
          </svg></button>`,
  };

  resMarkup = arrowMarkupObj.leftArrow + resMarkup + arrowMarkupObj.rightArrow;

  paginationRoot.innerHTML = resMarkup;
  paginationClassWork();
}

function paginationClassWork() {
  const currentPageElem = document.querySelector(`[data-page='${state.page}']`);

  currentPageElem.classList.add("active");
  if (
    Number(currentPageElem.dataset.page) === Number(state.total_pages) ||
    Number(currentPageElem.dataset.page) === 500
  )
    document.querySelector(".rightArrow").classList.add("inactive");

  if (Number(currentPageElem.dataset.page) === 1)
    document.querySelector(".leftArrow").classList.add("inactive");
}

function paginationInterface(e) {
  const total_pages = Number(state.total_pages);
  const page = Number(state.page);

  let target = e.target;
  if (!target.dataset?.page) target = target.closest("[data-control]");

  // classic early return if click not on pag btn
  // page libiting prevent bug here ( will be restricted by css too)
  if (target.dataset.page) state.setPage(target.dataset.page);

  if (target.dataset.control === "left" && page > 1)
    state.setPage(Number(page) - 1);
  if (target.dataset.control === "right" && page < total_pages)
    state.setPage(Number(page) + 1);

  if (
    page !== Number(state.page) ||
    total_pages !== Number(state.total_pages)
  ) {
    isInfiniteScroll(false);
    scrollUp();
    galleryUpdate(state);
  }
}

export { createPaginationMarkup, paginationInterface };
