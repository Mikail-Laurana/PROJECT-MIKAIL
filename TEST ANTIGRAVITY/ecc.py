import random
import hashlib

p = 2**128 - 2**97 - 1
a = -3
b = int("E87579C11079F43DD824993C2CEE5ED3", 16)


def find_generator(a, b, p):
    x = 1
    while True:
        rhs = (pow(x, 3, p) + a * x + b) % p
        if pow(rhs, (p - 1) // 2, p) == 1:
            y = pow(rhs, (p + 1) // 4, p)
            if (y**2 - rhs) % p == 0:
                return (x, y)
        x += 1


G = find_generator(a, b, p)

class ECC:
    def __init__(self, a=a, b=b, p=p):
        self.a = a
        self.b = b
        self.p = p

    def is_on_curve(self, x, y):
        return (y**2 - (x**3 + self.a * x + self.b)) % self.p == 0


def point_addition(P, Q, curve):
    if P is None: return Q
    if Q is None: return P

    x1, y1 = P
    x2, y2 = Q

    if x1 == x2:
        if (y1 != y2): return None
        else: return point_doubling(P, curve)
    
    m = ((y2 - y1) * pow(x2 - x1, -1, curve.p)) % curve.p
    x3 = (m**2 - x1 - x2) % curve.p
    y3 = (m * (x1 - x3) - y1) % curve.p
    return (x3, y3)


def point_doubling(P, curve):
    if P is None: return None
    
    x, y = P
    
    if y == 0:
        return None

    m = ((3 * x**2 + curve.a) * pow(2 * y, -1, curve.p)) % curve.p
    x3 = (m**2 - 2 * x) % curve.p
    y3 = (m * (x - x3) - y) % curve.p
    return (x3, y3)


def scalar_multiplication(k, P, curve):
    if k == 0 or P is None:  return None

    result = None
    addend = P

    while k:
        if k & 1:
            result = point_addition(result, addend, curve)
        addend = point_doubling(addend, curve)
        k >>= 1  

    return result


def generate_keys(curve, G=G):
    d = random.randint(1, curve.p - 1)
    Q = scalar_multiplication(d, G, curve)
    
    return d, Q


def derive_keystream(shared_secret, length):
    keystream = b''
    counter = 0
    while len(keystream) < length:
        h = hashlib.sha256(shared_secret.to_bytes(16, 'big') + counter.to_bytes(4, 'big')).digest()
        keystream += h
        counter += 1
    return keystream[:length]


def encrypt(plaintext, public_key, curve, G=G, k=None):
    if k is None:
        k = random.randint(1, curve.p - 1)
    
    C1 = scalar_multiplication(k, G, curve)
    kQ = scalar_multiplication(k, public_key, curve)
    
    if kQ is None:
        raise ValueError("Invalid key")
    shared_x = kQ[0]
    
    plaintext_bytes = plaintext.encode('utf-8')
    keystream = derive_keystream(shared_x, len(plaintext_bytes))
    
    ciphertext_bytes = bytes([p ^ k for p, k in zip(plaintext_bytes, keystream)])
    ciphertext = ciphertext_bytes.hex()
    
    return C1, ciphertext

def decrypt(ciphertext, R, private_key, curve):
    kQ = scalar_multiplication(private_key, R, curve)
    
    if kQ is None:
        raise ValueError("Invalid key")
    shared_x = kQ[0]
    
    ciphertext_bytes = bytes.fromhex(ciphertext)
    keystream = derive_keystream(shared_x, len(ciphertext_bytes))
    plaintext = bytes([c ^ k for c, k in zip(ciphertext_bytes, keystream)])
    
    return plaintext
