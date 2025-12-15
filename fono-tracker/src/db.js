import Dexie from 'dexie';

export const db = new Dexie('FonoTrackerDB');

// Version 6: Activity Manager
db.version(6).stores({
    patients: '++id, name, diagnosis, createdAt',
    evaluations: '++id, patientId, date, type',
    sessions: '++id, patientId, date, objectiveId',
    objectives: '++id, patientId, area, status',
    scores: '++id, sessionId, objectiveId',
    appointments: '++id, patientId, start, end, type, status, notes, clinicalNotes, meetingLink',
    meetingLinks: '++id, name, url',
    patientDocs: '++id, patientId, name, type, date', // Store file blob in 'file' prop (not indexed)
    patientFormats: '++id, patientId, title, createdAt', // Store content in 'content' prop
    activities: '++id, title, category, createdAt'
});

// Version 5: Patient Documents & Formats
db.version(5).stores({
    patients: '++id, name, diagnosis, createdAt',
    evaluations: '++id, patientId, date, type',
    sessions: '++id, patientId, date, objectiveId',
    objectives: '++id, patientId, area, status',
    scores: '++id, sessionId, objectiveId',
    appointments: '++id, patientId, start, end, type, status, notes, clinicalNotes, meetingLink',
    meetingLinks: '++id, name, url',
    patientDocs: '++id, patientId, name, type, date', // Store file blob in 'file' prop (not indexed)
    patientFormats: '++id, patientId, title, createdAt' // Store content in 'content' prop
});

// Version 4: Settings & Meeting Links
db.version(4).stores({
    patients: '++id, name, diagnosis, createdAt',
    evaluations: '++id, patientId, date, type',
    sessions: '++id, patientId, date, objectiveId',
    objectives: '++id, patientId, area, status',
    scores: '++id, sessionId, objectiveId',
    appointments: '++id, patientId, start, end, type, status, notes, clinicalNotes, meetingLink',
    meetingLinks: '++id, name, url'
});

// Version 3: Appointments
db.version(3).stores({
    patients: '++id, name, diagnosis, createdAt',
    evaluations: '++id, patientId, date, type',
    sessions: '++id, patientId, date, objectiveId', // Legacy or Future
    objectives: '++id, patientId, area, status',    // Legacy or Future
    scores: '++id, sessionId, objectiveId',         // Legacy or Future
    appointments: '++id, patientId, start, end, type, status' // New
}).upgrade(() => {
    // Migration logic if needed
});

db.version(2).stores({
    patients: '++id, name, createdAt',
    sessions: '++id, patientId, date, objectiveId',
    objectives: '++id, patientId, area, status',
    scores: '++id, sessionId, objectiveId',
    evaluations: '++id, patientId, date'
});
