(function (yourCode) {
    yourCode(window.jQuery, window, document)
}(function ($, window) {
    let btnCrear, mtu, longitudTotal, protocolo, ipOrigen, ipDestino, tablas, btnLimpiar, btnAleatorio;
    const version = 4,
        longitudEncabezado = 5,
        serviciosDif = 0;
    $(function () {
        init()
        listeners()
        format()
    })

    function init() {
        btnLimpiar = $("#btnLimpiar")
        btnCrear = $("#btnCrear")
        btnAleatorio = $("#btnAleatorio")
        mtu = $("#mtu")
        longitudTotal = $("#longitudTotal")
        protocolo = $("#protocolo")
        ipOrigen = $("#ipOrigen")
        ipDestino = $("#ipDestino")
        tablas = $("#tablas")
    }

    function listeners() {
        btnCrear.click(crearDatagrama)
        btnLimpiar.click(limpiarTabla)
        btnAleatorio.click(crearAleatorio)
    }

    function format() {

    }

    /**
     * Crea el datagrama
     */
    function crearDatagrama() {

        // Se limpia la tabla de los datagramas para generar la nueva tabla 
        limpiarTabla()

        // Se declaran las variables que se calcularan para la obtención de los datagramas
        let mf, df, cantidadPaquetes, numIdentificacion, tlf, infoDatagrama, datagramas
        let desplazamiento = 0

        //Con Math.ceil obtenemos el entero más proximo al resultado para garantizar que el resultado sea entero
        //Con Math.random obtener un numero aleatorio entre un rango definido
        numIdentificacion = Math.ceil((Math.random() * (65535)))
        tlf = Math.ceil((Math.random() * (255)))

        //Se calculan la cantidad de paquetes totales en los cuales se va a segmentar el datagrama
        cantidadPaquetes = Math.ceil(Number(longitudTotal.val()) / Number((mtu.val())))

        //De acuerdo a la cantidad de paquetes del datagrama, se analizan cuales son los valores de sus flags
        for (let i = 0; i < cantidadPaquetes; i++) {
            if (i === 0) {
                /*En la primera iteración se identifica si el datagrama tiene más fragmentos.
                Si solo es un fragmento entonces se cuadra los flags acorde dicha información y se
                deja el desplazamiento en 0
                */
                df = cantidadPaquetes == 1 ? 1 : 0;
                mf = cantidadPaquetes == 1 ? 0 : 1;
            } else if (i < cantidadPaquetes - 1) {
                //Se asignan los flags y el desplazamiento a los datagramas que se encuentran entre la segunda y la penultima posición
                df = 0
                mf = 1
                desplazamiento += (Number(mtu.val()))
            } else {
                //Se asignan los flags y el desplazamiento al datagrama que se encuentra en la ultima posición
                df = 1
                mf = 0
                desplazamiento += (Number(mtu.val()))
            }

            //Se crea un json con la información completa de cada uno de los elementos que componen el datagrama
            infoDatagrama = {
                "version": {
                    "bits": 4,
                    "dec": version,
                    "bin": "",
                    "tamanoBin": "",
                    "hexa": ""
                },
                "longitudEncabezado": {
                    "bits": 4,
                    "dec": longitudEncabezado,
                    "bin": "",
                    "tamanoBin": "",
                    "hexa": ""

                },
                "serviciosDif": {
                    "bits": 8,
                    "dec": serviciosDif,
                    "bin": "",
                    "tamanoBin": "",
                    "hexa": ""

                },
                "longitudTotal": {
                    "bits": 16,
                    "dec": Number(longitudTotal.val()),
                    "bin": "",
                    "tamanoBin": "",
                    "hexa": ""

                },
                "numeroIdentificacion": {
                    "bits": 16,
                    "dec": numIdentificacion,
                    "bin": "",
                    "tamanoBin": "",
                    "hexa": ""

                },
                "flagReservada": {
                    "bits": 1,
                    "dec": 0,
                    "bin": "",
                    "tamanoBin": "",
                    "hexa": ""

                },
                "flagDf": {
                    "bits": 1,
                    "dec": df,
                    "bin": "",
                    "tamanoBin": "",
                    "hexa": ""

                },
                "flagMf": {
                    "bits": 1,
                    "dec": mf,
                    "bin": "",
                    "tamanoBin": "",
                    "hexa": ""

                },
                "desplazamiento": {
                    "bits": 13,
                    "dec": desplazamiento,
                    "bin": "",
                    "tamanoBin": "",
                    "hexa": ""

                },
                "tlf": {
                    "bits": 8,
                    "dec": tlf,
                    "bin": "",
                    "tamanoBin": "",
                    "hexa": ""

                },
                "protocolo": {
                    "bits": 8,
                    "dec": Number(protocolo.val()),
                    "bin": "",
                    "tamanoBin": "",
                    "hexa": ""

                },
                "checkSum": {
                    "bits": 16,
                    "dec": 0,
                    "bin": "",
                    "tamanoBin": "",
                    "hexa": "0000"

                },
                "ipOrigen": {
                    "bits": 32,
                    "dec": ipOrigen.val(),
                    "bin": "",
                    "tamanoBin": "",
                    "hexa": ""

                },
                "ipDestino": {
                    "bits": 32,
                    "dec": ipDestino.val(),
                    "bin": "",
                    "tamanoBin": "",
                    "hexa": ""

                }
            }

            //La variable datagramas almacenara un array con el datagrama en hexadecimal y el datagrama en binario
            datagramas = organizarDatagramas(infoDatagrama)

            console.log(infoDatagrama);

            //Se renderiza la tabla con la información del datagrama en el html
            tablas.append(
                `<table class="table table-bordered colorBorde">` +
                `<tbody>` +
                `<tr>` +
                `<td colspan="8""><strong>Datagrama Decimal: ${i+1}</strong></td>` +
                `</tr>` +
                `<tr>` +
                `<td>Versión: ${infoDatagrama.version.dec}</td>` +
                `<td>Longitud Encabezado: ${infoDatagrama.longitudEncabezado.dec}</td>` +
                `<td colspan="2">Servicios Diferenciados: ${infoDatagrama.serviciosDif.dec}</td>` +
                `<td colspan="4">Longitud Total: ${infoDatagrama.longitudTotal.dec}</td>` +
                `</tr>` +
                `<tr>` +
                `<td colspan="4">Identificación: ${infoDatagrama.numeroIdentificacion.dec}</td>` +
                `<td>${infoDatagrama.flagReservada.dec}</td>` +
                `<td>DF: ${infoDatagrama.flagDf.dec}</td>` +
                `<td>MF: ${infoDatagrama.flagMf.dec}</td>` +
                `<td>Desplazamiento: ${infoDatagrama.desplazamiento.dec}</td>` +
                `</tr>` +
                `<tr>` +
                `<td colspan="2">Tiempo de vida: ${infoDatagrama.tlf.dec}</td>` +
                `<td colspan="2">Protocolo: ${infoDatagrama.protocolo.dec}</td>` +
                `<td colspan="4">Suma de comprobación: ${infoDatagrama.checkSum.dec}</td>` +
                `</tr>` +
                `<tr>` +
                `<td colspan="8">Dirección IP Origen: ${ipOrigen.val()}</td>` +
                `</tr>` +
                `<tr>` +
                `<td colspan="8">Dirección IP Destino: ${ipDestino.val()}</td>` +
                `</tr>` +
                `<tr>` +
                `<td><strong>Datagrama en Binario:</strong></td>` +
                `<td colspan="7">${datagramas[0]}</td>` +
                `</tr>` +
                `<tr>` +
                `<td><strong>Datagrama en Hexadecimal:</strong></td>` +
                `<td colspan="7">${datagramas[1]}</td>` +
                `</tr>` +
                `</tbody>` +
                `</table>`
            );
        }
    }

    /**
     * Retorna los datagramas hexadecimal y binario
     * @param {*} infoDatagrama 
     * @returns 
     */
    function organizarDatagramas(infoDatagrama) {

        let datagramaBin = "",
            datagramaHex = "",
            checkSum = 0

        /*
        Debido a que los datagramas requieren del checksum, pero, a su vez para calcular 
        el checksum se requiere que todos los elementos del datagrama esten en hexadecimal.
        Ahora, es más sencillo pasar el elemento a hexadecimal una vez este en binario, 
        para ello, calculamos primero todos los elementos del datagrama en binario y luego en decimal
        excluyendo el checksum.
        */
        datagramaBin = obtenerDatagrama("bin", infoDatagrama);
        datagramaHex = obtenerDatagrama("hex", infoDatagrama);

        // Una vez calculados los datagramas en hexadecimal y binario se realiza el calculo del checksum
        checkSum = calcularCheckSum(datagramaHex)
        infoDatagrama.checkSum.hexa = checkSum
        infoDatagrama.checkSum.dec = hexToDec(checkSum)
        infoDatagrama.checkSum.bin = hexToBin(checkSum)
        datagramaBin = obtenerDatagrama("bin", infoDatagrama);
        datagramaHex = obtenerDatagrama("hex", infoDatagrama);
        return [datagramaBin, datagramaHex]
    }

    /**
     * Organiza los datagramas binario y hexadecimal en el formato requerido (32 bits - 2 nibbles)
     * @param {*} tipo 
     * @param {*} infoDatagrama 
     * @returns 
     */
    function obtenerDatagrama(tipo, infoDatagrama) {

        let datagrama = ""

        if (tipo === "bin") {
            let auxBin = ""
            for (element in infoDatagrama) {
                if (element === "ipOrigen") {
                    infoDatagrama[element]["bin"] = decToBin(infoDatagrama[element]['bits'], ipOrigen.val(), true)
                    infoDatagrama[element]["tamanoBin"] = infoDatagrama[element]["bin"].length
                    datagrama += infoDatagrama[element]['bin']
                } else if (element === "ipDestino") {
                    infoDatagrama[element]["bin"] = decToBin(infoDatagrama[element]['bits'], ipDestino.val(), true)
                    infoDatagrama[element]["tamanoBin"] = infoDatagrama[element]["bin"].length
                    datagrama += infoDatagrama[element]['bin']
                } else {
                    infoDatagrama[element]["bin"] = decToBin(infoDatagrama[element]['bits'], infoDatagrama[element]['dec'])
                    infoDatagrama[element]["tamanoBin"] = infoDatagrama[element]["bin"].length
                    datagrama += infoDatagrama[element]['bin']
                }
            }
            for (let i = 0; i < datagrama.length; i += 32) {
                for (let j = i; j < (i + 32); j++) {
                    auxBin = auxBin + datagrama.charAt(j)
                }
                auxBin += "<br>"
            }
            datagrama = auxBin;
        } else {
            let auxHex = ""
            let infoFlags = infoDatagrama["flagReservada"]['bin'] + "" + infoDatagrama["flagDf"]['bin'] + "" + infoDatagrama["flagMf"]['bin'] + "" + infoDatagrama["desplazamiento"]['bin']
            for (element in infoDatagrama) {
                if (element === "flagReservada" || element === "flagDf" || element === "flagMf" || element === "desplazamiento") {
                    if (element === "flagReservada") {
                        datagrama += binToHex(infoFlags, 16)
                    }
                } else {
                    infoDatagrama[element]['hexa'] = binToHex(infoDatagrama[element]['bin'], infoDatagrama[element]['bits'])
                    datagrama += infoDatagrama[element]['hexa']
                }
            }
            for (let i = 0; i < datagrama.length; i += 2) {

                auxHex = auxHex + datagrama.charAt(i)
                auxHex = auxHex + datagrama.charAt(i + 1)

                if (i < (datagrama.length - 2)) {
                    auxHex += " "
                }

            }
            datagrama = auxHex;
        }
        return datagrama
    }

    /**
     * Realiza la suma de comprobación del datagrama
     * @param {*} data 
     * @returns 
     */
    function calcularCheckSum(datagrama) {

        let resultado = ""

        /*
        Con la variablea aux vamos a acomodar el datagrama hexadecimal
        que viene en parejas, en grupo de 4 nibbles
        */
        let aux = []

        // Se crea un array separando el datagrama hexadecimal por espacios para obtener sus parejas
        datagrama = datagrama.split(" ")

        // Se iteran las parejas para formar grupos de 4 nibbles
        for (let i = 0; i < datagrama.length - 1; i = i + 2) {
            aux.push(datagrama[i] + datagrama[i + 1])
        }

        datagrama = aux

        // Se itera el datagrama para realizar la suma de sus componentes en hexadecimal
        for (let i = 0; i < datagrama.length; i++) {
            if (i === 0) {
                // Si es la primera iteración se suma el primer y el segundo elemento del datagrama
                resultado = sumarHexa(datagrama[i], datagrama[i + 1])
                i++
            } else if (i < (datagrama.length)) {
                resultado = sumarHexa(resultado, datagrama[i])
            } else {
                break;
            }
        }

        // Se resta a FFFF el valor resultante para porder retornar el checksum
        resultado = restarHexa('FFFF', resultado)
        return resultado
    }

    /**
     * Realiza la suma de hexadecimales con acarreo
     * @param {*} hex1 
     * @param {*} hex2 
     * @returns 
     */
    function sumarHexa(hex1, hex2) {

        let acarreo = 0

        // Se realiza la suma en decimal nibble por nibble 
        let suma1 = hexToDec(hex1.charAt(3)) + hexToDec(hex2.charAt(3))
        let suma2 = hexToDec(hex1.charAt(2)) + hexToDec(hex2.charAt(2))
        let suma3 = hexToDec(hex1.charAt(1)) + hexToDec(hex2.charAt(1))
        let suma4 = hexToDec(hex1.charAt(0)) + hexToDec(hex2.charAt(0))

        // Se verifica si la suma es mayor a 15 y requiere acarreo
        if (suma1 > 15) {
            // Si requiere acarreo se resta 16 al valor decimal de la suma y se le suma 1 a la suma de los siguientes nibbles
            suma1 = suma1 - 16
            suma1 = decToHex(suma1)
            suma2 = suma2 + 1
        } else {
            suma1 = decToHex(suma1)
        }

        if (suma2 > 15) {
            suma2 = suma2 - 16
            suma2 = decToHex(suma2)
            suma3 = suma3 + 1
        } else {
            suma2 = decToHex(suma2)
        }

        if (suma3 > 15) {
            suma3 = suma3 - 16
            suma3 = decToHex(suma3)
            suma4 = suma4 + 1
        } else {
            suma3 = decToHex(suma3)
        }

        if (suma4 > 15) {
            suma4 = suma4 - 16
            suma4 = decToHex(suma4)
            // Si al terminar la ultima suma se genera un acarreo se le suma 1 a acarreo
            acarreo++
        } else {
            suma4 = decToHex(suma4)
        }

        let resultado = suma4 + "" + suma3 + "" + suma2 + "" + suma1

        // Si al terminar la suma se genera acarreo se realiza de nuevo el proceso de suma del resultado obtenido más el acarreo "0001"
        if (acarreo > 0) {
            resultado = sumarHexa(resultado, "0001")
        }

        return resultado
    }

    /**
     * Resta Hexadecimal con acarreo
     * @param {*} hex1 
     * @param {*} hex2 
     * @returns 
     */
    function restarHexa(hex1, hex2) {
        let resultado = 0
        let acarreo = 0
        let resta1, resta2, resta3, resta4

        if (hexToDec(hex1.charAt(0)) < hexToDec(hex2.charAt(0))) {
            resta1 = (hexToDec(hex1.charAt(0)) + 16) - hexToDec(hex2.charAt(0))
            acarreo = 1
        } else {
            resta1 = hexToDec(hex1.charAt(0)) - hexToDec(hex2.charAt(0))
        }

        if ((hexToDec(hex1.charAt(1)) - acarreo) < hexToDec(hex2.charAt(1))) {
            resta2 = (hexToDec(hex1.charAt(1)) + 16) - hexToDec(hex2.charAt(1))
        } else {
            resta2 = hexToDec(hex1.charAt(1)) - hexToDec(hex2.charAt(1))
            acarreo = 0
        }

        if ((hexToDec(hex1.charAt(2)) - acarreo) < hexToDec(hex2.charAt(2))) {
            resta3 = (hexToDec(hex1.charAt(2)) + 16) - hexToDec(hex2.charAt(2))
        } else {
            resta3 = hexToDec(hex1.charAt(2)) - hexToDec(hex2.charAt(2))
            acarreo = 0
        }

        if ((hexToDec(hex1.charAt(3)) - acarreo) < hexToDec(hex2.charAt(3))) {
            resta4 = (hexToDec(hex1.charAt(3)) + 16) - hexToDec(hex2.charAt(3))
        } else {
            resta4 = hexToDec(hex1.charAt(3)) - hexToDec(hex2.charAt(3))
            acarreo = 0
        }
        resultado = decToHex(resta1) + "" + decToHex(resta2) + "" + decToHex(resta3) + "" + decToHex(resta4)
        return resultado
    }

    /**
     * Permite eliminar las tablas de datagramas creadas
     */
    function limpiarTabla() {
        tablas.html("")
    }

    /**
     * Permite anadir información aleatoria a los inputs
     */
    function crearAleatorio() {
        mtu.val(Math.round(Math.random() * (1500 - 500) + 500));
        longitudTotal.val(Math.round(Math.random() * (2000 - 500) + 500));
        let aleatorioProtocolo = Math.round(Math.random() * (2))
        switch (aleatorioProtocolo) {
            case 0:
                $("#protocolo option[value=" + 1 + "]").attr("selected", true);
                $("#protocolo option[value=" + 17 + "]").attr("selected", false);
                $("#protocolo option[value=" + 6 + "]").attr("selected", false);
                break;
            case 1:
                $("#protocolo option[value=" + 6 + "]").attr("selected", true);
                $("#protocolo option[value=" + 1 + "]").attr("selected", false);
                $("#protocolo option[value=" + 17 + "]").attr("selected", false);
                break;
            case 2:
                $("#protocolo option[value=" + 17 + "]").attr("selected", true);
                $("#protocolo option[value=" + 6 + "]").attr("selected", false);
                $("#protocolo option[value=" + 1 + "]").attr("selected", false);
                break
            default:
                break;
        }
        ipOrigen.val(`${Math.round(Math.random() * (254 - 1) + 0)}.${Math.round(Math.random() * (254 - 1) + 0)}.${Math.round(Math.random() * (254 - 1) + 0)}.${Math.round(Math.random() * (254 - 1) + 0)}`)
        ipDestino.val(`${Math.round(Math.random() * (254 - 1) + 0)}.${Math.round(Math.random() * (254 - 1) + 0)}.${Math.round(Math.random() * (254 - 1) + 0)}.${Math.round(Math.random() * (254 - 1) + 0)}`)
    }

    /**
     * Convierte un numero de decimal a hexadecimal
     * @param num 
     * @returns 
     */
    function decToHex(num) {
        return num.toString(16)
    }

    /**
     * Convierte un numero de decimal a binario
     * @param num 
     * @returns 
     */
    function decToBin(bits, dec, flagIp = false) {

        // Dado el caso de que sea una dirección ip (flagIp = true) convierte el numero a binario de octeto en octeto
        let auxBin = ""
        if (flagIp) {
            let octetos = dec.split(".")
            octetos.forEach(octeto => {
                let binOct = Number(octeto).toString(2)
                let auxBin2 = ""
                auxBin2 += binOct
                for (let i = 0; i < (8 - binOct.length); i++) {
                    auxBin2 = "0" + auxBin2 //Se llena la cantidad de bits faltantes con 0 a la izquierda
                }
                auxBin += auxBin2
            });
        } else {
            let bin = dec.toString(2)
            auxBin = bin
            for (let i = 0; i < (bits - bin.length); i++) {
                auxBin = "0" + auxBin //Se llena la cantidad de bits faltantes con 0 a la izquierda
            }
        }

        return auxBin
    }

    /**
     * Convierte un numero hexadecimal a decimal
     * @param {*} hexString 
     * @returns 
     */
    function hexToDec(hexString) {
        return parseInt(hexString, 16);
    }

    /**
     * Permite convertir un numero binario a hexadecimal teniendo 
     * en cuenta que un nibble corresponde a 4 bits
     * @param {*} binString 
     * @param {*} bits 
     * @returns 
     */
    function binToHex(binString, bits) {
        let hex = Number(parseInt(binString, 2)).toString(16);
        let tamanoHex = hex.length;
        if (tamanoHex < Math.round(bits / 4)) {
            for (let i = 0; i < (Math.round((bits / 4)) - tamanoHex); i++) {
                hex = "0" + hex
            }
        }
        return hex
    }

    function hexToBin(hex) {
        return Number(parseInt(hex, 16)).toString(2);
    }
}))