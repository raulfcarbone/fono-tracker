import { NarrativeGame } from '../components/interactive/NarrativeGame';
import { TurnTakingTimerGame } from '../components/interactive/TurnTakingTimerGame';
import { MatchingGame } from '../components/interactive/MatchingGame';

/**
 * type InteractiveModule = {
 *   id: string;
 *   title: string;
 *   description: string;
 *   therapeuticGoals: string[];
 *   skills: string[];
 *   ageRange: string;
 *   gameType: 'story' | 'turn-based' | 'matching' | 'emotion' | 'narrative';
 *   assets?: { images?: string[]; audio?: string[] };
 *   component: React.ComponentType;
 *   inspiration: string;
 * };
 */

// Lista base de módulos inspirados en repositorios abiertos sin copiar código externo.
export const interactiveModules = [
    {
        id: 'narrativa',
        title: 'Relato con decisiones empáticas',
        description: 'Modela turnos conversacionales y coherencia narrativa con elecciones guiadas.',
        therapeuticGoals: ['Pragmática', 'Cohesión de relato', 'Empatía'],
        skills: ['Escucha activa', 'Anticipación', 'Toma de turnos'],
        ageRange: '6-12 años',
        gameType: 'narrative',
        assets: { images: ['pictogramas de saludo', 'escuela'], audio: [] },
        component: NarrativeGame,
        inspiration: 'Autsera (storytelling) y SpeakWell',
    },
    {
        id: 'turnos',
        title: 'Turnos con temporizador y feedback',
        description: 'Práctica corta de control inhibitorio con conteo regresivo y refuerzo inmediato.',
        therapeuticGoals: ['Control inhibitorio', 'Atención sostenida'],
        skills: ['Respuesta sí/no', 'Gestión del tiempo'],
        ageRange: '8-14 años',
        gameType: 'turn-based',
        assets: { audio: ['sonidos de reloj'], images: ['pictogramas de esperar/hablar'] },
        component: TurnTakingTimerGame,
        inspiration: 'nteract-games y dinámicas de Autsera',
    },
    {
        id: 'emociones',
        title: 'Asociación emoción-palabra',
        description: 'Empareja pictogramas sencillos con palabras emocionales para ampliar vocabulario.',
        therapeuticGoals: ['Conciencia emocional', 'Vocabulario funcional'],
        skills: ['Asociación visual', 'Lectura global'],
        ageRange: '5-11 años',
        gameType: 'matching',
        assets: { images: ['pictogramas ARASAAC'], audio: ['locuciones simples'] },
        component: MatchingGame,
        inspiration: 'Games4Autism, TinyTalk y Verbalise speech therapy app',
    },
];
