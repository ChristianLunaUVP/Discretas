function recorrerDeBruijn(n, index) {
    let dbSequence = deBruijn(n); // Obtener la secuencia de De Bruijn
    let length = dbSequence.length;
    let startIndex = index % length; // Calcular el índice de inicio en caso de que se exceda la longitud

    // Mostrar la secuencia recorrida
    let recorrido = dbSequence.slice(startIndex) + dbSequence.slice(0, startIndex);
    document.getElementById("debruijn").innerHTML = "Secuencia de De Bruijn recorrida: " + recorrido;
}
