from PIL import Image
import numpy as np

# Load image
img = Image.open("dummy_image_640x480.png").convert("L")
data = np.asarray(img, dtype=np.uint8)

# Flatten and format as C array
flattened = data.flatten()
with open("image_array.h", "w") as f:
    f.write("const uint8_t image_data[]= {\n")
    for i, val in enumerate(flattened):
        f.write(f"0x{val:02X},")
        if (i + 1) % 20 == 0:
            f.write("\n")
    f.write("};\n")
