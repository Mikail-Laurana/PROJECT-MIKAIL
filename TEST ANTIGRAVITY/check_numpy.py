import numpy as np
print(f"Numpy version: {np.__version__}")
arr = np.array([1])
print(f"Default integer type: {arr.dtype}")
print(f"Itemsize: {arr.itemsize}")

# Check overflow
try:
    arr = np.array([2**63 - 1], dtype=np.int64)
    print("Can hold int64 max")
    val = arr * 2
    print(f"Overflow int64 behavior: {val}")
except Exception as e:
    print(f"int64 error: {e}")

try:
    arr = np.array([2**31 - 1], dtype=np.int32)
    val = arr * 2
    print(f"Overflow int32 behavior: {val}")
except Exception as e:
    print(f"int32 error: {e}")
