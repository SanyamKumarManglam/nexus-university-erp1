import { storageService } from './storageService';

export const calendarService = {
  getAllEvents: () => {
    return storageService.getCalendarEvents();
  },

  addEvent: (eventData) => {
    const list = storageService.getCalendarEvents();
    const newEvent = {
      id: `EVT-${String(list.length + 1).padStart(3, '0')}`,
      title: eventData.title,
      category: eventData.category || 'EVENT', // WORKING DAY, HOLIDAY, EVENT, EXAM, FDP, CLOSURE
      date: eventData.date,
      endDate: eventData.endDate || eventData.date,
      description: eventData.description || '',
      location: eventData.location || 'Campus Wide',
      targetAudience: eventData.targetAudience || 'Everyone',
      department: eventData.department || 'All'
    };

    list.push(newEvent);
    list.sort((a, b) => new Date(a.date) - new Date(b.date));
    storageService.saveCalendarEvents(list);
    return newEvent;
  },

  updateEvent: (id, fields) => {
    const list = storageService.getCalendarEvents();
    const idx = list.findIndex((e) => e.id === id);
    if (idx === -1) throw new Error('Event not found.');

    list[idx] = { ...list[idx], ...fields };
    list.sort((a, b) => new Date(a.date) - new Date(b.date));
    storageService.saveCalendarEvents(list);
    return list[idx];
  },

  deleteEvent: (id) => {
    const list = storageService.getCalendarEvents();
    const filtered = list.filter((e) => e.id !== id);
    storageService.saveCalendarEvents(filtered);
    return true;
  }
};
