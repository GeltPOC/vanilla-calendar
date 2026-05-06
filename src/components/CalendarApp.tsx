'use client';

import { useEffect, useRef } from 'react';

export default function CalendarApp() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    initCalendar();
  }, []);

  return (
    <div className="calendar-wrapper">
      <div className="calendar-container" id="calendar-container">
        {/* Header */}
        <header className="calendar-header">
          <button className="nav-btn" id="prev-btn" aria-label="Mes anterior">
            &#8249;
          </button>
          <div className="calendar-title">
            <h1 id="month-year-title">Cargando...</h1>
            <p id="today-label"></p>
          </div>
          <div className="header-right">
            <button className="today-btn" id="today-btn">Hoy</button>
            <button className="nav-btn" id="next-btn" aria-label="Mes siguiente" style={{marginLeft: '0.5rem'}}>
              &#8250;
            </button>
          </div>
        </header>

        {/* Weekdays */}
        <div className="weekdays-grid" id="weekdays-grid"></div>

        {/* Days */}
        <div className="days-grid" id="days-grid"></div>

        {/* Footer */}
        <footer className="calendar-footer">
          <div className="footer-legend">
            <div className="legend-item">
              <span className="legend-dot legend-today"></span>
              <span>Hoy</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot legend-event"></span>
              <span>Evento</span>
            </div>
          </div>
          <div className="footer-count" id="footer-count"></div>
        </footer>
      </div>

      {/* Modal */}
      <div className="modal-overlay" id="modal-overlay" style={{display: 'none'}} aria-modal="true" role="dialog">
        <div className="modal-content">
          <div className="modal-header">
            <div>
              <h2 id="modal-date-title">Eventos del día</h2>
              <p id="modal-date-sub"></p>
            </div>
            <button className="modal-close" id="modal-close" aria-label="Cerrar">&times;</button>
          </div>
          <div className="modal-body">
            <div className="modal-input-row">
              <input
                type="text"
                className="modal-input"
                id="event-input"
                placeholder="Agregar evento o nota..."
                maxLength={80}
                autoComplete="off"
              />
              <button className="modal-add-btn" id="modal-add-btn">+ Agregar</button>
            </div>
            <div className="modal-events-title">Eventos</div>
            <div className="modal-events-list" id="modal-events-list"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ================= VANILLA CALENDAR LOGIC =================

interface CalendarEvent {
  id: string;
  text: string;
  createdAt: string;
}

type EventsStore = Record<string, CalendarEvent[]>;

function initCalendar() {
  // -------- State --------
  const today = new Date();
  let currentYear = today.getFullYear();
  let currentMonth = today.getMonth(); // 0-indexed
  let selectedDateKey = '';

  const STORAGE_KEY = 'vanilla_calendar_events';

  // -------- DOM refs --------
  const prevBtn = document.getElementById('prev-btn') as HTMLButtonElement;
  const nextBtn = document.getElementById('next-btn') as HTMLButtonElement;
  const todayBtn = document.getElementById('today-btn') as HTMLButtonElement;
  const monthYearTitle = document.getElementById('month-year-title') as HTMLElement;
  const todayLabel = document.getElementById('today-label') as HTMLElement;
  const weekdaysGrid = document.getElementById('weekdays-grid') as HTMLElement;
  const daysGrid = document.getElementById('days-grid') as HTMLElement;
  const footerCount = document.getElementById('footer-count') as HTMLElement;
  const modalOverlay = document.getElementById('modal-overlay') as HTMLElement;
  const modalDateTitle = document.getElementById('modal-date-title') as HTMLElement;
  const modalDateSub = document.getElementById('modal-date-sub') as HTMLElement;
  const modalClose = document.getElementById('modal-close') as HTMLButtonElement;
  const eventInput = document.getElementById('event-input') as HTMLInputElement;
  const modalAddBtn = document.getElementById('modal-add-btn') as HTMLButtonElement;
  const modalEventsList = document.getElementById('modal-events-list') as HTMLElement;

  // -------- Storage --------
  function loadEvents(): EventsStore {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  function saveEvents(store: EventsStore): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }

  function getEventsForDate(dateKey: string): CalendarEvent[] {
    const store = loadEvents();
    return store[dateKey] || [];
  }

  function addEvent(dateKey: string, text: string): void {
    const store = loadEvents();
    if (!store[dateKey]) store[dateKey] = [];
    store[dateKey].push({
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      text: text.trim(),
      createdAt: new Date().toISOString(),
    });
    saveEvents(store);
  }

  function deleteEvent(dateKey: string, eventId: string): void {
    const store = loadEvents();
    if (store[dateKey]) {
      store[dateKey] = store[dateKey].filter((e) => e.id !== eventId);
      if (store[dateKey].length === 0) delete store[dateKey];
    }
    saveEvents(store);
  }

  function countTotalEvents(): number {
    const store = loadEvents();
    return Object.values(store).reduce((acc, arr) => acc + arr.length, 0);
  }

  // -------- Helpers --------
  function dateKey(year: number, month: number, day: number): string {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  function isToday(year: number, month: number, day: number): boolean {
    return (
      year === today.getFullYear() &&
      month === today.getMonth() &&
      day === today.getDate()
    );
  }

  const MONTH_NAMES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];

  const WEEKDAYS = [
    { label: 'Lu', weekend: false },
    { label: 'Ma', weekend: false },
    { label: 'Mi', weekend: false },
    { label: 'Ju', weekend: false },
    { label: 'Vi', weekend: false },
    { label: 'Sá', weekend: true },
    { label: 'Do', weekend: true },
  ];

  function formatDateLong(year: number, month: number, day: number): string {
    const d = new Date(year, month, day);
    return d.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  // -------- Render Weekdays --------
  function renderWeekdays(): void {
    weekdaysGrid.innerHTML = '';
    WEEKDAYS.forEach(({ label, weekend }) => {
      const div = document.createElement('div');
      div.className = 'weekday-label' + (weekend ? ' weekend' : '');
      div.textContent = label;
      weekdaysGrid.appendChild(div);
    });
  }

  // -------- Render Calendar --------
  function renderCalendar(): void {
    // Update title
    monthYearTitle.textContent = `${MONTH_NAMES[currentMonth]} ${currentYear}`;
    todayLabel.textContent = `Hoy: ${today.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}`;

    daysGrid.innerHTML = '';

    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);

    // Monday-based: 0=Mon..6=Sun
    let startDow = firstDay.getDay(); // 0=Sun
    startDow = (startDow + 6) % 7; // convert to Mon-based

    const totalDays = lastDay.getDate();
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();

    const store = loadEvents();

    // Fill previous month days
    for (let i = startDow - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      const pMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const pYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const cell = createDayCell(pYear, pMonth, day, true, store);
      daysGrid.appendChild(cell);
    }

    // Fill current month days
    for (let day = 1; day <= totalDays; day++) {
      const cell = createDayCell(currentYear, currentMonth, day, false, store);
      daysGrid.appendChild(cell);
    }

    // Fill next month days
    const totalCells = daysGrid.children.length;
    const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    const nMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const nYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    for (let day = 1; day <= remaining; day++) {
      const cell = createDayCell(nYear, nMonth, day, true, store);
      daysGrid.appendChild(cell);
    }

    // Footer
    const total = countTotalEvents();
    footerCount.textContent = total === 0
      ? 'Sin eventos guardados'
      : `${total} evento${total !== 1 ? 's' : ''} guardado${total !== 1 ? 's' : ''}`;
  }

  function createDayCell(
    year: number,
    month: number,
    day: number,
    isOtherMonth: boolean,
    store: EventsStore
  ): HTMLElement {
    const cell = document.createElement('div');
    const key = dateKey(year, month, day);

    // DOW for weekend detection (Mon-based)
    const dow = new Date(year, month, day).getDay();
    const isWeekend = dow === 0 || dow === 6;

    let classes = 'day-cell';
    if (isOtherMonth) classes += ' other-month';
    if (isToday(year, month, day)) classes += ' today';
    if (isWeekend) classes += ' weekend';
    cell.className = classes;
    cell.setAttribute('data-date-key', key);
    cell.setAttribute('role', 'button');
    cell.setAttribute('aria-label', formatDateLong(year, month, day));
    cell.setAttribute('tabindex', '0');

    // Day number
    const numDiv = document.createElement('div');
    numDiv.className = 'day-number';
    numDiv.textContent = String(day);
    cell.appendChild(numDiv);

    // Add hint
    const hint = document.createElement('span');
    hint.className = 'add-event-hint';
    hint.innerHTML = '+';
    hint.setAttribute('aria-hidden', 'true');
    cell.appendChild(hint);

    // Events
    const events: CalendarEvent[] = store[key] || [];
    if (events.length > 0) {
      const listDiv = document.createElement('div');
      listDiv.className = 'events-list';

      const MAX_SHOWN = 2;
      events.slice(0, MAX_SHOWN).forEach((ev) => {
        const chip = createEventChip(ev, key);
        listDiv.appendChild(chip);
      });

      if (events.length > MAX_SHOWN) {
        const more = document.createElement('div');
        more.className = 'more-events';
        more.textContent = `+${events.length - MAX_SHOWN} más`;
        listDiv.appendChild(more);
      }

      cell.appendChild(listDiv);
    }

    // Click handler
    function openModal() {
      openDayModal(key, year, month, day);
    }
    cell.addEventListener('click', openModal);
    cell.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal();
      }
    });

    return cell;
  }

  function createEventChip(ev: CalendarEvent, key: string): HTMLElement {
    const chip = document.createElement('div');
    chip.className = 'event-chip';

    const text = document.createElement('span');
    text.className = 'event-chip-text';
    text.textContent = ev.text;
    text.title = ev.text;
    chip.appendChild(text);

    const delBtn = document.createElement('button');
    delBtn.className = 'event-chip-delete';
    delBtn.innerHTML = '&times;';
    delBtn.setAttribute('aria-label', 'Eliminar evento');
    delBtn.addEventListener('click', (e: Event) => {
      e.stopPropagation();
      deleteEvent(key, ev.id);
      renderCalendar();
      if (selectedDateKey === key) {
        renderModalEvents(key);
      }
    });
    chip.appendChild(delBtn);

    return chip;
  }

  // -------- Modal --------
  function openDayModal(key: string, year: number, month: number, day: number): void {
    selectedDateKey = key;
    modalDateTitle.textContent = formatDateLong(year, month, day);
    modalDateSub.textContent = isToday(year, month, day) ? '📅 Hoy' : '';
    eventInput.value = '';
    renderModalEvents(key);
    modalOverlay.style.display = 'flex';
    setTimeout(() => eventInput.focus(), 100);
  }

  function closeModal(): void {
    modalOverlay.style.display = 'none';
    selectedDateKey = '';
    eventInput.value = '';
  }

  function renderModalEvents(key: string): void {
    const events = getEventsForDate(key);
    modalEventsList.innerHTML = '';

    if (events.length === 0) {
      return; // CSS :empty::after will show placeholder
    }

    events.forEach((ev) => {
      const item = document.createElement('div');
      item.className = 'modal-event-item';

      const dot = document.createElement('div');
      dot.className = 'modal-event-dot';
      item.appendChild(dot);

      const textEl = document.createElement('span');
      textEl.className = 'modal-event-text';
      textEl.textContent = ev.text;
      item.appendChild(textEl);

      const time = document.createElement('span');
      time.className = 'modal-event-time';
      time.textContent = new Date(ev.createdAt).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
      });
      item.appendChild(time);

      const delBtn = document.createElement('button');
      delBtn.className = 'modal-event-delete';
      delBtn.innerHTML = '🗑';
      delBtn.setAttribute('aria-label', 'Eliminar evento');
      delBtn.addEventListener('click', () => {
        deleteEvent(key, ev.id);
        renderModalEvents(key);
        renderCalendar();
      });
      item.appendChild(delBtn);

      modalEventsList.appendChild(item);
    });
  }

  function handleAddEvent(): void {
    const text = eventInput.value.trim();
    if (!text || !selectedDateKey) return;
    addEvent(selectedDateKey, text);
    eventInput.value = '';
    renderModalEvents(selectedDateKey);
    renderCalendar();
    eventInput.focus();
  }

  // -------- Events --------
  prevBtn.addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    renderCalendar();
  });

  nextBtn.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendar();
  });

  todayBtn.addEventListener('click', () => {
    currentYear = today.getFullYear();
    currentMonth = today.getMonth();
    renderCalendar();
  });

  modalClose.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', (e: Event) => {
    if (e.target === modalOverlay) closeModal();
  });

  modalAddBtn.addEventListener('click', handleAddEvent);

  eventInput.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Enter') handleAddEvent();
    if (e.key === 'Escape') closeModal();
  });

  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape' && modalOverlay.style.display !== 'none') {
      closeModal();
    }
  });

  // -------- Init --------
  renderWeekdays();
  renderCalendar();
}