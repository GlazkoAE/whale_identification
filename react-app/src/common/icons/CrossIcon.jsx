import React, {memo} from "react";
import {SvgIcon} from "@mui/material";

export const CrossIcon = memo(({className, width, height}) => {
    return (
        <SvgIcon className={className} height={width || "48"} width={height || "48"}
                 style={{width: `${width || 48}px`, height: `${height || 48}px`}} viewBox="0 0 48 48"
                 xmlns="http://www.w3.org/2000/svg" height="48" width="48">
            <path fill={"#fff"}
                  d="m12.45 37.65-2.1-2.1L21.9 24 10.35 12.45l2.1-2.1L24 21.9l11.55-11.55 2.1 2.1L26.1 24l11.55 11.55-2.1 2.1L24 26.1Z"/>
        </SvgIcon>
    );
});