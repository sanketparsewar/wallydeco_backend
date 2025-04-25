const capitalizeFirst = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

const upperCase = (str) => str ? str.toUpperCase() : "";

module.exports = { capitalizeFirst, upperCase };
