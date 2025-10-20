function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function checkIfAdult(birthDate) {
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const hadBirthday =
        today.getMonth() > birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() &&
            today.getDate() >= birthDate.getDate());
    return (hadBirthday ? age : age - 1) >= 18;
}

module.exports = { isValidEmail, checkIfAdult };
