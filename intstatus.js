const labelStatus = [["Vivant", "SUCCES"], ["Mort", "ECHEC"], ["Inconnu", "PVP"]];

/**
 * Convert a string status to a somewhat exploitable number
 * @param {string} status The string status extracted from DOM
 * @returns {number} The status' number
 */
const getIntStatus = (status) => {
    switch (status) {
        case labelStatus[0][0]:
        case labelStatus[0][1]:
            return 1;
        case labelStatus[1][0]:
        case labelStatus[1][1]:
            return 2;
        case labelStatus[2][1]:
            return 3;
        default:
            return 0;
    }
}

exports.getIntStatus = getIntStatus;
exports.labelStatus = labelStatus;