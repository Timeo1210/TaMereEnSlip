export const config = {
    ENDPOINT: "http://127.0.0.1:4000",
    PLAYER_IMAGE_PATH: `${process.env.PUBLIC_URL}/assets/players`,
}

function getImageProfil(imageName = "standard") {
    return `${config.PLAYER_IMAGE_PATH}/${imageName}.png`
}

export const middlewares = {
    getImageProfil,
}