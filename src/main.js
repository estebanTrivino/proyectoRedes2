(function (yourCode) {
    yourCode(window.jQuery, window, document)
}(function ($, window) {
    let btnCrear, mtu, longitudTotal, protocolo, ipOrigen, ipDestino, tablas, btnLimpiar;
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
    }

    function format() {

    }

    /**
     * Crea el datagrama
     */
    function crearDatagrama() {

        limpiarTabla()

        let mf, df, cantidadPaquetes, numIdentificacion, tlf, idProtocolo, ipOrigenDec, ipDestinoDec, infoDatagrama
        let desplazamiento = 0

        numIdentificacion = Math.floor((Math.random() * (65535)))
        tlf = Math.floor((Math.random() * (255)))
        cantidadPaquetes = Math.ceil(longitudTotal.val() / mtu.val())

        ipOrigenDec = ipOrigen.val().replace(/\./g, '')
        ipDestinoDec = ipDestino.val().replace(/\./g, '')

        switch (protocolo.val()) {
            case "ICMP":
                idProtocolo = 1
                break;
            case "TCP":
                idProtocolo = 6
                break;
            case "UDP":
                idProtocolo = 17
                break;
            default:
                break;
        }

        for (let i = 0; i < cantidadPaquetes; i++) {

            if (i === 0) {
                df = 0
                mf = 1
            } else if (i < cantidadPaquetes - 1) {
                df = 0
                mf = 1
                desplazamiento += Number(mtu.val())
            } else {
                df = 1
                mf = 0
                desplazamiento += Number(mtu.val())
            }

            infoDatagrama = {
                "version": {
                    "bits": 4,
                    "dec": version,
                    "bin": "",
                    "hexa": ""
                },
                "longitudEncabezado": {
                    "bits": 4,
                    "dec": longitudEncabezado,
                    "bin": "",
                    "hexa": ""

                },
                "serviciosDif": {
                    "bits": 8,
                    "dec": serviciosDif,
                    "bin": "",
                    "hexa": ""

                },
                "longitudTotal": {
                    "bits": 16,
                    "dec": Number(longitudTotal.val()),
                    "bin": "",
                    "hexa": ""

                },
                "numeroIdentificacion": {
                    "bits": 16,
                    "dec": numIdentificacion,
                    "bin": "",
                    "hexa": ""

                },
                "flagReservada": {
                    "bits": 1,
                    "dec": 0,
                    "bin": "",
                    "hexa": ""

                },
                "flagDf": {
                    "bits": 1,
                    "dec": df,
                    "bin": "",
                    "hexa": ""

                },
                "flagMf": {
                    "bits": 1,
                    "dec": mf,
                    "bin": "",
                    "hexa": ""

                },
                "desplazamiento": {
                    "bits": 13,
                    "dec": desplazamiento,
                    "bin": "",
                    "hexa": ""

                },
                "tlf": {
                    "bits": 8,
                    "dec": tlf,
                    "bin": "",
                    "hexa": ""

                },
                "protocolo": {
                    "bits": 8,
                    "dec": idProtocolo,
                    "bin": "",
                    "hexa": ""

                },
                "checkSum": {
                    "bits": 16,
                    "dec": 0,
                    "bin": "",
                    "hexa": ""

                },
                "ipOrigen": {
                    "bits": 32,
                    "dec": Number(ipOrigenDec),
                    "bin": "",
                    "hexa": ""

                },
                "ipDestino": {
                    "bits": 32,
                    "dec": Number(ipDestinoDec),
                    "bin": "",
                    "hexa": ""

                }
            }

            datagramas = organizarDatagramas(infoDatagrama)

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
                `<td colspan="8">Dirección IP Origen: ${infoDatagrama.ipOrigen.dec}</td>` +
                `</tr>` +
                `<tr>` +
                `<td colspan="8">Dirección IP Destino: ${infoDatagrama.ipDestino.dec}</td>` +
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
     * Retorna los datagramas organizados en el formato requerido
     * @param {*} infoDatagrama 
     * @returns 
     */
    function organizarDatagramas(infoDatagrama) {

        let datagramaBin = "",
            datagramaHex = "",
            checkSum = 0
        datagramaBin = obtenerDatagrama("bin", infoDatagrama);
        datagramaHex = obtenerDatagrama("hex", infoDatagrama);
        checkSum = calcularCheckSum(datagramaHex)
        infoDatagrama.checkSum.hexa = checkSum
        infoDatagrama.checkSum.dec = hexToDec(checkSum)
        infoDatagrama.checkSum.bin = hexToBin(checkSum)
        datagramaBin = obtenerDatagrama("bin", infoDatagrama);
        datagramaHex = obtenerDatagrama("hex", infoDatagrama);
        return [datagramaBin, datagramaHex]
    }

    /**
     * Organiza los datagramas binario y hexadecimal en el formato requerido
     * @param {*} tipo 
     * @param {*} infoDatagrama 
     * @returns 
     */
    function obtenerDatagrama(tipo, infoDatagrama) {

        let datagrama = ""

        if (tipo === "bin") {
            let auxBin = ""
            for (element in infoDatagrama) {
                infoDatagrama[element]["bin"] = decToBin(infoDatagrama[element]['bits'], infoDatagrama[element]['dec'])
                datagrama += infoDatagrama[element]['bin']
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
            for (element in infoDatagrama) {
                infoDatagrama[element]['hexa'] = binToHex(infoDatagrama[element]['bin'], infoDatagrama[element]['bits'])
                datagrama += infoDatagrama[element]['hexa']
            }
            for (let i = 0; i < datagrama.length; i += 2) {
                auxHex = auxHex + datagrama.charAt(i)
                auxHex = auxHex + datagrama.charAt(i + 1)
                auxHex += " "
            }
            datagrama = auxHex;
        }
        return datagrama
    }

    /**
     * Realiza la operación necesaria para calcular el cheksum
     * @param {*} data 
     * @returns 
     */
    function calcularCheckSum(data) {

        let resultado = ""
        let aux = []
        data = data.split(" ")
        for (let i = 0; i < data.length; i = i + 2) {
            aux.push(data[i] + data[i + 1])
        }
        data = aux
        for (let i = 0; i < data.length - 2; i++) {
            let acarreo = 0
            if (i === 0) {
                resultado = sumarHexa(data[i], data[i + 1])
                i++
            } else {
                resultado = sumarHexa(resultado, data[i])
            }
        }
        resultado = hexToDec('FFFF') - hexToDec(resultado)
        resultado = decToHex(resultado)
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

        let suma1 = hexToDec(hex1.charAt(0)) + hexToDec(hex2.charAt(0))
        let suma2 = hexToDec(hex1.charAt(1)) + hexToDec(hex2.charAt(1))
        let suma3 = hexToDec(hex1.charAt(2)) + hexToDec(hex2.charAt(2))
        let suma4 = hexToDec(hex1.charAt(3)) + hexToDec(hex2.charAt(3))

        if (suma1 > 15) {
            suma1 = suma1 - 16
            suma1 = decToHex(suma1)
            acarreo++
            suma2 = suma2 + acarreo
        } else {
            suma1 = decToHex(suma1)
        }

        if (suma2 > 15) {
            acarreo--
            suma2 = suma2 - 16
            suma2 = decToHex(suma2)
            acarreo++
            suma3 = suma3 + acarreo
        } else {
            suma2 = decToHex(suma2)
        }

        if (suma3 > 15) {
            acarreo--
            suma3 = suma3 - 16
            suma3 = decToHex(suma3)
            acarreo++
            suma4 = suma4 + acarreo
        } else {
            suma3 = decToHex(suma3)
        }

        if (suma4 > 15) {
            acarreo--
            suma4 = suma4 - 16
            suma4 = decToHex(suma3)
            acarreo++
            suma4 = suma4 + acarreo
        } else {
            suma4 = decToHex(suma4)
        }

        let resultado = suma1 + "" + suma2 + "" + suma3 + "" + suma4
        return resultado
    }

    /**
     * Permite limpiar la tabla del datagrama
     */
    function limpiarTabla() {
        tablas.html("")
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
    function decToBin(bits, dec) {
        let bin = dec.toString(2)
        let auxHex = bin
        for (let i = 0; i < (bits - bin.length); i++) {
            auxHex = "0" + auxHex
        }
        return auxHex
    }

    /**
     * Convierte un numero hexadecimal a decimal
     * @param {*} hexString 
     * @returns 
     */
    function hexToDec(hexString) {
        return parseInt(hexString, 16);
    }

    function binToHex(binString, bits) {
        let hex = Number(parseInt(binString, 2)).toString(16);
        let tamanoBin = hex.length;
        if (tamanoBin < Math.round(bits / 4)) {
            for (let i = 0; i < ((bits / 4) - tamanoBin); i++) {
                hex = "0" + hex
            }
        }
        return hex
    }

    function hexToBin(hex) {
        return Number(parseInt(hex, 16)).toString(2);
    }
}))