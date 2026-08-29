import { storageService } from './storageService';

export const announcementService = {
  getAllAnnouncements: () => {
    return storageService.getAnnouncements();
  },

  getAnnouncementsForAudience: (role, department = null, userClass = null) => {
    const list = storageService.getAnnouncements();
    return list.filter((a) => {
      if (a.audience === 'Everyone') return true;
      if (role === 'admin') return true;
      if (role === 'teacher' && a.audience === 'Teachers') return true;
      if (role === 'student' && a.audience === 'Students') return true;
      if (a.audience === 'Specific Department' && department && a.targetDepartment === department) return true;
      if (a.audience === 'Specific Class' && userClass && a.targetClass === userClass) return true;
      return false;
    });
  },

  createAnnouncement: (data) => {
    const list = storageService.getAnnouncements();
    const newAnnouncement = {
      id: `ANN-${String(list.length + 1).padStart(3, '0')}`,
      title: data.title,
      message: data.message,
      priority: data.priority || 'Normal',
      audience: data.audience || 'Everyone',
      authorId: data.authorId,
      authorName: data.authorName,
      createdAt: new Date().toISOString(),
      publishDate: data.publishDate || new Date().toISOString().slice(0, 10),
      expiryDate: data.expiryDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      targetDepartment: data.targetDepartment || null,
      targetClass: data.targetClass || null
    };

    list.unshift(newAnnouncement);
    storageService.saveAnnouncements(list);
    return newAnnouncement;
  },

  updateAnnouncement: (id, fields) => {
    const list = storageService.getAnnouncements();
    const idx = list.findIndex((a) => a.id === id);
    if (idx === -1) throw new Error('Announcement not found.');

    list[idx] = { ...list[idx], ...fields };
    storageService.saveAnnouncements(list);
    return list[idx];
  },

  deleteAnnouncement: (id) => {
    const list = storageService.getAnnouncements();
    const filtered = list.filter((a) => a.id !== id);
    storageService.saveAnnouncements(filtered);
    return true;
  }
};
