import base64
import io

import numpy as np
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi import FastAPI
from PIL import Image

from processing import find_id_by_image

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PostItem(BaseModel):
    uploadedImage: str


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/images/")
async def process_img(item: PostItem):
    img = item.uploadedImage.split(",")[1]
    base64_decoded = base64.b64decode(img)
    image = Image.open(io.BytesIO(base64_decoded))
    image_np = np.array(image)
    whale_id = find_id_by_image(image_np)
    return {"data": f"Possible whale ID is {whale_id}"}


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}
