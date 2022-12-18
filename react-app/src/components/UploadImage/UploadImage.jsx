import React, {useCallback, useState} from "react";
import {useDropzone} from "react-dropzone";
import classNames from "classnames";
import {DragNDropZoneIcon} from "../../common/icons/DragNDropZoneIcon";

import {UPLOAD_IMAGES_MIME_TYPES} from '../../common/const/uploadImagesConst';

import styles from './UploadImage.module.scss';
import {CrossIcon} from "../../common/icons/CrossIcon";
import {ThreeDots} from "react-loader-spinner";

const blobToBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

export const UploadImage = ({handleImageUpload, isImageProcessing}) => {
    const [imageUrl, setImageUrl] = useState('');
    const [showDeleteOverlay, setShowDeleteOverlay] = useState(false);

    const {getRootProps, getInputProps, isDragAccept, isDragReject} = useDropzone({
        maxFiles: 1,
        accept: UPLOAD_IMAGES_MIME_TYPES,
        onDrop: acceptedFiles => {
            const uploadedFile = acceptedFiles?.[0];
            console.log(uploadedFile);
            if (uploadedFile) {
                //handleImageUpload(uploadedFile);
                blobToBase64(uploadedFile).then(imageUrl => {
                    setImageUrl(imageUrl);
                    handleImageUpload(imageUrl);
                })
            }
        },
    })

    const removeImage = useCallback(() => {
        handleImageUpload(null);
        setImageUrl('');
    }, [handleImageUpload]);

    return (
        <div className={classNames(styles.uploadImageContainer)}>
            {!imageUrl ? <div {...getRootProps({
                    className: classNames(styles.dropzoneContainer, {
                        [styles.rejected]: isDragReject,
                        [styles.active]: isDragAccept
                    })
                })}>
                    <input {...getInputProps()}/>
                    <div className={classNames(styles.infoContainer)}>
                        <DragNDropZoneIcon width={60} height={60} className={classNames(styles.dropzoneIcon)}/>
                        <div className={classNames(styles.dropzoneTextTitle)}>Upload image</div>
                        <div className={classNames(styles.dropzoneTextInfo)}>Drag-and-drop or browse your file</div>
                        <div className={classNames(styles.dropzoneTextFormats)}>Supported formats: .jpg, .jpeg, .png,
                            .tiff,
                            .bmp
                        </div>
                    </div>
                </div>
                : <div className={classNames(styles.imageContainer)}
                       onMouseEnter={() => setTimeout(() => setShowDeleteOverlay(true), 100)}
                       onMouseLeave={() => setShowDeleteOverlay(false)} onClick={removeImage}>
                    <img className={classNames(styles.uploadedImage)} src={imageUrl} alt={"Uploaded image"}/>
                    <div className={classNames(styles.deleteOverlay, {[styles.isHidden]: !showDeleteOverlay || isImageProcessing})}>
                        <CrossIcon width={60} height={60} className={classNames(styles.crossIcon)}/>
                        <div className={classNames(styles.deleteText)}>Delete image</div>
                    </div>
                </div>}
            {isImageProcessing && <div className={classNames(styles.imageProcessingContainer)}>
                <ThreeDots
                    height="80"
                    width="80"
                    radius="9"
                    color="#168FFF"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClassName=""
                    visible={true}
                />
            </div>}
        </div>
    );
};