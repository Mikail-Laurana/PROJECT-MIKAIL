#include <iostream>
#include <vector>
#include <string>
#include <numeric>
#include <algorithm>
#include <map>
#include <fstream>
#include <climits>

// Valid primes
std::vector<int> primes = {2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113};

// Global valid chars
std::vector<int> valid_chars;
std::vector<std::pair<int, int>> char_factors[128]; 

void init() {
    for (int i=48; i<=57; i++) valid_chars.push_back(i);
    for (int i=65; i<=90; i++) valid_chars.push_back(i);
    for (int i=97; i<=122; i++) valid_chars.push_back(i);
    valid_chars.push_back(95); 
    
    std::sort(valid_chars.rbegin(), valid_chars.rend());
    
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
bool solve(std::map<int, int>& counts, int current_sum, int target_sum, std::vector<int>& solution, bool has_digit, bool has_upper, bool has_lower) {
    bool empty = true;
    for (auto const& [p, cnt] : counts) {
        if (cnt > 0) { empty = false; break; }
    }
    
    if (empty) {
        return (current_sum == target_sum && has_digit && has_upper && has_lower);
    }
    
    if (current_sum >= target_sum) return false;
    
    for (int c : valid_chars) {
        bool ok = true;
        for (auto& p_pair : char_factors[c]) {
            if (counts[p_pair.first] < p_pair.second) { ok = false; break; }
        }
        if (!ok) continue;
        
        for (auto& p_pair : char_factors[c]) counts[p_pair.first] -= p_pair.second;
        solution.push_back(c);
        
        bool nd = has_digit || (c >= 48 && c <= 57);
        bool nu = has_upper || (c >= 65 && c <= 90);
        bool nl = has_lower || (c >= 97 && c <= 122);
        
        if (solve(counts, current_sum + c, target_sum, solution, nd, nu, nl)) return true;
        
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
    std::cout << "Starting 32-bit Solver..." << std::endl;
    
    std::vector<int> S_candidates;
    for (int s=200; s<=2000; s++) {
        if (is_prime_func(s)) S_candidates.push_back(s);
    }
    
    unsigned long long M = 1ULL << 32; 
    
    // Iterate K from 1 to 5,000,000 (Very aggressive search)
    // P = K * 2^32 + S
    for (int K = 1; K <= 5000000; K++) {
        if (K % 100000 == 0) std::cout << "Checking K=" << K << std::endl;

        unsigned long long base_T = (unsigned long long)K * M;

        for (int S : S_candidates) {
            unsigned long long T = base_T + S;
            
            std::map<int, int> factors;
            unsigned long long temp = T;
            
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
                std::vector<int> sol;
                if (solve(factors, 0, S, sol, false, false, false)) {
                    std::cout << "SOLUTION FOUND!" << std::endl;
                    std::cout << "Input: ";
                    std::ofstream out("solution_32.txt");
                    for (int c : sol) {
                        std::cout << (char)c;
                        out << (char)c;
                    }
                    std::cout << std::endl;
                    std::cout << "Sum: " << S << std::endl;
                    
                    out.close();
                    return 0;
                }
            }
        }
    }
    std::cout << "No solution found." << std::endl;
    return 0;
}
