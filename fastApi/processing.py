import pickle

import numpy as np
import torch
import torch.nn.functional as F
import torchvision.transforms as transforms
from PIL import Image
from matplotlib import cm

from Siamese_Network import SiameseNetwork

MODEL = "model_contrastive.pt"

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = SiameseNetwork()
model.load_state_dict(torch.load(MODEL))
model.to(device)
model.eval()

with open('database.pkl', 'rb') as f:
    filenames, whale_ids, embeddings = pickle.load(f)

transform = transforms.Compose([transforms.Resize((128, 128)), transforms.ToTensor()])


def rgb2gray(rgb):
    return np.dot(rgb[..., :3], [0.2989, 0.5870, 0.1140])


def most_frequent_or_first(input_list):
    counter = 0
    res = input_list[0]

    for item in input_list:
        curr_frequency = input_list.count(item)
        if curr_frequency > counter:
            counter = curr_frequency
            res = item

    return res


def find_id_by_image(image):
    image = Image.fromarray(image.astype('uint8'), 'RGB')
    image = image.convert("L")
    img_tensor = transform(image)
    img_tensor = img_tensor.unsqueeze(0)
    output = model.predict(img_tensor)

    list_with_distance = []
    for i, item in enumerate(embeddings):
        item = item.to(device)
        eucledian_distance = F.pairwise_distance(output, item).to('cpu').numpy()[0]
        list_with_distance.append([eucledian_distance, whale_ids[i]])

    list_with_distance.sort()  # отсортированные по расстоянию изображения

    min_dist = list_with_distance[0][0]
    res = []
    for i in range(5):
        score = list_with_distance[i]
        idx = score[1]
        res.append(idx)

    return most_frequent_or_first(res) if min_dist < 0.5 else "NEW"
