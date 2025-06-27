let slides = [], grouped = {}, currentDay, currentTimeIndex, map, marker;


fetch('data/slides.json')
  .then(r => r.json())
  .then(data => {
    slides = data.slides;
    initMap();
    groupSlides();
    renderDayButtons();
  });

function initMap() {
map = L.map('map', {
  center: [38.9072, -77.0369],
  zoom: 11,
  zoomControl: false  // 👈 disables +/– zoom buttons
});  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OSM & CARTO', maxZoom: 19
  }).addTo(map);
}

function groupSlides() {
  slides.forEach(s => {
    const key = new Date(s.startTime).toISOString().slice(0,10);
    grouped[key] = grouped[key] || [];
    grouped[key].push(s);
  });
}

function renderDayButtons() {
  const dayNav = document.getElementById('day-nav');
  const days = Object.keys(grouped);
  dayNav.innerHTML = days.map((d, i) => {
const weekdayMap = {
  '2025-06-28': 'Saturday',
  '2025-06-29': 'Sunday',
  '2025-06-30': 'Monday',
  '2025-07-01': 'Tuesday'
};
const label = weekdayMap[d] || new Date(d).toLocaleDateString(undefined, { weekday: 'long' });
    return `<button data-day="${d}" class="${i===0?'active':''}">${label}</button>`;
  }).join('');
  dayNav.querySelectorAll('button').forEach(btn => {
    btn.onclick = () => {
      dayNav.querySelectorAll('button').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      showDay(btn.dataset.day);
    };
  });
  showDay(days[0]);
}

function showDay(dayKey) {
  currentDay = dayKey;
  currentTimeIndex = 0;

  renderTimeButtons();
  showMarkers();      // show them all first
  fitBounds();        // then adjust view to include them
  renderSlide();
}

function renderTimeButtons() {
  const timeNav = document.getElementById('time-nav');
  const slidesForDay = grouped[currentDay];
  timeNav.innerHTML = slidesForDay.map((s,i) => {
    const st = formatTime(new Date(s.startTime));
    const en = formatTime(new Date(s.endTime));
    return `<button data-idx="${i}" class="${i===0?'active':''}">${st} – ${en}</button>`;
  }).join('');
  timeNav.querySelectorAll('button').forEach(btn => {
    btn.onclick = () => {
      timeNav.querySelectorAll('button').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      currentTimeIndex = +btn.dataset.idx;
      renderSlide();
      focusCurrentMarker(); // ✅ Re-opens the popup for current time
    };
  });
}

function renderSlide() {
  const slide = grouped[currentDay][currentTimeIndex];
  const panel = document.getElementById('slidePanel');

  const hasLink = !!slide.website;
  panel.innerHTML = `
    <div class="slide-content ${hasLink ? 'clickable' : ''}" ${hasLink ? `onclick="window.open('${slide.website}', '_blank')"` : ''}>
      <img src="${slide.image}" alt="${slide.title}" class="slide-image" />
      <div class="slide-text">
        <h3>${slide.title}</h3>
        <p>${slide.description}</p>
      </div>
    </div>
  `;
}

let markers = []; // <-- top-level variable

function showMarkers() {
  // Clear previous markers
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  grouped[currentDay].forEach((s, i) => {
    if (s.lat && s.lon) {
const m = L.marker([s.lat, s.lon]).addTo(map).bindPopup(s.title, {
  closeButton: false
});      markers.push(m);

      if (i === currentTimeIndex) {
        m.openPopup(); // Open for current time
      }
    }
  });
}

function focusCurrentMarker() {
  const m = markers[currentTimeIndex];
  if (m) {
    m.openPopup();
  }
}

function fitBounds() {
  const slidesForDay = grouped[currentDay];
  const latLngs = slidesForDay
    .filter(s => typeof s.lat === 'number' && typeof s.lon === 'number')
    .map(s => [s.lat, s.lon]);

  if (!latLngs.length) return;

  const bounds = L.latLngBounds(latLngs);

  // Orientation check
  const size = map.getSize();
  const isPortrait = size.y > size.x;

  const paddingTopLeft = isPortrait ? [0, 0] : [0, size.y * 0.25];
  const paddingBottomRight = isPortrait ? [0, size.y * 0.35] : [size.x * 0.35, 0];

  map.fitBounds(bounds, {
    paddingTopLeft,
    paddingBottomRight,
    animate: true,
    duration: 0.8
  });
}

function isPortrait() {
  return window.matchMedia("(orientation: portrait)").matches;
}

function formatTime(date) {
  let h = date.getHours();
  let m = date.getMinutes();
  h = h % 12 || 12; // Convert 24hr → 12hr format

  return m === 0 ? `${h}` : `${h}:${m.toString().padStart(2, '0')}`;
}