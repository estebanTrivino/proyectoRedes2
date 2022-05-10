(function (yourCode) {
    yourCode(window.jQuery, window, document)
}(function ($, window) {
    let btnCrear, mtu, longitudTotal, protocolo, ipOrigen, ipDestino, tablaDatagrama, btnLimpiar;
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
        tablaDatagrama = $("#tablaDatagrama>tbody")
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

        let mf, df, cantidadPaquetes, numIdentificacion, tlf, datagramaBin, datagramaHex, idProtocolo, ipOrigenDec, ipDestinoDec, aux
        let desplazamiento = 0
        let checkSum = 0

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

            checkSum = 0

            datagramaHex = decToHex(version) + decToHex(longitudEncabezado) + decToHex(serviciosDif) +
                decToHex(Number(longitudTotal.val())) + decToHex(numIdentificacion) + 0 + df + mf +
                decToHex(desplazamiento) + decToHex(tlf) + decToHex(idProtocolo) + decToHex(checkSum) + decToHex(Number(ipOrigenDec)) +
                decToHex(Number(ipDestinoDec))

            for (let i = 0; i < datagramaHex.length; i+=2) {
                aux = aux + datagramaHex.substring(i, i + 2) + " "
            }

            datagramaHex = aux;

            datagramaBin = decToBin(version) + decToBin(longitudEncabezado) + decToBin(serviciosDif) +
                decToBin(Number(longitudTotal.val())) + decToBin(numIdentificacion) + 0 + df + mf +
                decToBin(desplazamiento) + decToBin(tlf) + decToBin(idProtocolo) + decToBin(checkSum) + decToBin(Number(ipOrigenDec)) +
                decToBin(Number(ipDestinoDec))

            datagramaBin = datagramaBin.substring(0, 32) + "<br>" + datagramaBin.substring(32, 64) + "<br>" +
                datagramaBin.substring(64, 96) + "<br>" + datagramaBin.substring(96, )

            tablaDatagrama.append(`<tr>` +
                `<td colspan="8""><strong>Datagrama Binario: ${i+1}</strong></td>` +
                `</tr>` +
                `<tr>` +
                `<td>Versión: ${version}</td>` +
                `<td>Longitud Encabezado: ${longitudEncabezado}</td>` +
                `<td colspan="2">Servicios Diferenciados: ${serviciosDif}</td>` +
                `<td colspan="4">Longitud Total: ${longitudTotal.val()}</td>` +
                `</tr>` +
                `<tr>` +
                `<td colspan="4">Identificación: ${numIdentificacion}</td>` +
                `<td>0</td>` +
                `<td>DF: ${df}</td>` +
                `<td>MF: ${mf}</td>` +
                `<td>Desplazamiento: ${desplazamiento}</td>` +
                `</tr>` +
                `<tr>` +
                `<td colspan="2">Tiempo de vida: ${tlf}</td>` +
                `<td colspan="2">Protocolo: ${protocolo.val()}</td>` +
                `<td colspan="4">Suma de comprobación: ${checkSum}</td>` +
                `</tr>` +
                `<tr>` +
                `<td colspan="8">Dirección IP Origen: ${ipOrigen.val()}</td>` +
                `</tr>` +
                `<tr>` +
                `<td colspan="8">Dirección IP Destino: ${ipDestino.val()}</td>` +
                `</tr>` +
                `<tr>` +
                `<td><strong>Datagrama en Binario:</strong></td>` +
                `<td colspan="7">${datagramaBin}</td>` +
                `</tr>` +
                `<tr>` +
                `<td><strong>Datagrama en Hexadecimal:</strong></td>` +
                `<td colspan="7">${datagramaHex}</td>` +
                `</tr>`);
        }
    }

    /**
     * Permite limpiar la tabla del datagrama
     */
    function limpiarTabla() {
        tablaDatagrama.html("")
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
    function decToBin(num) {
        return num.toString(2)
    }

}))