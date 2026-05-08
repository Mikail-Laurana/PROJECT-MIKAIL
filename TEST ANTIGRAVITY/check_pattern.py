import numpy as np

# Valid chars check
valid_chars = set()
for i in range(48, 58): valid_chars.add(i)
for i in range(65, 91): valid_chars.add(i)
for i in range(97, 123): valid_chars.add(i)
valid_chars.add(95)

def is_prime(n):
    if n < 2: return False
    for i in range(2, int(n**0.5)+1):
        if n%i==0: return False
    return True

M = 2**64

print("Checking repetitive chars...")
for c in valid_chars:
    # We need regex match: digit, upper, lower.
    # Single char repeated cannot satisfy regex.
    # So this pattern is impossible unless we add prefix.
    pass

print("Checking prefix + repetitive...")
# Example: 1Aa + ccc...
# Prefix P, S.
# Total P = P_pre * c^k.
# Total S = S_pre + c*k.
# Check P_pre * c^k == S_pre + c*k (mod M)
# and isPrime(Total S).

prefixes = ["1Aa", "1aA", "A1a", "Aa1", "a1A", "aA1", "0B_", "9Zz"]
# 1Aa: S=211, P=308945
pre_s = 211
pre_p = 308945

valid_digits = [i for i in range(48, 58)]
valid_upper = [i for i in range(65, 91)]
valid_lower = [i for i in range(97, 123)]

# Try constructing simple valid prefixes
from itertools import product
simple_prefixes = []
for d in [49]: # '1'
    for u in [65]: # 'A'
        for l in [97]: # 'a'
            simple_prefixes.append([d, u, l])

for pre in simple_prefixes:
    p_pre = 1
    s_pre = 0
    for x in pre: p_pre *= x; s_pre += x
    
    for c in valid_chars:
        # Check k from 1 to 200000
        # Iterate efficiently:
        # P_curr = p_pre
        # S_curr = s_pre
        # P_curr *= c
        # S_curr += c
        
        # Use pow for jump? NO, sequential is fast enough.
        
        curr_p = p_pre
        curr_s = s_pre
        
        for k in range(1, 100000):
            curr_p = (curr_p * c) % M
            curr_s = curr_s + c
            
            # Check s == p (modulo wrap behavior check)
            # p as signed int64
            p_signed = curr_p
            if p_signed >= 2**63: p_signed -= 2**64
            
            if p_signed == curr_s:
                # Found candidate!
                # Check regex (prefix already has d,u,l)
                if is_prime(curr_s):
                    print(f"FOUND PATTERN: Prefix {pre} + char {chr(c)} * {k}")
                    full = "".join(chr(x) for x in pre) + chr(c)*k
                    print(f"String: {full}")
                    exit(0)

print("Done checking patterns.")
