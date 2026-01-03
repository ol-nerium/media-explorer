const getFilterButtons = () => {
  //   console.log(filterButtons);
  return {
    nowPlaying: document.querySelector('[data-filter="nowPlaying"]'),
    popular: document.querySelector('[data-filter="popular"]'),
    topRated: document.querySelector('[data-filter="topRated"]'),
    upcoming: document.querySelector('[data-filter="upcoming"]'),
    trendDay: document.querySelector('[data-filter="trendDay"]'),
    trendWeek: document.querySelector('[data-filter="trendWeek"]'),
  };
};

export { getFilterButtons };
