var currentHighlightIndex = 0;
var sets;
var gotoPositionClicked = false;

function generateSequence() {
    var startTime = performance.now();
    var length = parseInt(document.getElementById("length").value);
    if (length < 3 || length > 10) {
        alert("Ingrese un número entre 3 y 10.");
        return;
    }

    var binarySets = [];
    
    // Generate the binary sequence
    for (var i = 0; i < Math.pow(2, length); i++) {
        var binary = i.toString(2).padStart(length, "0");
        if (binarySets.indexOf(binary) === -1) {
            binarySets.push(binary);
        }
    }

    var endTime = performance.now();
    var executionTime = endTime - startTime;

    var resultDiv = document.getElementById("result");
    resultDiv.innerHTML = `
        <p class="mb-2">Tiempo de ejecución: ${executionTime.toFixed(2)} milisegundos</p>
        <div class="row">
            ${binarySets.map((set, index) => `
                <div class="col-auto">
                    <button type="button" class="btn btn-outline-dark mb-2 set-btn" onclick="highlightSet(${index})" style="display: none;">${set}</button>
                </div>
            `).join("")}
        </div>
    `;
    currentHighlightIndex = 0;
    sets = document.getElementById("result").querySelectorAll(".set-btn");
    sets[currentHighlightIndex].style.display = "block";

    // Mostrar el campo de entrada para ir a la posición
    var gotoPositionDiv = document.getElementById("gotoPositionDiv");
    gotoPositionDiv.style.display = "block";
    var positionInput = document.getElementById("position");
    positionInput.max = binarySets.length;
    positionInput.value = 1;

    // Mostrar el número total de conjuntos
    document.getElementById("totalSets").innerText = binarySets.length;

    // Mostrar el conjunto en la posición seleccionada
    document.getElementById("currentSet").style.display = "block";
    document.getElementById("currentSetLabel").innerText = binarySets[0];

    // Resaltar el primer conjunto seleccionado
    highlightSet(0);

    // Reiniciar el estado de la variable gotoPositionClicked
    gotoPositionClicked = false;
}

function highlightSet(index) {
    for (var i = 0; i < sets.length; i++) {
        sets[i].classList.remove("active");
        sets[i].style.display = "none";
    }
    sets[index].classList.add("active");
    sets[index].style.display = "block";
    currentHighlightIndex = index;
}

function gotoPosition() {
    var position = parseInt(document.getElementById("position").value);
    var maxPosition = parseInt(document.getElementById("position").max);
    if (position >= 1 && position <= maxPosition) {
        sets[currentHighlightIndex].classList.remove("active");
        sets[currentHighlightIndex].style.display = "none";
        currentHighlightIndex = position - 1;
        sets[currentHighlightIndex].classList.add("active");
        sets[currentHighlightIndex].style.display = "block";
        document.getElementById("currentSetLabel").innerText = sets[currentHighlightIndex].textContent;

        // Mostrar el botón para mostrar todos los conjuntos
        document.getElementById("showAllButton").style.display = "block";

        // Si el botón "Ir" se ha presionado previamente, ejecutar la función showAllSets
        if (gotoPositionClicked) {
            showAllSets();
        } else {
            // Establecer gotoPositionClicked a true después del primer clic en el botón "Ir"
            gotoPositionClicked = true;
        }
    } else {
        alert("Posición fuera de rango.");
    }
}

function showAllSets() {
    var allSetsContainer = document.getElementById("allSets");
    allSetsContainer.innerHTML = "";
    for (var i = 0; i < sets.length; i++) {
        var button = document.createElement("button");
        button.textContent = sets[i].textContent;
        button.classList.add("btn", "btn-outline-dark", "set-btn");
        button.onclick = function() {
            gotoSelectedSetPosition(this.textContent);
        };
        allSetsContainer.appendChild(button);

        // Resaltar el conjunto seleccionado
        if (i === currentHighlightIndex) {
            button.classList.add("active");
        }
    }
    document.getElementById("allSetsContainer").style.display = "block";
}

function gotoSelectedSetPosition() {
    var selectedSetButton = document.querySelector("#allSetsContainer .set-btn.active");
    if (selectedSetButton) {
        selectedSetButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

let currentIndex = 0;
let nValue = 0;

function deBruijn(n) {
    let k = 2;
    let sequence = Array(n).fill(0); // Inicializamos sequence aquí
    let db = function(t, p) {
        if (t > n) {
            if (n % p === 0) {
                for (let i = 1; i <= p; i++) {
                    sequence.push(sequence[i]);
                }
            }
        } else {
            sequence[t] = sequence[t - p];
            db(t + 1, p);
            for (let j = sequence[t - p] + 1; j < k; j++) {
                sequence[t] = j;
                db(t + 1, t);
            }
        }
    }
    db(1, 1);
    return sequence.join("");
}

function resaltarNumeros() {
    let n = document.getElementById("length").value;
    if (n !== nValue) {
        nValue = n;
        currentIndex = 0;
    }

    let dbSequence = deBruijn(nValue);
    let length = dbSequence.length;
    let end = currentIndex + parseInt(nValue);
    if (end > length) {
        currentIndex = 0;
        end = parseInt(nValue);
    }

    let resaltado = '';
    let conjuntoResaltado = dbSequence.substring(currentIndex, end);
    for (let i = 0; i < length; i++) {
        if (i >= currentIndex && i < end) {
            resaltado += `<span style="background-color: ${i >= currentIndex && i < end ? '#800080' : 'transparent'}; cursor: pointer;" onclick="highlightSet(${i})">${dbSequence[i]}</span>`;
        } else {
            resaltado += `<span style="cursor: pointer;" onclick="highlightSet(${i})">${dbSequence[i]}</span>`;
        }
    }

    currentIndex++;
    document.getElementById("debruijn").innerHTML = resaltado;

    // Resaltar el conjunto correspondiente en la tabla
    let conjuntos = document.getElementById("conjuntos").getElementsByTagName("p");
    for (let i = 0; i < conjuntos.length; i++) {
        if (conjuntos[i].innerHTML.includes(conjuntoResaltado)) {
            conjuntos[i].innerHTML = `<span style="background-color: yellow;">${conjuntoResaltado}</span>`;
        } else {
            conjuntos[i].innerHTML = conjuntos[i].innerHTML.replace('<span style="background-color: yellow;">', '').replace('</span>', '');
        }
    }
}

function highlightSet(index) {
    currentIndex = index;
    resaltarNumeros();
}