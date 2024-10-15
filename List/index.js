const tarea = document.querySelector('#task-input');
const btnAdd = document.querySelector('#main-form-btn');
const form  = document.querySelector('#main-form');
const list = document.querySelector('#task-list');

// es el  evento que detecta cuando se escribe en el input
tarea.addEventListener('input', () => {
    if (tarea.value === '') {
        btnAdd.disabled = true;
    }
    else {
        btnAdd.disabled = false;
    }
});

const tareasManager = () => {
    let tareas = [];
    const publicApi = {
        añadirTarea: (nuevaTarea) => {
            tareas = tareas.concat(nuevaTarea);
        },
        guardarNavegador: () => {
            localStorage.setItem("listaTareas", JSON.stringify(tareas));
        },
        renderTareas: ()=> {
            //borrar el contenido de la lista
            list.innerHTML = '';

            tareas.forEach(tarea => {

                const ListItem = document.createElement('li');
                ListItem.classList.add('task-list-item');
                ListItem.id = tarea.id;

                const contenido = tarea.tarea;

                let btnStatus = '';
                if (tarea.estado === 'chequeada') {
                    btnStatus = 'btnCheck';
                } else {
                    btnStatus = '';
                }
                ListItem.innerHTML = `<div class="task-input-container">
                        <p class="task-list-item-text">${contenido}</p>
                    </div>

                    <div class="btns-container">
                        <button class="check-btn">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                 <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                             </svg>
                      </button>

                     <button class="delete-btn">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" >
                              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                     </button>
                 </div>`;

                //5 agregar el li a la ul (como un hijo)
                list.append(ListItem);

            })
            
            
        },
        eliminarTarea: (id) => {
            tareas = tareas.filter(tarea => {
                if (id !== tarea.id) {
                    return tarea;
                }
            });
        },
        editarTarea: (tareaEditada) => {
            tareas = tareas.map(tarea => {
                
                if (tareaEditada.id === tarea.id) {
                    
                    return tareaEditada;
                    console.log(tareaEditada)
                } else {
                    
                    return tarea;
                }
            })
        },
        reemplazarTareas: (tareasLocales) => {
            tareas = tareasLocales;
        },
        contadorTareas: () => {
            let contadorTotal = 0;
            let contadorChequeadas = 0;
            let contadorNoChequeadas = 0;
            tareas.forEach(tarea => {
        
                if (tarea.estado === 'chequeada') {
                    contadorChequeadas ++;
                    contadorTotal ++;
                } else {
                    contadorNoChequeadas ++;
                    contadorTotal ++;
                }
            })
        
            const inputTotal = document.querySelector('#Tareas');
            const inputChequeadas = document.querySelector('#Completadas');
            const inputNochequeadas = document.querySelector('#Inconpletas');
        
            inputTotal.textContent = `Total: ${contadorTotal}`;
            inputChequeadas.textContent = `Completadas: ${contadorChequeadas}`;
            inputNochequeadas.textContent = `Incompletas: ${contadorNoChequeadas}`;
        }
    }
    return publicApi;
}

const manager = tareasManager();

const displayList = () => {
  if (list.childElementCount === 0) {
    list.style.display = 'none';
} else {
  list.style.display = 'flex';
}
}

const chequear = (identificacion, valor, estado) => {

    const tareaEditada = {
        id: identificacion,
        tarea: valor,
        estado: estado
        }
        

        manager.editarTarea(tareaEditada);

        manager.guardarNavegador();
}

list.addEventListener('click', e => {

    const eliminarbtn = e.target.closest('.delete-btn');
    const chequearbtn = e.target.closest('.check-btn');

    if (eliminarbtn) {
        const li = eliminarbtn.parentElement.parentElement;
        const id = li.id;

        manager.eliminarTarea(id);
        manager.guardarNavegador();

        manager.renderTareas();

        manager.contadorTareas();

        displayList();
    }
    if (chequearbtn) {
        const li = chequearbtn.parentElement.parentElement;
        const tareaInput = li.children[0].children[0];
        const valorP = tareaInput.textContent;
        
        if (tareaInput.classList.contains('chequeada')) {
            tareaInput.classList.remove('chequeada');
            chequearbtn.classList.remove('btnCheck');
            
            chequear(li.id, valorP,'noChequeada');
            manager.contadorTareas();
            
        }else {
            tareaInput.classList.add('chequeada');
            chequearbtn.classList.add('btnCheck');
            chequear(li.id, valorP,'chequeada');

            manager.contadorTareas();
        }
    }
})

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nuevaTarea = {
        id: crypto.randomUUID(),
        tarea: tarea.value,
        estado: "noChequeado"
    }

    manager.añadirTarea(nuevaTarea)

    manager.guardarNavegador()

    manager.renderTareas();

    manager.contadorTareas();

    displayList();
});

window.onload = () => {
    const obtenerTarea = localStorage.getItem("listaTareas");
    const  tareasLocales = JSON.parse(obtenerTarea);
    if (!tareasLocales) {
        manager.reemplazarTareas([]);
    }else {

        manager.reemplazarTareas(tareasLocales);
    }

    manager.renderTareas();

    manager.contadorTareas();

    displayList();
}