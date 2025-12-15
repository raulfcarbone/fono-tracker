import React from 'react';
import { ExternalLink, ShieldCheck, Lightbulb, Link as LinkIcon } from 'lucide-react';

const wordleIframe = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <style>
    body { font-family: 'Inter', system-ui, -apple-system, sans-serif; padding: 16px; color: #0f172a; background: #f8fafc; }
    h3 { margin: 0 0 8px; }
    .grid { display: grid; grid-template-columns: repeat(5, 48px); gap: 6px; margin-bottom: 12px; }
    .cell { width: 48px; height: 48px; border-radius: 10px; display: grid; place-items: center; font-weight: 700; text-transform: uppercase; border: 1px solid #cbd5e1; background: white; }
    .ok { background: #0d9488; color: white; border-color: #0f766e; }
    .half { background: #facc15; color: #713f12; border-color: #f59e0b; }
    input { padding: 10px 12px; border-radius: 10px; border: 1px solid #cbd5e1; width: 180px; font-size: 14px; }
    button { margin-left: 8px; padding: 10px 12px; border: none; background: #0d9488; color: white; border-radius: 10px; cursor: pointer; font-weight: 600; }
    .toast { margin-top: 10px; font-size: 13px; color: #0f172a; }
  </style>
</head>
<body>
  <h3>Mini Wordle</h3>
  <p>Prueba con una palabra de 5 letras relacionada a terapia: voz, ritmo o habla.</p>
  <div id="grid" class="grid"></div>
  <div>
    <input id="guess" maxlength="5" aria-label="Escribe tu intento" />
    <button id="submit">Probar</button>
  </div>
  <p class="toast" id="toast"></p>
  <script>
    const palabras = ['VOCES','RITMO','HABLA'];
    const secreta = palabras[Math.floor(Math.random() * palabras.length)];
    const grid = document.getElementById('grid');
    const toast = document.getElementById('toast');
    const maxIntentos = 4;
    let intentos = [];

    function pintarIntentos() {
      grid.innerHTML = '';
      intentos.forEach((intento) => {
        intento.split('').forEach((letra, idx) => {
          const cell = document.createElement('div');
          cell.className = 'cell';
          if (secreta[idx] === letra) cell.classList.add('ok');
          else if (secreta.includes(letra)) cell.classList.add('half');
          cell.textContent = letra;
          grid.appendChild(cell);
        });
      });
    }

    function validar() {
      const valor = document.getElementById('guess').value.toUpperCase();
      if (valor.length !== 5) { toast.textContent = 'Usa 5 letras.'; return; }
      intentos.push(valor);
      pintarIntentos();
      document.getElementById('guess').value = '';
      if (valor === secreta) toast.textContent = '¡Bien! Palabra correcta.';
      else if (intentos.length >= maxIntentos) toast.textContent = 'Fin. Reinicia la página para otro intento.';
      else toast.textContent = 'Sigue probando: mira colores.';
    }

    document.getElementById('submit').addEventListener('click', validar);
    document.getElementById('guess').addEventListener('keydown', (e) => { if (e.key === 'Enter') validar(); });
    pintarIntentos();
  </script>
</body>
</html>`;

const tilesIframe = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <style>
    body { font-family: 'Inter', system-ui, -apple-system, sans-serif; padding: 16px; color: #0f172a; background: #f8fafc; }
    .board { display: grid; grid-template-columns: repeat(4, 50px); gap: 6px; margin: 12px 0; }
    .tile { width: 50px; height: 50px; border-radius: 10px; background: #e2e8f0; display: grid; place-items: center; font-weight: 700; }
    .tile[data-v='2'] { background: #ccfbf1; color: #0f766e; }
    .tile[data-v='4'] { background: #99f6e4; color: #0f766e; }
    .tile[data-v='8'] { background: #5eead4; color: #0f172a; }
    button { padding: 8px 10px; border-radius: 10px; border: 1px solid #cbd5e1; background: white; cursor: pointer; margin-right: 6px; font-weight: 600; }
    .status { font-size: 13px; }
  </style>
</head>
<body>
  <h3>Mini fusión 2048</h3>
  <p>Pulsa en cualquier dirección para trabajar la planificación con números pequeños.</p>
  <div class="board" id="board"></div>
  <div>
    <button data-dir="left">Izquierda</button>
    <button data-dir="right">Derecha</button>
    <button data-dir="up">Arriba</button>
    <button data-dir="down">Abajo</button>
  </div>
  <p class="status" id="status"></p>
  <script>
    const size = 4;
    let board = Array(size).fill().map(() => Array(size).fill(0));
    function randomTile() {
      const libres = [];
      board.forEach((row, r) => row.forEach((val, c) => { if (!val) libres.push([r, c]); }));
      if (libres.length === 0) return;
      const [r, c] = libres[Math.floor(Math.random() * libres.length)];
      board[r][c] = Math.random() > 0.8 ? 4 : 2;
    }
    function compact(line) {
      const vals = line.filter(Boolean);
      for (let i = 0; i < vals.length - 1; i++) {
        if (vals[i] === vals[i + 1]) { vals[i] *= 2; vals[i + 1] = 0; }
      }
      return vals.filter(Boolean).concat(Array(size - vals.filter(Boolean).length).fill(0));
    }
    function rotate(times) {
      for (let t = 0; t < times; t++) {
        board = board[0].map((_, idx) => board.map(row => row[idx]).reverse());
      }
    }
    function move(dir) {
      const before = JSON.stringify(board);
      if (dir === 'right') rotate(2);
      if (dir === 'up') rotate(1);
      if (dir === 'down') rotate(3);
      board = board.map(row => compact(row));
      if (dir === 'right') rotate(2);
      if (dir === 'up') rotate(3);
      if (dir === 'down') rotate(1);
      if (before !== JSON.stringify(board)) randomTile();
      render();
    }
    function render() {
      const cont = document.getElementById('board');
      cont.innerHTML = '';
      board.flat().forEach(val => {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.dataset.v = val;
        tile.textContent = val || '';
        cont.appendChild(tile);
      });
      const max = Math.max(...board.flat());
      document.getElementById('status').textContent = 'Mayor ficha: ' + max;
    }
    document.querySelectorAll('button[data-dir]').forEach(btn => btn.addEventListener('click', () => move(btn.dataset.dir)));
    randomTile(); randomTile(); render();
  </script>
</body>
</html>`;

const catalog = [
    {
        id: 'wordle',
        title: 'React Wordle (cwackerfuss/react-wordle)',
        license: 'MIT',
        repoUrl: 'https://github.com/cwackerfuss/react-wordle',
        reuse: [
            'Componentes reutilizables: teclado virtual, cuadriculas animadas y control de intentos.',
            'Activos: esquema de colores accesibles y estados de teclas correctas/parciales.',
            'Lógica: validación de palabras y retroalimentación letra a letra adaptable a fonemas objetivo.'
        ],
        adaptation: 'Integración en Tailwind manteniendo mensajes en español y la retroalimentación cromática para generalizar la articulación.',
        embed: wordleIframe,
        linkLabel: 'Demo interactiva integrada'
    },
    {
        id: '2048',
        title: '2048 (gabrielecirulli/2048)',
        license: 'MIT',
        repoUrl: 'https://github.com/gabrielecirulli/2048',
        reuse: [
            'Lógica reutilizable: combinación de fichas y cálculo de movimientos válidos para planificar secuencias.',
            'UI: tablero 4x4 y fichas numeradas fáciles de adaptar a pictogramas o sílabas.',
            'Controles: soporte para teclado y gestos que puede trasladarse a dispositivos táctiles en clínica.'
        ],
        adaptation: 'Se puede vestir con clases de Tailwind y lenguaje clínico (objetivo, refuerzo, registro) sin nuevas dependencias.',
        embed: tilesIframe,
        linkLabel: 'Mini tablero 2048 adaptado'
    },
    {
        id: 'tetris',
        title: 'React Tetris (chvin/react-tetris)',
        license: 'MIT',
        repoUrl: 'https://github.com/chvin/react-tetris',
        reuse: [
            'Componentes: motor de renderizado con canvas/React y piezas en JSON reutilizables.',
            'Assets: sprites minimalistas listos para re-colorear según la paleta de la app.',
            'Lógica: bucle de juego y detección de líneas que facilitan ejercicios de velocidad de reacción.'
        ],
        adaptation: 'Requiere build separada para optimizar performance; puede cargarse vía iframe estático y controlarse con mensajes postMessage sin exponer claves.',
        linkLabel: 'Abrir demo externa',
        externalDemo: 'https://chvin.github.io/react-tetris/'
    }
];

export function InteractiveActivities() {
    return (
        <div className="space-y-10 animate-in fade-in">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-slate-500 text-sm mb-1">Laboratorio digital</p>
                    <h1 className="text-3xl font-bold text-slate-900">Actividades interactivas</h1>
                    <p className="text-slate-500 mt-2 max-w-3xl">
                        Selección de módulos abiertos listos para adaptar a sesiones de terapia. Cada tarjeta indica la licencia, los
                        componentes React reutilizables y cómo integrarlos con el diseño Tailwind sin claves ni dependencias cerradas.
                    </p>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {catalog.map(item => (
                    <div key={item.id} className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-4">
                        <div className="flex items-start justify-between">
                            <div className="space-y-2">
                                <p className="inline-flex items-center px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold">{item.license}</p>
                                <h2 className="text-xl font-semibold text-slate-900">{item.title}</h2>
                                <a
                                    href={item.repoUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center text-sm text-teal-700 hover:text-teal-900"
                                >
                                    <ExternalLink className="h-4 w-4 mr-1" />
                                    Ver repositorio
                                </a>
                            </div>
                            <div className="flex items-center space-x-2 text-slate-400">
                                <ShieldCheck className="h-5 w-5" />
                                <span className="text-xs uppercase tracking-wide">Licencia compatible</span>
                            </div>
                        </div>

                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
                            <div className="flex items-center text-sm font-semibold text-slate-700">
                                <Lightbulb className="h-4 w-4 mr-2 text-amber-500" />
                                Piezas reutilizables
                            </div>
                            <ul className="list-disc list-inside space-y-1 text-slate-600">
                                {item.reuse.map((point, idx) => (
                                    <li key={idx}>{point}</li>
                                ))}
                            </ul>
                            <p className="text-sm text-slate-600"><span className="font-semibold">Adaptación propuesta:</span> {item.adaptation}</p>
                        </div>

                        {item.embed && (
                            <div className="space-y-2">
                                <div className="flex items-center text-sm text-slate-600">
                                    <LinkIcon className="h-4 w-4 mr-2 text-teal-600" />
                                    {item.linkLabel}
                                </div>
                                <iframe
                                    title={item.title}
                                    srcDoc={item.embed}
                                    className="w-full h-72 rounded-lg border border-slate-200 bg-white"
                                    sandbox="allow-scripts"
                                />
                            </div>
                        )}

                        {item.externalDemo && (
                            <a
                                href={item.externalDemo}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center text-sm text-teal-700 hover:text-teal-900"
                            >
                                <ExternalLink className="h-4 w-4 mr-1" />
                                {item.linkLabel}
                            </a>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
