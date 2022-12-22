import os

import pandas as pd
import torch
import torch.nn as nn
from PIL import Image
from torchvision.transforms import transforms

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")


class SiameseNetwork(nn.Module):
    def __init__(self):
        super(SiameseNetwork, self).__init__()
        # Setting up the Sequential of CNN Layers
        self.cnn1 = nn.Sequential(
            nn.Conv2d(1, 96, kernel_size=11, stride=1),
            nn.BatchNorm2d(96),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(3, stride=2),
            nn.Conv2d(96, 256, kernel_size=5, stride=1, padding=2),
            nn.BatchNorm2d(256),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(3, stride=2),
            nn.Conv2d(256, 384, kernel_size=3, stride=1, padding=1),
            nn.BatchNorm2d(384),
            nn.ReLU(inplace=True),
            nn.Conv2d(384, 256, kernel_size=3, stride=1, padding=1),
            nn.BatchNorm2d(256),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(3, stride=2),
            nn.Dropout(p=0.3),
        )
        # Defining the fully connected layers
        self.fc1 = nn.Sequential(
            nn.Linear(43264, 1024),
            nn.ReLU(inplace=True),
            nn.Dropout(p=0.5),
            nn.Linear(1024, 128),
            nn.ReLU(inplace=True),
            nn.Linear(128, 2),
        )

        self.transform = transforms.Compose([
            transforms.Resize((128, 128)),
            transforms.ToTensor()
        ])

    def forward_once(self, x):
        x = x.to(device)
        # Forward pass
        output = self.cnn1(x)
        output = output.view(output.size()[0], -1)
        # breakpoint()
        output = self.fc1(output)
        return output

    def forward(self, input1, input2):
        # forward pass of input 1
        output1 = self.forward_once(input1)
        # forward pass of input 2
        output2 = self.forward_once(input2)
        return output1, output2

    def predict(self, input):
        with torch.no_grad():
            output = self.forward_once(input)
        return output

    def generate_embeddings(self, img_dir: str, labels: pd.DataFrame):
        embeddings = []
        ids = []
        names = []
        for _, row in labels.iterrows():
            filename = row["Image"]
            img_path = os.path.join(img_dir, filename)
            img = Image.open(img_path)
            img = img.convert("L")
            # Apply image transformations
            img_tensor = self.transform(img)
            img_tensor = img_tensor.unsqueeze(0)
            with torch.no_grad():
                res = self.forward_once(img_tensor).to('cpu')
            embeddings.append(res)
            ids.append(row["Id"])
            names.append(filename)

        res = [names, ids, embeddings]
        return res
