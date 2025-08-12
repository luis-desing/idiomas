        // --- Listas de Verbos por Defecto (CORREGIDAS y COMPLETAS) ---
        const verbosInglesDefault = [
            ["be", "Ser/Estar"], ["have", "Tener/Haber"], ["do", "Hacer"], ["say", "Decir"], ["go", "Ir"],
            ["get", "Obtener"], ["make", "Hacer"], ["know", "Saber"], ["think", "Pensar"], ["take", "Tomar"],
            ["see", "Ver"], ["come", "Venir"], ["want", "Querer"], ["look", "Mirar"], ["use", "Usar"],
            ["find", "Encontrar"], ["give", "Dar"], ["tell", "Decir"], ["work", "Trabajar"], ["call", "Llamar"],
            ["try", "Intentar"], ["ask", "Preguntar"], ["need", "Necesitar"], ["feel", "Sentir"], ["become", "Convertirse"],
            ["leave", "Dejar/Salir"], ["put", "Poner"], ["mean", "Significar"], ["keep", "Mantener"], ["let", "Permitir"],
            ["begin", "Empezar"], ["seem", "Parecer"], ["help", "Ayudar"], ["talk", "Hablar"], ["turn", "Girar"],
            ["start", "Comenzar"], ["show", "Mostrar"], ["hear", "Oír"], ["play", "Jugar/Tocar"], ["run", "Correr"],
            ["move", "Mover"], ["like", "Gustar"], ["live", "Vivir"], ["believe", "Creer"], ["hold", "Sostener"],
            ["bring", "Traer"], ["happen", "Suceder"], ["write", "Escribir"], ["sit", "Sentarse"], ["stand", "Estar de pie"]
        ];

        const verbosItalianoDefault = [
            ["essere", "Ser/Estar"], ["avere", "Tener/Haber"], ["fare", "Hacer"], ["dire", "Decir"], ["potere", "Poder"],
            ["volere", "Querer"], ["sapere", "Saber"], ["stare", "Estar/Permanecer"], ["dovere", "Deber/Tener que"], ["vedere", "Ver"],
            ["andare", "Ir"], ["venire", "Venir"], ["dare", "Dar"], ["parlare", "Hablar"], ["trovare", "Encontrar"],
            ["sentire", "Sentir/Oír"], ["lasciare", "Dejar"], ["prendere", "Tomar/Coger"], ["guardare", "Mirar"], ["mettere", "Poner"],
            ["pensare", "Pensar"], ["passare", "Pasar"], ["credere", "Creer"], ["portare", "Llevar/Traer"], ["capire", "Entender"],
            ["tornare", "Volver/Regresar"], ["morire", "Morir"], ["chiamare", "Llamar"], ["cercare", "Buscar"], ["entrare", "Entrar"],
            ["vivere", "Vivir"], ["aprire", "Abrir"], ["lavorare", "Trabajar"], ["ricevere", "Recibir"], ["chiedere", "Pedir/Preguntar"],
            ["ricordare", "Recordar"], ["bisognare", "Necesitar/Hacer falta"], ["tenere", "Tener/Mantener"], ["cominciare", "Comenzar"], ["rispondere", "Responder"],
            ["aspettare", "Esperar"], ["uscire", "Salir"], ["seguire", "Seguir"], ["rimanere", "Permanecer/Quedarse"], ["perdere", "Perder"],
            ["piacere", "Gustar"], ["dormire", "Dormir"], ["scrivere", "Escribir"], ["leggere", "Leer"], ["finire", "Terminar"]
        ];

        // --- Variables Globales ---
        // ... (sin cambios en las declaraciones) ...
        let currentVerbos = [];
        let currentLangFrom = "Inglés";
        let currentLangTo = "Español";
        let verboActual = null;
        let respuestaCorrectaTexto = '';
        let opcionesBotones = [];
        let botonSiguiente, botonIniciarReiniciar, resultadoTextoElem, verboPalabraElem, estadoArchivoElem, inputArchivo, listaVerbosCompletaElem, totalVerbosListaElem, langFromLabelElem, langListLabelElem, btnIdiomaIngles, btnIdiomaItaliano, verbosAcertadosElem, totalVerbosPracticaElem;
        let botonesDeshabilitados = false;
        let verbosCompletados = new Set();
        let verbosAcertadosCount = 0;
        let modoArchivo = false;


        // --- Inicialización ---
        document.addEventListener('DOMContentLoaded', () => {
            // ... (Referencias DOM y validación sin cambios) ...
             opcionesBotones = [ document.getElementById("opcion1"), document.getElementById("opcion2"), document.getElementById("opcion3") ];
            botonSiguiente = document.getElementById("siguiente");
            botonIniciarReiniciar = document.getElementById("botonIniciarReiniciar");
            resultadoTextoElem = document.getElementById("resultado-texto");
            verboPalabraElem = document.getElementById("verbo-palabra");
            estadoArchivoElem = document.getElementById("estadoArchivo");
            inputArchivo = document.getElementById("archivoVerbos");
            listaVerbosCompletaElem = document.getElementById("listaVerbosCompleta");
            totalVerbosListaElem = document.getElementById("totalVerbosLista");
            verbosAcertadosElem = document.getElementById("verbosAcertados");
            totalVerbosPracticaElem = document.getElementById("totalVerbosPractica");
            langFromLabelElem = document.getElementById("langFromLabel");
            langListLabelElem = document.getElementById("langListLabel");
            btnIdiomaIngles = document.getElementById("btnIdiomaIngles");
            btnIdiomaItaliano = document.getElementById("btnIdiomaItaliano");

            if (!botonSiguiente || !verboPalabraElem || opcionesBotones.some(btn => !btn) || !totalVerbosPracticaElem) {
                console.error("Faltan elementos DOM esenciales."); return;
            }

            // ... (Event Listeners sin cambios) ...
             opcionesBotones.forEach(opcion => opcion?.addEventListener("click", () => comprobarRespuesta(opcion)) );
            botonSiguiente?.addEventListener("click", prepararSiguienteVerbo);
            botonIniciarReiniciar?.addEventListener("click", iniciarPractica);
            inputArchivo?.addEventListener('change', handleFileSelect);
            btnIdiomaIngles?.addEventListener("click", () => cargarIdiomaDefault('ingles'));
            btnIdiomaItaliano?.addEventListener("click", () => cargarIdiomaDefault('italiano'));


            console.log("DOM cargado, cargando idioma por defecto (Inglés)...");
            cargarIdiomaDefault('ingles'); // Carga Inglés al inicio

            // --- Lógica para controlar la lista plegable ---
            const listaVerbosPlegable = document.getElementById('listaVerbosPlegable');
            
            function manejarEstadoPlegable() {
                if (!listaVerbosPlegable) return;
                // El punto de quiebre es 900px, igual que en el CSS
                if (window.innerWidth <= 900) {
                    listaVerbosPlegable.open = false;
                } else {
                    listaVerbosPlegable.open = true;
                }
            }

            // Comprobar al cargar la página
            manejarEstadoPlegable();

            // Comprobar si se cambia el tamaño de la ventana
            window.addEventListener('resize', manejarEstadoPlegable);
        });

        // --- Cargar Idioma por Defecto ---
        function cargarIdiomaDefault(idioma) {
             console.log(`Cargando idioma por defecto: ${idioma}`);
             modoArchivo = false;
             if(inputArchivo) inputArchivo.value = '';

             if (idioma === 'ingles') {
                 currentVerbos = [...verbosInglesDefault]; // <- Asegura usar la lista completa
                 currentLangFrom = "Inglés"; currentLangTo = "Español";
                 btnIdiomaIngles?.classList.add('active');
                 btnIdiomaItaliano?.classList.remove('active');
             } else if (idioma === 'italiano') {
                 currentVerbos = [...verbosItalianoDefault]; // <- Asegura usar la lista completa
                 currentLangFrom = "Italiano"; currentLangTo = "Español";
                 btnIdiomaIngles?.classList.remove('active');
                 btnIdiomaItaliano?.classList.add('active');
             } else { return; }

             console.log(`'currentVerbos' ahora tiene ${currentVerbos.length} elementos.`); // Log para verificar longitud
             actualizarEtiquetasIdioma();
             iniciarPractica();
        }

         // --- Función Principal de Inicio/Reinicio ---
         function iniciarPractica() {
             console.log(`Iniciando/Reiniciando práctica actual con ${currentVerbos.length} palabras.`);
             verbosCompletados.clear();
             verbosAcertadosCount = 0;
             limpiarEstilosOpciones();
             if (resultadoTextoElem) resultadoTextoElem.textContent = "";
             if (resultadoTextoElem) resultadoTextoElem.style.color = "";
             popularListaCompleta();
             actualizarContadorDisplay(); // <- Se llama DESPUÉS de tener currentVerbos con su longitud final
             prepararSiguienteVerbo();

             if (estadoArchivoElem) {
                 if (modoArchivo) {
                     const nombreArchivo = inputArchivo?.files[0]?.name ?? 'desconocido';
                     estadoArchivoElem.textContent = `Archivo "${nombreArchivo}" cargado (${currentLangFrom} -> ${currentLangTo}). ${currentVerbos.length} palabras.`;
                 } else {
                     estadoArchivoElem.textContent = `Usando ${currentVerbos.length} verbos por defecto (${currentLangFrom} -> ${currentLangTo}).`;
                 }
             }

             habilitarBotones(currentVerbos && currentVerbos.length >= 3);
             if (botonSiguiente) botonSiguiente.disabled = true;
         }

         // --- Lógica de Carga de Archivo ---
         function handleFileSelect(event) { /* ... (sin cambios) ... */
             const file = event.target.files[0];
            if (!file) {
                if (estadoArchivoElem) estadoArchivoElem.textContent = 'No se seleccionó archivo.';
                return;
            }
            if (file.type !== 'text/plain') {
                 if (estadoArchivoElem) estadoArchivoElem.textContent = 'Error: El archivo debe ser .txt';
                 if (inputArchivo) inputArchivo.value = '';
                 return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                parsearArchivoVerbos(e.target.result, file.name);
            };
            reader.onerror = () => {
                 if (estadoArchivoElem) estadoArchivoElem.textContent = 'Error al leer el archivo.';
                habilitarBotones(false);
                if (totalVerbosListaElem) totalVerbosListaElem.textContent = '0';
                if (totalVerbosPracticaElem) totalVerbosPracticaElem.textContent = '0';
                if (verbosAcertadosElem) verbosAcertadosElem.textContent = '0';
            };
            if (estadoArchivoElem) estadoArchivoElem.textContent = `Cargando "${file.name}"...`;
            reader.readAsText(file, 'UTF-8');
        }

        function parsearArchivoVerbos(contenido, nombreArchivo = 'archivo') { /* ... (sin cambios) ... */
             console.log("Parseando archivo:", nombreArchivo);
            const lineas = contenido.split(/[\r\n]+/);
            const nuevosVerbos = [];
            let erroresFormato = 0;
            const verbosOrigenVistos = new Set();
            let langFromFile = "Origen";
            let langToFile = "Destino";
            let primeraLineaDatos = 0;
            for (let i = 0; i < lineas.length; i++) {
                const lineaTrim = lineas[i].trim();
                if (lineaTrim === '' || lineaTrim.startsWith('//')) continue;
                if (lineaTrim.startsWith('#LANG:') || lineaTrim.startsWith('#IDIOMA:')) {
                    const partesLang = lineaTrim.substring(lineaTrim.indexOf(':') + 1).split(',');
                    if (partesLang.length >= 2) { langFromFile = partesLang[0].trim() || langFromFile; langToFile = partesLang[1].trim() || langToFile; }
                    else if (partesLang.length === 1) { langFromFile = partesLang[0].trim() || langFromFile; }
                    console.log(`Idioma detectado en archivo: ${langFromFile} -> ${langToFile}`);
                    primeraLineaDatos = i + 1; break;
                } else if (lineaTrim.startsWith('#')) { continue; } else { break; }
            }
            for (let i = primeraLineaDatos; i < lineas.length; i++) {
                 let linea = lineas[i].trim();
                 if (linea === '' || linea.startsWith('#') || linea.startsWith('//')) continue;
                 const partes = linea.split(',');
                 if (partes.length >= 2) {
                     const palabraOrigen = partes[0].trim();
                     const traduccion = partes.slice(1).join(',').trim();
                     if (palabraOrigen && traduccion && !verbosOrigenVistos.has(palabraOrigen.toLowerCase())) { nuevosVerbos.push([palabraOrigen, traduccion]); verbosOrigenVistos.add(palabraOrigen.toLowerCase()); }
                     else { if(!palabraOrigen || !traduccion) erroresFormato++; }
                 } else { erroresFormato++; }
             }
            console.log(`Parseo de archivo completado: ${nuevosVerbos.length} palabras válidas, ${erroresFormato} errores.`);
            if (nuevosVerbos.length > 0) {
                currentVerbos = nuevosVerbos; currentLangFrom = langFromFile; currentLangTo = langToFile; modoArchivo = true;
                btnIdiomaIngles?.classList.remove('active'); btnIdiomaItaliano?.classList.remove('active');
                actualizarEtiquetasIdioma();
                iniciarPractica(); // <- Llama a iniciar práctica para reiniciar todo con los datos nuevos
            } else {
                 if (estadoArchivoElem) estadoArchivoElem.textContent = `Error: No se cargaron palabras válidas de "${nombreArchivo}". Verifique formato. ${erroresFormato > 0 ? `(${erroresFormato} líneas con error)` : ''}`;
                 habilitarBotones(false);
                 if (verboPalabraElem) verboPalabraElem.textContent = "Error";
                 opcionesBotones.forEach(btn => { if (btn) btn.textContent = '-'; });
                 if (listaVerbosCompletaElem) listaVerbosCompletaElem.innerHTML = '<li>Error al cargar.</li>';
                 if (totalVerbosListaElem) totalVerbosListaElem.textContent = '0';
                 if (totalVerbosPracticaElem) totalVerbosPracticaElem.textContent = '0';
                 if (verbosAcertadosElem) verbosAcertadosElem.textContent = '0';
            }
        }

         // --- Actualizar Etiquetas de Idioma ---
         function actualizarEtiquetasIdioma() { /* ... (sin cambios) ... */
             if (langFromLabelElem) langFromLabelElem.textContent = currentLangFrom;
            if (langListLabelElem) langListLabelElem.textContent = currentLangFrom;
        }

        // --- Lógica de Visualización ---
        function popularListaCompleta() { /* ... (sin cambios) ... */
              if (!listaVerbosCompletaElem || !totalVerbosListaElem) return;
             listaVerbosCompletaElem.innerHTML = '';
             const total = currentVerbos.length;
             totalVerbosListaElem.textContent = total;
             if (total === 0) { listaVerbosCompletaElem.innerHTML = '<li>No hay palabras.</li>'; return; }
             currentVerbos.forEach(parVerbo => { const [origen] = parVerbo; const li = document.createElement('li'); li.textContent = origen; li.dataset.verb = origen; if (verbosCompletados.has(origen)) { li.classList.add('verbo-completado'); } listaVerbosCompletaElem.appendChild(li); });
        }

        function actualizarContadorDisplay() { /* ... (sin cambios) ... */
             if (verbosAcertadosElem) verbosAcertadosElem.textContent = verbosAcertadosCount;
            if (totalVerbosPracticaElem) totalVerbosPracticaElem.textContent = currentVerbos.length;
        }

        // --- Lógica Principal del Juego ---
        function habilitarBotones(habilitar) { /* ... (sin cambios) ... */
             opcionesBotones.forEach(btn => { if (btn) btn.disabled = !habilitar; });
            botonesDeshabilitados = !habilitar;
        }
        function limpiarEstilosOpciones() { /* ... (sin cambios) ... */
              opcionesBotones.forEach(opc => { if (opc) opc.classList.remove("correcta", "incorrecta-seleccionada", "respuesta-correcta-no-elegida"); });
        }

        function mostrarVerbo() { /* ... (sin cambios en la lógica interna, ya usa currentVerbos y las comprobaciones) ... */
            console.log("Mostrando palabra...");
            if (!verboPalabraElem || !resultadoTextoElem || opcionesBotones.some(btn => !btn)) { console.error("Error en mostrarPalabra: Faltan elementos."); return; }
            if (!currentVerbos || currentVerbos.length < 3) {
                 console.warn("No hay suficientes palabras para mostrar.");
                 if (verboPalabraElem) verboPalabraElem.textContent = "Pocas palabras";
                 if (resultadoTextoElem) resultadoTextoElem.textContent = "Necesitas al menos 3 palabras.";
                 habilitarBotones(false);
                 opcionesBotones.forEach(btn => { if (btn) { btn.textContent = '-'; btn.disabled = true; }});
                 if(botonSiguiente) botonSiguiente.disabled = true;
                 return;
             }
            const verbosPendientes = currentVerbos.filter(v => v && v.length > 0 && !verbosCompletados.has(v[0]));
            console.log(`Palabras pendientes: ${verbosPendientes.length}`);
            if (verbosPendientes.length === 0) {
                  console.log("¡Todas las palabras completadas!");
                 if (verboPalabraElem) verboPalabraElem.textContent = "¡Felicidades!";
                 if (resultadoTextoElem) { resultadoTextoElem.textContent = "¡Has completado todas las palabras!"; resultadoTextoElem.style.color = "#6f42c1"; }
                 habilitarBotones(false);
                 opcionesBotones.forEach(btn => { if(btn) btn.textContent = '🏆'; });
                 if(botonSiguiente) botonSiguiente.disabled = true;
                 return;
             }
            habilitarBotones(true);
            const indiceAleatorioPendiente = Math.floor(Math.random() * verbosPendientes.length);
            verboActual = verbosPendientes[indiceAleatorioPendiente];
            if (!verboActual || verboActual.length < 2) { console.error("Error: Se seleccionó una palabra inválida de los pendientes.", verboActual); prepararSiguienteVerbo(); return; }
            respuestaCorrectaTexto = verboActual[1];
            const indiceVerboCorrectoOriginal = currentVerbos.findIndex(v => v && v.length > 0 && v[0] === verboActual[0]);
            if (indiceVerboCorrectoOriginal === -1) { console.error("Error: No se encontró el índice original de la palabra seleccionada:", verboActual[0]); prepararSiguienteVerbo(); return; }
            console.log("Palabra actual:", verboActual[0]);
            verboPalabraElem.textContent = verboActual[0];
            let opcionesIncorrectasIndices = new Set();
            const posiblesIndicesIncorrectos = currentVerbos.map((v, index) => (v && v.length > 1) ? index : -1).filter(index => index !== -1 && index !== indiceVerboCorrectoOriginal);
            while (opcionesIncorrectasIndices.size < 2 && posiblesIndicesIncorrectos.length > 0) { const randomIndex = Math.floor(Math.random() * posiblesIndicesIncorrectos.length); opcionesIncorrectasIndices.add(posiblesIndicesIncorrectos.splice(randomIndex, 1)[0]); }
            const indicesOpcionesFinales = [indiceVerboCorrectoOriginal, ...opcionesIncorrectasIndices];
            let opcionesMezcladas = indicesOpcionesFinales.sort(() => Math.random() - 0.5);
            console.log("Índices de opciones mezcladas:", opcionesMezcladas);
            opcionesBotones.forEach((boton, i) => {
                if (!boton) return;
                const indiceOpcionActual = opcionesMezcladas[i];
                if (indiceOpcionActual !== undefined && currentVerbos[indiceOpcionActual] && currentVerbos[indiceOpcionActual].length > 1 && currentVerbos[indiceOpcionActual][1] !== undefined && currentVerbos[indiceOpcionActual][1] !== null) {
                    boton.textContent = currentVerbos[indiceOpcionActual][1];
                    boton.dataset.correcta = (indiceOpcionActual === indiceVerboCorrectoOriginal).toString();
                    boton.disabled = false;
                    console.log(`Botón ${i} asignado: ${currentVerbos[indiceOpcionActual][1]}`);
                } else {
                    boton.textContent = '-'; // Placeholder si hay error
                    boton.disabled = true;
                    console.error(`Error al asignar opción ${i}, índice ${indiceOpcionActual}, datos:`, currentVerbos[indiceOpcionActual]);
                }
            });
             if (botonSiguiente) botonSiguiente.disabled = true;
        }


        function comprobarRespuesta(opcionSeleccionada) { /* ... (sin cambios) ... */
             console.log("Comprobando respuesta...");
             if (!opcionSeleccionada || !resultadoTextoElem || !verboActual) return;
             opcionesBotones.forEach(btn => { if (btn) btn.disabled = true; });
             const esCorrecta = opcionSeleccionada.dataset.correcta === "true";
             const palabraOrigenActual = verboActual[0];
             let acertadoEsteTurno = false;
             if (esCorrecta) {
                 resultadoTextoElem.textContent = "¡Correcto!";
                 resultadoTextoElem.style.color = "#155724";
                 opcionSeleccionada.classList.add("correcta");
                 if (!verbosCompletados.has(palabraOrigenActual)) { verbosCompletados.add(palabraOrigenActual); acertadoEsteTurno = true; const liCorrespondiente = listaVerbosCompletaElem?.querySelector(`li[data-verb="${palabraOrigenActual}"]`); if (liCorrespondiente) { liCorrespondiente.classList.add('verbo-completado'); } }
             } else {
                 resultadoTextoElem.textContent = `Incorrecto. Era: ${respuestaCorrectaTexto}`;
                 resultadoTextoElem.style.color = "#721c24";
                 opcionSeleccionada.classList.add("incorrecta-seleccionada");
                 opcionesBotones.forEach(opc => { if (opc && opc.dataset.correcta === "true") { opc.classList.add("respuesta-correcta-no-elegida"); } });
             }
             if (acertadoEsteTurno) { verbosAcertadosCount++; actualizarContadorDisplay(); }
             if (botonSiguiente) botonSiguiente.disabled = false;
        }

        function prepararSiguienteVerbo() { /* ... (sin cambios) ... */
             console.log("Preparando siguiente palabra...");
            if (resultadoTextoElem) { resultadoTextoElem.textContent = ""; resultadoTextoElem.style.color = ""; }
            limpiarEstilosOpciones();
            mostrarVerbo();
        }