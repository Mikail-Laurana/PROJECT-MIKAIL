import numpy as np
import sys

print(f"NP_VER:{np.__version__}")
arr = np.array([1])
print(f"DTYPE:{arr.dtype}")
print(f"ITEMSIZE:{arr.itemsize}")

try:
    arr32 = np.array([2147483647], dtype=np.int32)
    res32 = arr32 + 1
    print(f"OVF32:{res32}")
except:
    print("ERR32")

try:
    arr64 = np.array([9223372036854775807], dtype=np.int64)
    res64 = arr64 + 1
    print(f"OVF64:{res64}")
except:
    print("ERR64")
