const validateEmail = (email: string) => { 
    const regex = /^.*@.*\..*$/g;

    return regex.test(email);
}

const validatePassword = (password: string) => { 
    return password.length > 5;
}

const validateUsername = (username: string) => {
    return username.length > 3
}

export {
    validateEmail,
    validatePassword,
    validateUsername
}