import pygame
import sys

# Inisialisasi pygame
pygame.init()

# Ukuran layar
WIDTH, HEIGHT = 800, 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Level Complete Screen")

# Warna
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)

# Font
font_pixel = pygame.font.Font(pygame.font.get_default_font(), 36)
font_small = pygame.font.Font(pygame.font.get_default_font(), 24)

# Fungsi untuk membuat layar menjadi hitam perlahan
def fade_to_black(fade_speed=2):
    fade_surface = pygame.Surface((WIDTH, HEIGHT))
    fade_surface.fill(BLACK)
    for i in range(0, 255, fade_speed):
        fade_surface.set_alpha(i)
        screen.fill(WHITE)  # Latar belakang putih, bisa diganti
        screen.blit(fade_surface, (0, 0))
        pygame.display.update()
        pygame.time.delay(10)

# Fungsi fade-in teks yang mempertahankan teks sebelumnya
def fade_in_text(text, font, color, x, y, fade_speed=5, background_color=WHITE, previous_surfaces=[]):
    base_surface = font.render(text, True, color)
    text_width, text_height = base_surface.get_size()
    for alpha in range(0, 256, fade_speed):
        screen.fill(background_color)
        # Tampilkan semua teks sebelumnya agar tidak hilang
        for surface, pos in previous_surfaces:
            screen.blit(surface, pos)
        temp_surface = base_surface.copy()
        temp_surface.set_alpha(alpha)
        screen.blit(temp_surface, (x - text_width // 2, y - text_height // 2))
        pygame.display.update()
        pygame.time.delay(10)
    return base_surface, (x - text_width // 2, y - text_height // 2)

# Fungsi utama animasi
def level_complete_screen(coins_collected):
    # Fade to black
    fade_to_black()

    # Tampilkan teks "Level Complete"
    level_text, level_pos = fade_in_text(
        "Level Complete", font_pixel, WHITE, WIDTH // 2, HEIGHT // 3
    )

    # Tampilkan teks "Coins Collected" tanpa menghapus yang sebelumnya
    fade_in_text(
        f"Coins Collected: {coins_collected}",
        font_small, WHITE, WIDTH // 2, HEIGHT // 2,
        previous_surfaces=[(level_text, level_pos)]
    )

    # Tahan selama 2 detik
    pygame.time.delay(2000)

# Fungsi utama game
def main():
    running = True
    coins_collected = 0 # Contoh jumlah koin

    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False

        level_complete_screen(coins_collected)
        running = False  # Keluar setelah menampilkan layar selesai level

    pygame.quit()
    sys.exit()

if __name__ == "__main__":
    main()