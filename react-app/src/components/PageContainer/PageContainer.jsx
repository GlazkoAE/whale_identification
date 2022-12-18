import React, {useCallback, useState} from "react";
import classNames from "classnames";
import axios from "axios";

import {Button} from "@mui/material";
import {UploadImage} from "../UploadImage/UploadImage";

import styles from './PageContainer.module.scss';

export const PageContainer = () => {
    const [uploadedImage, setUploadedImage] = useState(null);
    const [isImageProcessing, setIsImageProcessing] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const handleImageUpload = useCallback(uploadedFile => {
        setUploadedImage(uploadedFile);
    }, []);

    const handleButtonClick = useCallback(() => {
        setIsImageProcessing(true);
        axios.post('http://localhost:8000/images/', {uploadedImage})
            .then(res => {
                console.log(res);
                setResult(res?.data?.data);
                setError(null);
                setIsImageProcessing(false);
            }).catch(err => {
                console.log(err);
                setResult(null);
                setError(err.message);
            setIsImageProcessing(false);
        })
    }, [uploadedImage]);

    return (<div className={classNames(styles.pageContainer)}>
        <UploadImage isImageProcessing={isImageProcessing} handleImageUpload={handleImageUpload}/>
        <Button className={classNames(styles.analyzeImageButton)} disabled={isImageProcessing || !uploadedImage}
                onClick={handleButtonClick}>Analyze image</Button>
        {(result || error) && <div className={classNames(styles.resultText)}>{"Result: "}
            <div className={classNames(styles.result)}>
                {result}
            </div>
            <div className={classNames(styles.error)}>
                {error}
            </div>
        </div>}
    </div>);
};