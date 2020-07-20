import React, { useState } from 'react';

import styles from './ChooseImageProfil.module.css';
import { middlewares } from '../../../../config';
import { ReactComponent as ChevronLeft } from '../../../../assets/chevron_left.svg';
import { ReactComponent as ChevronRight } from '../../../../assets/chevron_right.svg';
import { ReactComponent as Close} from '../../../../assets/close.svg';

function ChooseImageProfil(props) {
    const [ imageIndex, setImageIndex ] = useState(0)
    const customStyles = {
        transform: `translateX(${imageIndex * -143}px)`
    }
    const handleChevronClick = (direction) => {
        let newIndex;
        if (direction === 'left') {
            if (imageIndex === 0) {
                newIndex = props.allImages.length - 1;
            } else {
                newIndex = imageIndex - 1;
            }
        } else if (direction === 'right') {
            if (imageIndex === props.allImages.length - 1) {
                newIndex = 0
            } else {
                newIndex = imageIndex + 1
            }
        }
        setImageIndex(newIndex);
    }
    const handleCloseComponent = () => {
        props.handleChooseImageProfilClose()
    }
    const handleImageProfilSubmit = () => {
        props.handleCreatePlayer(imageIndex)
    }

    return (
        <div className={styles.container}>
            <div className={styles.closeComponent}>
                <button onClick={handleCloseComponent} className={styles.closeComponent__button}>
                    <Close className={styles.closeComponent__close} />
                    Fermez
                </button>
            </div>
            <div className={styles.header}>
                <div className={styles.header__bar} ></div>
                <p className={styles.header__text} >Choisissez une image de profil</p>
                <div className={styles.header__bar} ></div>
            </div>
            <div className={styles.carousel}>
                <ChevronLeft onClick={() => handleChevronClick('left')} className={styles.chevron} />
                <div className={styles.imagesContainer}>
                    <div style={customStyles} className={styles.imagesWrapper}>
                    {props.allImages.map((elem, index) => {
                        return <img className={styles.image} key={index} src={middlewares.getImageProfil(elem)} alt={`${elem}`} />
                    })}
                    </div>
                </div>
                <ChevronRight onClick={() => handleChevronClick('right')} className={styles.chevron} />
            </div>
            <div className={styles.imageProfilSubmit}>
                <button onClick={handleImageProfilSubmit} className={styles.imageProfilSubmit__button}>Créer votre compte</button>
            </div>
        </div>
    )
}

export default ChooseImageProfil;