#include <iostream>
#include <vector>
#include <string>
#include <numeric>
#include <algorithm>
#include <map>
#include <fstream>

// Valid primes <= 122
std::vector<int> primes = {2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113};

// Factorization result
struct Factors {
    std::map<int, int> counts;
};

// Check if valid prime factors
bool is_smooth(unsigned long long n, std::map<int, int>& factors) {
    if (n == 0) return false;
    for (int p : primes) {
        while (n % p == 0) {
            factors[p]++;
            n /= p;
        }
        if (n == 1) return true;
    }
    return n == 1; // Should be 1 if smooth
}

// Global valid chars
std::vector<int> valid_chars;
std::vector<int> valid_digits;
std::vector<int> valid_upper;
std::vector<int> valid_lower;
bool is_valid_char[128];

// Map char to factors
std::vector<std::pair<int, int>> char_factors[128]; // char -> list of (prime, count)

void init() {
    for (int i=48; i<=57; i++) { valid_chars.push_back(i); valid_digits.push_back(i); }
    for (int i=65; i<=90; i++) { valid_chars.push_back(i); valid_upper.push_back(i); }
    for (int i=97; i<=122; i++) { valid_chars.push_back(i); valid_lower.push_back(i); }
    valid_chars.push_back(95); // _
    
    std::sort(valid_chars.rbegin(), valid_chars.rend()); // Largest first
    
    for (int i=0; i<128; i++) is_valid_char[i] = false;
    for (int c : valid_chars) is_valid_char[c] = true;
    
    for (int c : valid_chars) {
        int temp = c;
        for (int p : primes) {
            int cnt = 0;
            while (temp % p == 0) {
                cnt++;
                temp /= p;
            }
            if (cnt > 0) char_factors[c].push_back({p, cnt});
        }
    }
}

// Backtracking
// We need to form chars that sum to 'target_sum', using factors 'counts'.
// Constraint: at least one digit, one upper, one lower.
bool solve(std::map<int, int>& counts, int current_sum, int target_sum, std::vector<int>& solution, bool has_digit, bool has_upper, bool has_lower) {
    // Check if factors empty
    bool empty = true;
    for (auto const& [p, cnt] : counts) {
        if (cnt > 0) { empty = false; break; }
    }
    
    if (empty) {
        return (current_sum == target_sum && has_digit && has_upper && has_lower);
    }
    
    if (current_sum >= target_sum) return false;
    
    // Pruning: Min char is 48.
    // Remaining sum required: target_sum - current_sum.
    // Estimate remaining chars? Hard.
    
    // Heuristic: Try to match factors.
    // Try chars that fit in current factors.
    // To speed up, we can just iterate all valid chars?
    
    for (int c : valid_chars) {
        // Can we pick c?
        bool ok = true;
        for (auto& p_pair : char_factors[c]) {
            if (counts[p_pair.first] < p_pair.second) { ok = false; break; }
        }
        if (!ok) continue;
        
        // Pick c
        for (auto& p_pair : char_factors[c]) counts[p_pair.first] -= p_pair.second;
        solution.push_back(c);
        
        bool nd = has_digit || (c >= 48 && c <= 57);
        bool nu = has_upper || (c >= 65 && c <= 90);
        bool nl = has_lower || (c >= 97 && c <= 122);
        
        if (solve(counts, current_sum + c, target_sum, solution, nd, nu, nl)) return true;
        
        // Backtrack
        solution.pop_back();
        for (auto& p_pair : char_factors[c]) counts[p_pair.first] += p_pair.second;
    }
    return false;
}

bool is_prime_func(int n) {
    if (n < 2) return false;
    for (int i=2; i*i<=n; i++) if (n%i==0) return false;
    return true;
}

int main() {
    init();
    std::cout << "Starting C++ Solver..." << std::endl;
    
    // K range 1 to 2000000
    // S range 600 to 1500 (primes only)
    std::vector<int> S_candidates;
    for (int s=600; s<=1500; s++) {
        if (is_prime_func(s)) S_candidates.push_back(s);
    }
    
    unsigned long long M = 0; // 2^64 implicit in ULL
    
    for (unsigned long long K = 1; K <= 2000000; K++) {
        if (K % 10000 == 0) std::cout << "K=" << K << std::endl;
        
        for (int S : S_candidates) {
            // Target T = K * 2^64 + S
            // Represented as just S in unsigned long long? No.
            // We need to factor the TRUE integer value.
            // But we can't hold K*2^64+S in generic int.
            // Wait! T is > 2^64.
            // We need 128-bit integer or custom factorization?
            // GCC has __int128_t.
            
            unsigned __int128 T = (unsigned __int128)K;
            T = (T << 64) + S;
            
            // Factor T
            std::map<int, int> factors;
            unsigned __int128 temp = T;
            
            bool smooth = true;
            for (int p : primes) {
                while (temp % p == 0) {
                    factors[p]++;
                    temp /= p;
                }
                if (temp == 1) break;
            }
            if (temp != 1) smooth = false;
            
            if (smooth) {
                // Try to solve partition
                std::cout << "Found Smooth Item! K=" << K << " S=" << S << std::endl;
                std::vector<int> sol;
                if (solve(factors, 0, S, sol, false, false, false)) {
                    std::cout << "SOLUTION FOUND!" << std::endl;
                    std::ofstream out("solution.txt");
                    for (int c : sol) out << (char)c;
                    out.close();
                    return 0;
                }
            }
        }
    }
    return 0;
}
