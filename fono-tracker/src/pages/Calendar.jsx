import React, { useState, useMemo } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import es from 'date-fns/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { Plus, X, Video, MapPin, Users, Phone, Mail, MessageCircle, Copy, Check, Trash2, Calendar as CalendarIcon, FileText } from 'lucide-react';

const locales = {
    'es': es,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const SESSION_TYPES = [
    { id: 'presencial', label: 'Terapia Presencial', color: '#0d9488', icon: MapPin },
    { id: 'online', label: 'Terapia Online', color: '#4f46e5', icon: Video },
    { id: 'evaluacion', label: 'Evaluación', color: '#e11d48', icon: Users },
    { id: 'reunion_padres', label: 'Reunión con Padres', color: '#f59e0b', icon: Users },
    { id: 'reunion_medicos', label: 'Reunión con Médicos', color: '#0ea5e9', icon: Users },
    { id: 'reunion_escolar', label: 'Reunión Escolar', color: '#8b5cf6', icon: Users },
    { id: 'reunion_terapeutas', label: 'Reunión con Terapeutas', color: '#ec4899', icon: Users }
];

export function Calendar() {
    const [view, setView] = useState('month');
    const [date, setDate] = useState(new Date());
    const [showModal, setShowModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const appointments = useLiveQuery(() => db.appointments.toArray()) || [];
    const patients = useLiveQuery(() => db.patients.toArray()) || [];

    const events = useMemo(() => {
        return appointments.map(app => {
            const patient = patients.find(p => p.id === parseInt(app.patientId));
            return {
                ...app,
                title: app.title || (patient ? patient.name : 'Cita'),
                start: new Date(app.start),
                end: new Date(app.end),
                resource: patient
            };
        });
    }, [appointments, patients]);

    const handleSelectSlot = ({ start, end }) => {
        setSelectedEvent({
            start,
            end,
            patientId: '',
            type: 'presencial',
            notes: '',
            meetingLink: ''
        });
        setShowModal(true);
    };

    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
        setShowModal(true);
    };

    const handleSave = async (formData) => {
        const payload = {
            patientId: parseInt(formData.patientId),
            start: formData.start.toISOString(),
            end: formData.end.toISOString(),
            type: formData.type,
            status: formData.status,
            notes: formData.notes || '',
            clinicalNotes: formData.clinicalNotes || '',
            meetingLink: formData.meetingLink || '',
            title: formData.title || ''
        };

        if (selectedEvent.id) {
            await db.appointments.update(selectedEvent.id, payload);
        } else {
            await db.appointments.add(payload);
        }
        setShowModal(false);
    };

    const handleDelete = async () => {
        if (selectedEvent.id && confirm('¿Eliminar esta cita?')) {
            await db.appointments.delete(selectedEvent.id);
            setShowModal(false);
        }
    };

    const eventStyleGetter = (event) => {
        const typeInfo = SESSION_TYPES.find(t => t.id === event.type) || SESSION_TYPES[0];
        let color = typeInfo.color;

        // Dim cancelled events
        if (event.status === 'cancelled' || event.status === 'no_show') {
            color = '#94a3b8'; // Slate 400
        }

        return {
            style: {
                backgroundColor: color,
                borderRadius: '6px',
                opacity: 0.9,
                color: 'white',
                border: '0px',
                display: 'block',
                textDecoration: event.status === 'cancelled' ? 'line-through' : 'none'
            }
        };
    };

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col space-y-4 animate-in fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Agenda</h1>
                    <p className="text-slate-500">Gestiona tus citas y sesiones.</p>
                </div>
                <button
                    onClick={() => handleSelectSlot({ start: new Date(), end: new Date(new Date().setHours(new Date().getHours() + 1)) })}
                    className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 font-medium flex items-center shadow-sm"
                >
                    <Plus size={18} className="mr-2" />
                    Nueva Cita
                </button>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex-1">
                <BigCalendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '100%' }}
                    messages={{
                        today: 'Hoy',
                        previous: 'Anterior',
                        next: 'Siguiente',
                        month: 'Mes',
                        week: 'Semana',
                        day: 'Día',
                        agenda: 'Agenda',
                        date: 'Fecha',
                        time: 'Hora',
                        event: 'Evento',
                        noEventsInRange: 'No hay eventos en este rango.'
                    }}
                    culture='es'
                    onSelectEvent={handleSelectEvent}
                    onSelectSlot={handleSelectSlot}
                    selectable
                    eventPropGetter={eventStyleGetter}
                    view={view}
                    onView={setView}
                    date={date}
                    onNavigate={setDate}
                />
            </div>

            {showModal && (
                <EventModal
                    event={selectedEvent}
                    patients={patients}
                    onClose={() => setShowModal(false)}
                    onSave={handleSave}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
}

function EventModal({ event, patients, onClose, onSave, onDelete }) {
    const [activeTab, setActiveTab] = useState('details');
    const meetingLinks = useLiveQuery(() => db.meetingLinks.toArray()) || [];

    // Initialize derived state for separate inputs
    const initialStart = event.start ? new Date(event.start) : new Date();
    const initialEnd = event.end ? new Date(event.end) : new Date(new Date().setHours(new Date().getHours() + 1));

    const [dateProp, setDateProp] = useState(format(initialStart, 'yyyy-MM-dd'));
    const [startTime, setStartTime] = useState(format(initialStart, 'HH:mm'));
    const [endTime, setEndTime] = useState(format(initialEnd, 'HH:mm'));

    const [formData, setFormData] = useState({
        patientId: event.patientId || (event.resource?.id || ''),
        type: event.type || 'presencial',
        status: event.status || 'scheduled',
        notes: event.notes || '',
        clinicalNotes: event.clinicalNotes || '',
        meetingLink: event.meetingLink || ''
    });

    const patient = patients.find(p => p.id === parseInt(formData.patientId));

    const handleSubmit = (e) => {
        e.preventDefault();

        // Reconstruct Date objects
        const startDateTime = new Date(`${dateProp}T${startTime}`);
        const endDateTime = new Date(`${dateProp}T${endTime}`);

        onSave({
            ...formData,
            start: startDateTime,
            end: endDateTime
        });
    };

    const handleNotification = (method) => {
        if (!patient) return alert('Selecciona un paciente primero');

        const startDateTime = new Date(`${dateProp}T${startTime}`);
        const dateStr = startDateTime.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
        const typeInfo = SESSION_TYPES.find(t => t.id === formData.type)?.label || 'Sesión';
        const linkText = formData.meetingLink ? `\nLink de reunión: ${formData.meetingLink}` : '';
        const locationText = formData.type.includes('online') ? 'Modalidad: Online' : 'Lugar: Consulta Fonoaudiógica';

        const subject = `Recordatorio ${typeInfo} - ${dateStr}`;
        const body = `Hola, le recuerdo su próxima cita:\n\n📅 Fecha: ${dateStr}\n📌 ${locationText}\n📋 Tipo: ${typeInfo}${linkText}\n\nPor favor confirmar asistencia. Avisar con 24 hrs de anticipación en caso de inasistencia.`;

        if (method === 'email') {
            window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
        } else if (method === 'whatsapp') {
            window.open(`https://wa.me/?text=${encodeURIComponent(body)}`);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-800">{event.id ? 'Detalles de la Cita' : 'Nueva Cita'}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                {event.id && (
                    <div className="flex border-b border-slate-200">
                        <button
                            onClick={() => setActiveTab('details')}
                            className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'details' ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            <CalendarIcon size={16} className="inline mr-2" />
                            Datos de Cita
                        </button>
                        <button
                            onClick={() => setActiveTab('clinical')}
                            className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'clinical' ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            <FileText size={16} className="inline mr-2" />
                            Ficha Clínica
                        </button>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex-1 overflow-auto p-6 space-y-4">

                    {activeTab === 'details' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Paciente</label>
                                <select
                                    required
                                    className="w-full border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                                    value={formData.patientId}
                                    onChange={e => setFormData({ ...formData, patientId: e.target.value })}
                                >
                                    <option value="">Seleccionar Paciente...</option>
                                    {patients.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-3 sm:col-span-1">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Fecha</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full border-slate-300 rounded-lg text-sm"
                                        value={dateProp}
                                        onChange={e => setDateProp(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Hora Inicio</label>
                                    <input
                                        type="time"
                                        required
                                        className="w-full border-slate-300 rounded-lg text-sm"
                                        value={startTime}
                                        onChange={e => setStartTime(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Hora Fin</label>
                                    <input
                                        type="time"
                                        required
                                        className="w-full border-slate-300 rounded-lg text-sm"
                                        value={endTime}
                                        onChange={e => setEndTime(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Sesión</label>
                                <select
                                    className="w-full border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                >
                                    {SESSION_TYPES.map(t => (
                                        <option key={t.id} value={t.id}>{t.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Estado</label>
                                <select
                                    className="w-full border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="scheduled">Programada</option>
                                    <option value="completed">Realizada</option>
                                    <option value="cancelled">Cancelada</option>
                                    <option value="no_show">No Asistió</option>
                                </select>
                            </div>

                            {formData.type.includes('online') && (
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="block text-sm font-medium text-slate-700">Link de Reunión (Zoom/Meet)</label>
                                        <select
                                            className="text-xs border-slate-300 rounded-lg py-1 px-2 text-slate-600 bg-slate-50 focus:ring-teal-500 focus:border-teal-500"
                                            onChange={(e) => {
                                                if (e.target.value) setFormData({ ...formData, meetingLink: e.target.value });
                                            }}
                                            value=""
                                        >
                                            <option value="">Cargar URL guardada...</option>
                                            {meetingLinks.map(link => (
                                                <option key={link.id} value={link.url}>{link.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="relative">
                                        <Video className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input
                                            type="url"
                                            className="w-full pl-10 border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                                            placeholder="https://..."
                                            value={formData.meetingLink}
                                            onChange={e => setFormData({ ...formData, meetingLink: e.target.value })}
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Notas</label>
                                <textarea
                                    className="w-full border-slate-300 rounded-lg text-sm"
                                    rows={2}
                                    value={formData.notes}
                                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                />
                            </div>

                            {/* Notification Actions */}
                            {patient && (
                                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                                    <p className="text-xs font-bold text-slate-500 uppercase mb-2">Enviar Recordatorio</p>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleNotification('whatsapp')}
                                            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center transition-colors"
                                        >
                                            <MessageCircle size={16} className="mr-2" /> WhatsApp
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleNotification('email')}
                                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center transition-colors"
                                        >
                                            <Mail size={16} className="mr-2" /> Correo
                                        </button>
                                    </div>
                                </div>
                            )}

                        </>
                    )}

                    {activeTab === 'clinical' && (
                        <div className="h-full flex flex-col">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Evolución / Ficha Clínica</label>
                            <p className="text-xs text-slate-500 mb-3">Registra aquí los detalles de la sesión, avances del paciente o incidencias importantes.</p>
                            <textarea
                                className="w-full flex-1 border-slate-300 rounded-lg text-sm p-4 focus:ring-teal-500 focus:border-teal-500 min-h-[300px]"
                                placeholder="Escribe aquí las observaciones clínicas..."
                                value={formData.clinicalNotes}
                                onChange={e => setFormData({ ...formData, clinicalNotes: e.target.value })}
                            />
                        </div>
                    )}

                    <div className="flex justify-between items-center pt-4 border-t border-slate-100 mt-4">
                        {event.id ? (
                            <button
                                type="button"
                                onClick={onDelete}
                                className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center px-3 py-2 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <Trash2 size={16} className="mr-1" /> Eliminar
                            </button>
                        ) : <div></div>}

                        <div className="flex space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 font-medium shadow-sm transition-all"
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
