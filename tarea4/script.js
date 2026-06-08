function calcular(){

    let num1 = parseFloat(document.getElementById("num1").value);
    let num2 = parseFloat(document.getElementById("num2").value);

    let resultado = "";

    for(let i = 1; i <= 5; i++){

        if(i == 1){
            resultado += "- SUMA: " + (num1 + num2) + "<br>";
        }

        else if(i == 2){
            resultado += "- RESTA: " + (num1 - num2) + "<br>";
        }

        else if(i == 3){
            resultado += "- MULTIPLICACIÓN: " + (num1 * num2) + "<br>";
        }

        else if(i == 4){
            resultado += "- DIVISIÓN: " + (num1 / num2) + "<br>";
        }

        else if(i == 5){
            resultado += "- MOD (%): " + (num1 % num2) + "<br>";
        }
    }

    document.getElementById("resultado").innerHTML = resultado;
}