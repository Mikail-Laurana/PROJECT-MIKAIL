import sys
from ecc import encrypt, decrypt, ECC, generate_keys, scalar_multiplication

curve = ECC()
priv, pub = generate_keys(curve)

try:
    FLAG = open("flag.txt", "r", encoding="utf-8").read().strip()
except FileNotFoundError:
    FLAG = "ARKAV{**REDACTED**}"

def chall():
    print("")
    print(f"============================================")
    print(f"Public Key: {pub}")
    
    while True:
        try:
            print("\nOptions: \n  [1] Encrypt\n  [2] Decrypt\n  [3] Encrypt Flag\n  [4] Exit\n\nPick an option: ", end="")
            sys.stdout.flush()
            choice = sys.stdin.readline().strip()

            if not choice:
                break

            if choice == '1':
                print("Enter plaintext: ", end="")
                sys.stdout.flush()
                pt = sys.stdin.readline().strip()
                c1, c2 = encrypt(pt, pub, curve)
                print(f"\n\n====== Result ======\n C1: {c1}\nCiphertext: {c2}")

            elif choice == '2':
                print("Enter Ciphertext (hex): ", end="")
                sys.stdout.flush()
                ct = sys.stdin.readline().strip()
                print("Enter the x-coordinate of C1: ", end="")
                sys.stdout.flush()
                c1x = sys.stdin.readline().strip()
                print("Enter the y-coordinate of C1: ", end="")
                sys.stdout.flush()
                c1y = sys.stdin.readline().strip()

                print(f"\n\n====== Result ======")
                if not (c1x.isdigit() and c1y.isdigit()):
                    print("Error: Coordinates must be integers.")
                    continue
                
                c1x, c1y = int(c1x), int(c1y)

                try:
                    result = decrypt(ct, (c1x, c1y), priv, curve)
                    print(f"First 6 bytes of the text: {result[:6].hex()}...")

                    shared_point = scalar_multiplication(priv, (c1x, c1y), curve)
                    if shared_point is None:
                        print("Parity of shared point's Y: Infinity")
                    else:
                        parity = "Even" if shared_point[1] % 2 == 0 else "Odd"
                        print(f"Parity of shared point's Y: {parity}")
                except Exception:
                    print("Error: Check your input.")

            elif choice == '3':
                c1, c2 = encrypt(FLAG, pub, curve)
                print(f"\n\n====== Result ======\nThe flag is:")
                print(f"C1: {c1}\nCiphertext: {c2}")

            elif choice == '4':
                print("Goodbye, hope you enjoyed the curves.")
                break

        except EOFError:
            break
        except Exception:
            break

if __name__ == "__main__":
    chall()
