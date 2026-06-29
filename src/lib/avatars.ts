// 150 Japan-themed avatar URLs using DiceBear "icons" style with distinct seeds & colors
// Each avatar has a unique background color and Japan-themed seed for variety

const JAPAN_SEEDS = [
  "sakura", "fujisan", "torii", "samurai", "ninja", "geisha", "ramen", "sushi",
  "onigiri", "matcha", "wasabi", "tempura", "mochi", "dango", "takoyaki", "okonomiyaki",
  "udon", "soba", "bento", "wagyu", "sake", "shochu", "umeshu", "sencha",
  "koi", "tanuki", "kitsune", "daruma", "maneki", "origami", "ikebana", "bonsai",
  "bamboo", "zen", "shinto", "buddha", "kabuki", "noh", "sumo", "judo",
  "karate", "kendo", "aikido", "bushido", "katana", "shuriken", "kunai", "tanto",
  "kimono", "yukata", "geta", "obi", "haori", "hakama", "tabi", "zori",
  "tatami", "futon", "kotatsu", "onsen", "ryokan", "izakaya", "konbini", "pachinko",
  "hanami", "momiji", "tsubaki", "ume", "kiku", "botan", "wisteria", "lotus",
  "crane", "dragon", "phoenix", "tiger", "carp", "owl", "rabbit", "deer",
  "shibuya", "akihabara", "harajuku", "ginza", "shinjuku", "ueno", "asakusa", "roppongi",
  "osaka", "kyoto", "nara", "hokkaido", "okinawa", "hiroshima", "nagoya", "fukuoka",
  "tokyo", "yokohama", "kobe", "sendai", "sapporo", "kamakura", "nikko", "hakone",
  "miyajima", "naoshima", "yakushima", "ishigaki", "amami", "tsushima", "rebun", "rishiri",
  "taiko", "shamisen", "koto", "shakuhachi", "biwa", "wadaiko", "fue", "suzu",
  "shoji", "fusuma", "engawa", "tokonoma", "irori", "noren", "chochin", "andon",
  "hanabi", "matsuri", "omikoshi", "mikoshi", "happi", "hachimaki", "sensu", "uchiwa",
  "tsukimi", "setsubun", "tanabata", "obon", "shogatsu", "hinamatsuri", "kodomo", "shichigosan",
  "wagasa", "kasa", "gion", "maiko", "yokai", "oni", "tengu", "kappa",
];

// Distinct background colors for variety
const BG_COLORS = [
  "c0392b", "e74c3c", "d35400", "e67e22", "f39c12", "f1c40f",
  "27ae60", "2ecc71", "16a085", "1abc9c", "2980b9", "3498db",
  "8e44ad", "9b59b6", "2c3e50", "34495e", "e91e63", "9c27b0",
  "673ab7", "3f51b5", "2196f3", "03a9f4", "00bcd4", "009688",
  "4caf50", "8bc34a", "cddc39", "ff9800", "ff5722", "795548",
];

// Use only styles that always generate full, visible avatars
const STYLES = ["bottts", "avataaars", "fun-emoji", "pixel-art", "lorelei"];

// Generate avatar URLs with varied styles and colors
export const AVATAR_OPTIONS: string[] = JAPAN_SEEDS.slice(0, 150).map((seed, i) => {
  const style = STYLES[i % STYLES.length];
  const bgColor = BG_COLORS[i % BG_COLORS.length];
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=${bgColor}`;
});

// Get a random avatar for new users
export function getRandomAvatar(): string {
  const index = Math.floor(Math.random() * AVATAR_OPTIONS.length);
  return AVATAR_OPTIONS[index];
}
