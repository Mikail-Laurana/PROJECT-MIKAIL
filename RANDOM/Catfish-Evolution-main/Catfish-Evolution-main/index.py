import pygame
import random
import sys
import os

pygame.init()

WIDTH, HEIGHT = 800, 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Feeding Frenzy - Catfish Evolution")
clock = pygame.time.Clock()

WHITE = (255, 255, 255)
BLACK = (0, 0, 0)

font = pygame.font.SysFont(None, 36)

level_sizes = [
    (50, 30),  # Level 1
    (70, 42),  # Level 2
    (90, 54),  # Level 3
    (110, 66), # Level 4
    (140, 84), # Level 5
    (160, 90), # Level 6
    (180, 100), # Level 7
    (200, 110), # Level 8
    (220, 120), # Level 9
    (240, 130)  # Level 10
]

level_enemy_sizes = [(200, 125)]  # fixed largest enemy size
new_enemy_size = (160, 90)

base_path = os.path.dirname(os.path.abspath(__file__))
image_path = os.path.join(base_path, "images")

# Load backgrounds

bonus_fish_img = pygame.image.load(os.path.join(image_path, "bonus_fish.png")).convert()
bonus_fish_img = pygame.transform.scale(bonus_fish_img, (30, 30))

background_default = pygame.image.load(os.path.join(image_path, "background.png")).convert()
background_default = pygame.transform.scale(background_default, (WIDTH, HEIGHT))

background_level3 = pygame.image.load(os.path.join(image_path, "background3.png")).convert()
background_level3 = pygame.transform.scale(background_level3, (WIDTH, HEIGHT))

background_level5 = pygame.image.load(os.path.join(image_path, "background5.png")).convert()
background_level5 = pygame.transform.scale(background_level5, (WIDTH, HEIGHT))

# Load other images (catfish, fishes, enemies)
catfish_img = pygame.image.load(os.path.join(image_path, "catfish.png")).convert_alpha()
small_fish_img = pygame.image.load(os.path.join(image_path, "small_fish.png")).convert_alpha()
big_fish_img = pygame.image.load(os.path.join(image_path, "big_fish.png")).convert_alpha()
enemy_img = pygame.image.load(os.path.join(image_path, "enemy_fish.png")).convert_alpha()
fast_enemy_img = pygame.image.load(os.path.join(image_path, "fast_enemy.png")).convert_alpha()
fast_enemy_img = pygame.transform.scale(fast_enemy_img, (100, 60))  # Assuming fast_enemy size is 80x40

catfish_img = pygame.transform.scale(catfish_img, level_sizes[0])
small_fish_img = pygame.transform.scale(small_fish_img, (30, 20))
big_fish_img = pygame.transform.scale(big_fish_img, (100, 70))
enemy_img = pygame.transform.scale(enemy_img, level_enemy_sizes[0])

fast_enemy = None
fast_enemy_speed = [0, 0]
fast_enemy_cooldown = 0

def create_small_fish():
    return pygame.Rect(random.randint(0, WIDTH), random.randint(0, HEIGHT), 30, 20)

def create_big_fish():
    return pygame.Rect(WIDTH + random.randint(0, 200), random.randint(0, HEIGHT), 100, 70)

def create_enemy(size=None):
    width, height = size if size else level_enemy_sizes[0]
    return pygame.Rect(WIDTH + random.randint(0, 200), random.randint(0, HEIGHT - height), width, height)

def create_new_enemy():
    return pygame.Rect(WIDTH + random.randint(0, 200), random.randint(0, HEIGHT), *new_enemy_size)

def create_bonus_fish():
    x, y = random.randint(0, WIDTH), random.randint(0, HEIGHT)
    speed_x = random.choice([-4, 4])
    speed_y = random.choice([-4, 4])
    return pygame.Rect(x, y, 30, 30), speed_x, speed_y

def create_fast_enemy():
    x, y = random.randint(0, WIDTH), random.randint(0, HEIGHT)
    speed_x = random.choice([-8, 8])
    speed_y = random.choice([-8, 8])
    return pygame.Rect(x, y, 100, 60), speed_x, speed_y  # size matches fast_enemy_img

