const setValue = function(value) {
    Object.assign(config, value);
}

const config = {
    ENDPOINT: "http://exnihilo.gq:4999", // "http://127.0.0.1:4000",
    BACKUP_ENDPOINT: "http://exnihilo.gq:4998",
    PLAYER_IMAGE_PATH: `${process.env.PUBLIC_URL}/assets/players`,
    setValue,
}

function getImageProfil(imageName = "standard") {
    return `${config.PLAYER_IMAGE_PATH}/${imageName}.png`
}



export { config };
export const middlewares = {
    getImageProfil,
}