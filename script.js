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