def reset_game():
    global catfish, catfish_speed, catfish_level, small_fish, big_fish, enemies, score
    global game_over, new_enemy, bonus_fish, double_xp, bonus_timer, bonus_cooldown
    global menu_state, start_game, last_enemy_appear_time, catfish_facing_right

    catfish = pygame.Rect(WIDTH // 2, HEIGHT // 2, *level_sizes[0])
    catfish_speed = 5
    catfish_level = 1
    small_fish = [create_small_fish() for _ in range(5)]
    big_fish = [create_big_fish() for _ in range(3)]
    enemies = []
    score = 0
    game_over = False
    new_enemy = None
    double_xp = False
    bonus_fish = None
    bonus_fish_cooldown = 0
    bonus_timer = 0
    menu_state = "main"
    last_enemy_appear_time = pygame.time.get_ticks()
    catfish_facing_right = True

reset_game()

start_game = False

level_thresholds = [
    100,
    250,
    500,
    1000,
    2000,
    4000,
    8000,
    16000,
    32000,
    64000
]

enemy_interval = 5000

def get_enemy_target_count(level):
    if level >= 5:
        return 3
    elif level >= 3:
        return 2
    else:
        return 1

fast_enemy = None
fast_enemy_timer = 0

running = True
while running:
    clock.tick(60)

    current_time = pygame.time.get_ticks()

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        if not start_game:
            if event.type == pygame.MOUSEBUTTONDOWN:
                if play_button.collidepoint(event.pos):
                    start_game = True
                elif exit_button.collidepoint(event.pos):
                    running = False
        elif game_over and event.type == pygame.MOUSEBUTTONDOWN:
            if restart_button.collidepoint(event.pos):
                reset_game()

    if not start_game:
        background_main = pygame.image.load(os.path.join(image_path, "background_main.png")).convert()
        background_main = pygame.transform.scale(background_main, (WIDTH, HEIGHT))
        screen.blit(background_main, (0, 0))
        play_button = pygame.Rect(WIDTH // 2 - 100, HEIGHT // 2 - 50, 200, 50)
        exit_button = pygame.Rect(WIDTH // 2 - 100, HEIGHT // 2 + 20, 200, 50)

        mouse_pos = pygame.mouse.get_pos()

        play_color = (0, 200, 0) if play_button.collidepoint(mouse_pos) else (0, 255, 0)
        exit_color = (180, 180, 180) if exit_button.collidepoint(mouse_pos) else (200, 200, 200)

        pygame.draw.rect(screen, play_color, play_button)
        pygame.draw.rect(screen, exit_color, exit_button)

        play_text = font.render("Play", True, BLACK)
        exit_text = font.render("Exit", True, BLACK)

        screen.blit(play_text, (play_button.x + 70, play_button.y + 10))
        screen.blit(exit_text, (exit_button.x + 80, exit_button.y + 10))

        pygame.display.flip()
        continue

    if catfish_level == 3 or catfish_level == 4:
        current_background = background_level3
    elif catfish_level >= 5:
        current_background = background_level5
    else:
        current_background = background_default

    screen.blit(current_background, (0, 0))

    if not game_over:
        keys = pygame.key.get_pressed()
        if keys[pygame.K_LEFT] and catfish.left > 0:
            catfish.x -= catfish_speed
            catfish_facing_right = False
        if keys[pygame.K_RIGHT] and catfish.right < WIDTH:
            catfish.x += catfish_speed
            catfish_facing_right = True
        if keys[pygame.K_UP] and catfish.top > 0:
            catfish.y -= catfish_speed
        if keys[pygame.K_DOWN] and catfish.bottom < HEIGHT:
            catfish.y += catfish_speed

        catfish_img_scaled = pygame.transform.scale(catfish_img, (catfish.width, catfish.height))
        if not catfish_facing_right:
            catfish_img_scaled = pygame.transform.flip(catfish_img_scaled, True, False)
        screen.blit(catfish_img_scaled, catfish.topleft)

        for fish in small_fish[:]:
            fish.x -= 2
            if fish.right < 0:
                fish.x = WIDTH
                fish.y = random.randint(0, HEIGHT)
            small_fish_img_scaled = pygame.transform.scale(small_fish_img, (fish.width, fish.height))
            screen.blit(small_fish_img_scaled, fish.topleft)
            if catfish.colliderect(fish):
                small_fish.remove(fish)
                score += 10 * (2 if double_xp else 1)
                small_fish.append(create_small_fish())

        for fish in big_fish[:]:
            fish.x -= 3
            if fish.right < 0:
                fish.x = WIDTH
                fish.y = random.randint(0, HEIGHT)
            big_fish_img_scaled = pygame.transform.scale(big_fish_img, (fish.width, fish.height))
            screen.blit(big_fish_img_scaled, fish.topleft)
            if catfish.colliderect(fish):
                if catfish_level >= 3:
                    big_fish.remove(fish)
                    score += 30 * (2 if double_xp else 1)
                    big_fish.append(create_big_fish())
                else:
                    game_over = True

        for i, threshold in enumerate(level_thresholds):
            if score >= threshold and catfish_level == i + 1:
                catfish_level += 1
                catfish.width, catfish.height = level_sizes[min(catfish_level - 1, 4)]
                break

        target_enemy_count = get_enemy_target_count(catfish_level)
        if current_time - last_enemy_appear_time >= enemy_interval:
            last_enemy_appear_time = current_time
            while len(enemies) < target_enemy_count:
                enemies.append(create_enemy(level_enemy_sizes[0]))
            while len(enemies) > target_enemy_count:
                enemies.pop()
            for i in range(len(enemies)):
                enemies[i] = create_enemy(level_enemy_sizes[0])

        for enemy in enemies[:]:
            enemy.x -= 4
            enemy_img_scaled = pygame.transform.scale(enemy_img, (enemy.width, enemy.height))
            screen.blit(enemy_img_scaled, enemy.topleft)

            enemy.width, enemy.height = level_enemy_sizes[0]

            for fish in small_fish[:]:
                if enemy.colliderect(fish):
                    small_fish.remove(fish)
                    small_fish.append(create_small_fish())

            for fish in big_fish[:]:
                if enemy.colliderect(fish):
                    big_fish.remove(fish)
                    big_fish.append(create_big_fish())

            if enemy.right < 0:
                pass

            if catfish.colliderect(enemy):
                if catfish_level >= 5:
                    enemies.remove(enemy)
                    score += 50
                else:
                    game_over = True

        if score >= 10000 and new_enemy is None:
            new_enemy = create_new_enemy()

        if new_enemy:
            new_enemy.x -= 5
            if new_enemy.right < 0:
                new_enemy.x = WIDTH + random.randint(0, 300)
                new_enemy.y = random.randint(0, HEIGHT - new_enemy.height)
            pygame.draw.ellipse(screen, (255, 215, 0), new_enemy)

            for fish in small_fish[:]:
                if new_enemy.colliderect(fish):
                    small_fish.remove(fish)
                    small_fish.append(create_small_fish())

            for fish in big_fish[:]:
                if new_enemy.colliderect(fish):
                    big_fish.remove(fish)
                    big_fish.append(create_big_fish())

            if catfish.colliderect(new_enemy):
                new_enemy = None
                score += 100

            if bonus_fish is None and bonus_fish_cooldown <= 0:
                rect = pygame.Rect(random.randint(0, WIDTH-50), random.randint(0, HEIGHT-50), 40, 40)
                vx = random.choice([-3, 3])
                vy = random.choice([-3, 3])
                bonus_fish = (rect, vx, vy)
                bonus_fish_cooldown = 600

            if bonus_fish:
                bonus_rect, vx, vy = bonus_fish
                bonus_rect.x += vx
                bonus_rect.y += vy

                if bonus_rect.left < 0 or bonus_rect.right > WIDTH:
                    vx *= -1
                if bonus_rect.top < 0 or bonus_rect.bottom > HEIGHT:
                    vy *= -1

                bonus_fish = (bonus_rect, vx, vy)

            if fast_enemy is None and random.random() < 0.003 and fast_enemy_cooldown == 0:
                fast_enemy, fast_enemy_speed[0], fast_enemy_speed[1] = create_fast_enemy()

            if bonus_fish:
                bonus_rect, vx, vy = bonus_fish
                if bonus_rect.left < 0 or bonus_rect.right > WIDTH:
                    bonus_fish = None
                elif bonus_rect.top < 0 or bonus_rect.bottom > HEIGHT:
                    bonus_fish = None
                elif bonus_rect.colliderect(catfish):
                    double_xp = True
                    bonus_timer = 500
                    bonus_fish = None
                    bonus_fish_cooldown = 300
                else:
                    screen.blit(bonus_fish_img, bonus_rect.topleft)

            if bonus_fish_cooldown > 0:
                bonus_fish_cooldown -= 1

        if double_xp:
            xp_text = font.render(f"Double XP: {bonus_timer // 60}s", True, WHITE)
            screen.blit(xp_text, (10, 10))

        if catfish_level >= 5:
            if fast_enemy is None and current_time - fast_enemy_timer > 2500:
                fast_enemy = pygame.Rect(WIDTH, random.randint(0, HEIGHT - 40), 80, 40)
                fast_enemy_timer = current_time

            if fast_enemy:
                if catfish_level == 5:
                    speed = 6
                elif catfish_level >= 6:
                    speed = 14
                else:
                    speed = 10
                fast_enemy.x -= speed
                screen.blit(fast_enemy_img, fast_enemy.topleft)

                if catfish.colliderect(fast_enemy):
                    game_over = True

                if fast_enemy.right < 0:
                    fast_enemy = None

        screen.blit(font.render(f"Score: {score}", True, WHITE), (10, 40))
        screen.blit(font.render(f"Level: {catfish_level}", True, WHITE), (10, 70))

    else:
        game_over_text = font.render("Game Over! Click to Restart", True, WHITE)
        screen.blit(game_over_text, (WIDTH // 2 - game_over_text.get_width() // 2, HEIGHT // 2))

        restart_button = pygame.Rect(WIDTH // 2 - 100, HEIGHT // 2 + 50, 200, 50)
        pygame.draw.rect(screen, (255, 0, 0), restart_button)
        restart_text = font.render("Restart", True, WHITE)
        screen.blit(restart_text, (restart_button.x + restart_button.width // 2 - restart_text.get_width() // 2,
                                   restart_button.y + restart_button.height // 2 - restart_text.get_height() // 2))

    pygame.display.flip()

pygame.quit()
sys.exit()

