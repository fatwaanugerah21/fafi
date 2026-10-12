/**
 * All spoken copy lives in this file.
 *
 * To add a photo later, set `image` on an opener or story scene and place the
 * file in public/images:
 *   image: { src: "/images/nama-file.jpg", alt: "Deskripsi singkat foto." }
 * Leave `image` unset to hide the photo area completely.
 * Describe what is actually in the picture. Do not claim a photo records a
 * specific event unless that is known.
 */

export type SceneImage = {
  src: string;
  alt: string;
};

type SceneBase = {
  id: string;
};

export type OpenerScene = SceneBase & {
  kind: "opener";
  lines: readonly [string, string];
  support: string;
  nextLabel: string;
  image?: SceneImage;
};

export type StoryPart = {
  label: string;
  paragraphs: readonly string[];
};

export type StoryScene = SceneBase & {
  kind: "story";
  moment: string;
  label: string;
  title: string;
  paragraphs?: readonly string[];
  parts?: readonly StoryPart[];
  note?: string;
  route?: string;
  motif: "none" | "chat" | "coffee" | "day" | "route";
  nextLabel: string;
  image?: SceneImage;
};

export type TransitionScene = SceneBase & {
  kind: "transition";
  line: string;
  nextLabel: string;
};

export type ClosingScene = SceneBase & {
  kind: "closing";
  name: string;
  ask: string;
  cue: string;
};

export type Scene = OpenerScene | StoryScene | TransitionScene | ClosingScene;

export const story: readonly Scene[] = [
  {
    id: "opener",
    kind: "opener",
    lines: ["Saya Fatwa, Kamu Fitry.", "Saya Fatwa, Kamu Fitry."],
    support: "Ini cerita kita sejauh ini.",
    nextLabel: "Mulai cerita",
  },
  {
    id: "instagram",
    kind: "story",
    moment: "01",
    label: "Online chatting",
    title: "Saya suka energi kamu.",
    paragraphs: [
      "Waktu kita mulai chatting di Instagram, saya suka vibes kamu yang penuh semangat dan sungguh-sungguh.",
      "Belum ketemu saja, saya sudah suka ngobrol sama kamu.",
    ],
    motif: "chat",
    nextLabel: "Lanjut",
  },
  {
    id: "swiss",
    kind: "story",
    moment: "02",
    label: "Pertama ketemu · Antar ke Citra Land",
    title: "Ternyata, kamu cantik sekali.",
    paragraphs: [
      "Pertama kali kita ketemu, saya jemput kamu di Swiss sebelum saya pergi berenang.",
      "Wew kamu cantik sekali wkwkwk. Saya suka juga caramu ngobrol.",
      "Walaupun kadang saya kurang mengerti kamu bilang apa, wkwkwk.",
    ],
    motif: "none",
    nextLabel: "Lanjut",
  },
  {
    id: "october-10",
    kind: "story",
    moment: "03",
    label: "Sabtu, 10 Oktober 2026",
    title: "Rencananya WFC. Tiba tiba nonton bioskop.",
    paragraphs: [
      "Kita ke Fore buat WFC. Saya sempat datang sedikit terlambat. Sorry yaah",
      "Terus, out of nowhere, kita malah pergi nonton Rusun 609 bareng.",
      "Saya suka ternyata waktu sama kamu bisa sespontan itu.",
    ],
    motif: "coffee",
    nextLabel: "Lanjut",
  },
  {
    id: "october-11",
    kind: "story",
    moment: "04",
    label: "Minggu, 11 Oktober 2026",
    title: "Pagi sepedaan. Sore berenang.",
    parts: [
      {
        label: "Pagi",
        paragraphs: [
          "Paginya kita rencana jogging, eh tiba-tiba malah jadi sepedaan, wkwk.",
        ],
      },
      {
        label: "Sore",
        paragraphs: [
          "Sorenya kita berenang bareng. Saya makin suka menghabiskan waktu sama kamu.",
          "Dan sore itu, saya makin suka kamu.",
        ],
      },
    ],
    motif: "day",
    nextLabel: "Lanjut",
  },
  {
    id: "october-12",
    kind: "story",
    moment: "05",
    label: "Senin, 12 Oktober 2026",
    title: "Rencana boleh berubah.",
    paragraphs: [
      "Pagi gagal jogging karena sa ketiduran sorry naahh, siang kita jalan sama-sama. Lah tiab tiba ubah rencana dari Open Trip Saponda jadi Pulau Hari. Sangat spontan gang hahaha",
      "Saya suka kamu yang dinamis, mau menyesuaikan rencana, dan tidak kaku.",
      "Makin kenal kamu, makin banyak hal yang saya suka.",
    ],
    route: "Perubahan rencana: Saponda → Pulau Hari",
    motif: "route",
    nextLabel: "Lanjut",
  },
  {
    id: "closing",
    kind: "closing",
    name: "Fitry Yulia Ningsi,",
    ask: "AYOO PACARAANNN!!!.",
    cue: "Suit. Kalau saya menang kamu jadi pacarku.",
  },
];

export const progressTotal = story.filter(
  (scene) => scene.kind === "opener" || scene.kind === "story",
).length;
