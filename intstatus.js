/**
 * Convert a string status to a somewhat exploitable number
 * @param {string} status The string status extracted from DOM
 * @returns {number} The status' number
 */
const getIntStatus = (status) => {
    switch (status) {
        case "Vivant":
        case "SUCCES":
            return 1;
        case "Mort":
        case "ECHEC":
            return 2;
        case "PVP":
            return 3;
        default:
            return 0;
    }
}

exports.getIntStatus = getIntStatus;