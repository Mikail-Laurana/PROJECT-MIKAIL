import re, signal
import numpy as np
import sys
# from Crypto.Util.number import isPrime
def isPrime(n):
    if n < 2: return False
    for i in range(2, int(n**0.5)+1):
        if n%i==0: return False
    return True

def usir_karbit():
    print("Hati hati terdeteksi karbit")
    # exit(1) # Don't exit to allow debug print

def cek_surat_nikah(my):
    print(f"Input: {my}")
    if not re.fullmatch(r"(?=.*\d)(?=.*[A-Z])(?=.*[a-z])\w*", my, flags=re.ASCII):
        print("Regex failed")
        usir_karbit()

    array = np.array(list(map(ord, my)))
    print(f"Array dtype: {array.dtype}")
    s, p = int(array.sum()), array.prod()
    print(f"Sum (int): {s}")
    print(f"Prod (raw): {p}")
    print(f"Prod type: {type(p)}")
    
    # Check manual
    manual_p = 1
    for c in list(map(ord, my)): manual_p *= c
    print(f"Manual Prod (python): {manual_p}")
    print(f"Prod % 2^64: {manual_p % 2**64}")
    
    # Check signed conversion
    if isinstance(p, (np.int64, np.int32)):
        print(f"Prod is numpy scalar")
    
    if isPrime(s):
        print("Sum is Prime")
    else:
        print("Sum is NOT Prime")
        
    if s == p:
        print("s == p matched!")
        print(open("flag.txt", "r", encoding="utf-8").read().strip())
    else:
        print(f"Mismatch: {s} != {p}")
        usir_karbit()

if __name__ == "__main__":
    # signal.alarm(7) 
    if len(sys.argv) > 1:
        my = sys.argv[1].strip()
    else:
        my = "1Aa"
    cek_surat_nikah(my)
