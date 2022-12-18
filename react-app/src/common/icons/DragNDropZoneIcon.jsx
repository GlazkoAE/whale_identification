import React, {memo} from "react";
import {SvgIcon} from "@mui/material";

export const DragNDropZoneIcon = memo(({className, width, height}) => {
    return (
        <SvgIcon className={className} xmlns="http://www.w3.org/2000/svg" height={width || "48"} width={height || "48"}
                 style={{width: `${width || 48}px`, height: `${height || 48}px`}} viewBox="0 0 48 48">
            <path
                fill={"#167cdb"}
                d="M22.6 37.9h3V27.85l4.1 4.1 2.1-2.1-7.8-7.6-7.7 7.7 2.1 2.1 4.2-4.2ZM11 44q-1.2 0-2.1-.9Q8 42.2 8 41V7q0-1.2.9-2.1Q9.8 4 11 4h18.05L40 14.95V41q0 1.2-.9 2.1-.9.9-2.1.9Zm16.55-27.7V7H11v34h26V16.3ZM11 7v9.3V7v34V7Z"/>
        </SvgIcon>
    );
});