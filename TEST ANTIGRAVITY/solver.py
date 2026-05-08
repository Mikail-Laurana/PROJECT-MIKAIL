import sys
import re
import collections

# Constants
M = 2**64
VALID_CHARS = set()
for i in range(48, 58): VALID_CHARS.add(i) # 0-9
for i in range(65, 91): VALID_CHARS.add(i) # A-Z
for i in range(97, 123): VALID_CHARS.add(i) # a-z
VALID_CHARS.add(95) # _

SORTED_VALID_CHARS = sorted(list(VALID_CHARS), reverse=True)
PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113]

def is_prime(n):
    if n < 2: return False
    if n in (2, 3): return True
    if n % 2 == 0 or n % 3 == 0: return False
    i = 5
    while i * i <= n:
        if n % i == 0 or n % (i + 2) == 0:
            return False
        i += 6
    return True

def get_factors(n):
    factors = collections.Counter()
    for p in PRIMES:
        while n % p == 0:
            factors[p] += 1
            n //= p
        if n == 1:
            break
    if n != 1:
        return None  # Not smooth
    return factors

CHAR_FACTORS = {}
for c in SORTED_VALID_CHARS:
    f = get_factors(c)
    if f is not None:
        CHAR_FACTORS[c] = f

def get_char_from_factors(needed_factors):
    # Determine possible chars that can be formed
    possible = []
    for c in SORTED_VALID_CHARS:
        f = CHAR_FACTORS.get(c)
        if not f: continue
        # Check if f is subset of needed_factors
        ok = True
        for p, count in f.items():
            if needed_factors[p] < count:
                ok = False
                break
        if ok:
            possible.append(c)
    return possible

def solve_partition(current_factors, target_sum, current_chars):
    # Base case
    if sum(current_factors.values()) == 0:
        if target_sum == 0 and len(current_chars) >= 3:
            # Check Regex constraints
            s = "".join(chr(c) for c in current_chars)
            if re.fullmatch(r"(?=.*\d)(?=.*[A-Z])(?=.*[a-z])\w*", s, flags=re.ASCII):
                return s
        return None

    if target_sum < 48: # Min char
        return None

    # Try to pick a char
    candidates = get_char_from_factors(current_factors)
    
    # Heuristic: Try largest valid chars first to reduce sum quickly?
    # Or try those that match factors best?
    # To avoid deep recursion, maybe limit depth or width?
    
    for c in candidates:
        if c > target_sum: continue
        
        # Recurse
        c_factors = CHAR_FACTORS[c]
        next_factors = current_factors.copy()
        for p, count in c_factors.items():
            next_factors[p] -= count
        
        # Verify next_factors is valid (no negative - already checked)
        # Remove 0 counts
        next_factors = +next_factors # arithmetic to drop Zeros? No, Counter doesn't drop auto
        # Optimization: remove keys with 0
        clean_factors = collections.Counter({k:v for k,v in next_factors.items() if v > 0})
        
        res = solve_partition(clean_factors, target_sum - c, current_chars + [c])
        if res: return res
        
    return None

def main():
    print("Searching for solution...")
    
    # Try a range of K's
    # Range K: 1 to 2000
    # Range S: 500 to 1500 (prime)
    
    # Pre-generate primes in S range
    possible_S = [s for s in range(300, 2000) if is_prime(s)]
    
    for K in range(1, 5000):
        base = K * M
        if K % 100 == 0:
            print(f"Checking K={K}...")
        
        for S in possible_S:
            val = base + S
            factors = get_factors(val)
            if factors:
                # Found a smooth number!
                print(f"Found smooth: K={K}, S={S}")
                # Try to partition
                res = solve_partition(factors, S, [])
                if res:
                    print(f"FOUND SOLUTION: {res}")
                    print(f"Sum: {sum(ord(c) for c in res)}")
                    print(f"Prod (mod 2^64): {1}") # Placeholder
                    # Verify
                    import numpy as np
                    arr = np.array(list(map(ord, res)), dtype=np.int64)
                    s_val = int(arr.sum())
                    p_val = arr.prod() # Overflow behavior
                    print(f"Numpy Sum: {s_val}")
                    print(f"Numpy Prod: {p_val}")
                    # p_val might be negative, we need to check s == p (signed)
                    if s_val == p_val:
                        print("SUCCESS Match!")
                        with open("solution.txt", "w") as f:
                            f.write(res)
                        sys.exit(0)
                    else:
                        print(f"Mismatch: {s_val} != {p_val}")
                        # This mismatch might happen if logic was approximate
                        # But P = K*2^64 + S. 
                        # P % 2^64 == S. 
                        # p_val (signed) should equal S if S < 2^63.
                        # Since S is small positive, p_val should be S.
                        sys.exit(0)

if __name__ == "__main__":
    main()
