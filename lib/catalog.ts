// Product catalog
export const CATALOG = {
  "base_models": [
    {
      "id": "ashfall",
      "name": "Phoenix Ashfall",
      "tier": "Starter",
      "tagline": "Esports-ready speed without the sticker shock.",
      "base_price": 999,
      "image": "/images/ashfall.webp",
      "best_for": "Students and first-time PC gamers",
      "description": "A no-nonsense starter rig tuned for high-refresh esports titles like Valorant, Fortnite and CS2, with room to upgrade as you grow.",
      "performance": "144+ FPS in esports at 1080p",
      "defaults": {
        "cpu": "r5-7600",
        "gpu": "rtx-4060",
        "ram": "16-5200",
        "storage": "1tb-gen4",
        "cooling": "air-240",
        "case": "mesh-mid"
      }
    },
    {
      "id": "spark",
      "name": "Phoenix Spark",
      "tier": "Essential",
      "tagline": "1080p domination. Your first serious rig.",
      "base_price": 1299,
      "image": "/images/spark.webp",
      "best_for": "Casual gamers buying their first serious PC",
      "description": "Balanced, quiet and ARGB-lit. Spark runs modern AAA games at high settings in 1080p and handles streaming, school and creative work.",
      "performance": "100+ FPS in AAA at 1080p High",
      "defaults": {
        "cpu": "r5-7600",
        "gpu": "rtx-4060",
        "ram": "16-5200",
        "storage": "1tb-gen4",
        "cooling": "air-240",
        "case": "mesh-mid"
      }
    },
    {
      "id": "pyre",
      "name": "Phoenix Pyre",
      "tier": "Advanced",
      "tagline": "1440p ultra. Built for creators who game.",
      "base_price": 2199,
      "image": "/images/pyre.webp",
      "best_for": "Streamers and content creators",
      "description": "Pyre's high-core-count CPU and 240mm liquid cooler let you game, stream and edit at the same time without dropping frames.",
      "performance": "120+ FPS in AAA at 1440p Ultra",
      "defaults": {
        "cpu": "u7-265k",
        "gpu": "rtx-5070",
        "ram": "32-6000",
        "storage": "2tb-gen4",
        "cooling": "lc-240-argb",
        "case": "glass-dual"
      }
    },
    {
      "id": "inferno",
      "name": "Phoenix Inferno",
      "tier": "Elite",
      "tagline": "4K uncapped. No compromises, ever.",
      "base_price": 3499,
      "image": "/images/inferno.webp",
      "best_for": "Hardcore gamers chasing max performance",
      "description": "Our flagship. A full-tower showpiece with a 360mm LCD liquid cooler, flagship graphics and enough airflow to stay cool through marathon sessions.",
      "performance": "100+ FPS in AAA at 4K with DLSS",
      "defaults": {
        "cpu": "r7-9800x3d",
        "gpu": "rtx-5080",
        "ram": "64-6000",
        "storage": "2tb-gen5",
        "cooling": "lc-360-lcd",
        "case": "glass-full"
      }
    }
  ],
  "components": {
    "cpu": [
      {
        "id": "r5-7600",
        "name": "AMD Ryzen 5 7600",
        "spec": "6-core · 5.1 GHz boost",
        "price": 0
      },
      {
        "id": "r5-9600x",
        "name": "AMD Ryzen 5 9600X",
        "spec": "6-core · Zen 5 · 5.4 GHz",
        "price": 90
      },
      {
        "id": "r7-7800x3d",
        "name": "AMD Ryzen 7 7800X3D",
        "spec": "8-core · 3D V-Cache",
        "price": 220
      },
      {
        "id": "u7-265k",
        "name": "Intel Core Ultra 7 265K",
        "spec": "20-core · 5.5 GHz",
        "price": 260
      },
      {
        "id": "r7-9800x3d",
        "name": "AMD Ryzen 7 9800X3D",
        "spec": "8-core · gaming king",
        "price": 420
      },
      {
        "id": "u9-285k",
        "name": "Intel Core Ultra 9 285K",
        "spec": "24-core · 5.7 GHz",
        "price": 560
      },
      {
        "id": "r9-9950x3d",
        "name": "AMD Ryzen 9 9950X3D",
        "spec": "16-core · creator + gaming",
        "price": 720
      }
    ],
    "gpu": [
      {
        "id": "rtx-4060",
        "name": "GeForce RTX 4060",
        "spec": "8GB GDDR6",
        "price": 0
      },
      {
        "id": "rx-9060xt",
        "name": "Radeon RX 9060 XT",
        "spec": "16GB GDDR6",
        "price": 140
      },
      {
        "id": "rtx-5060ti",
        "name": "GeForce RTX 5060 Ti",
        "spec": "16GB GDDR7",
        "price": 260
      },
      {
        "id": "rtx-5070",
        "name": "GeForce RTX 5070",
        "spec": "12GB GDDR7",
        "price": 540
      },
      {
        "id": "rx-9070xt",
        "name": "Radeon RX 9070 XT",
        "spec": "16GB GDDR6",
        "price": 680
      },
      {
        "id": "rtx-5070ti",
        "name": "GeForce RTX 5070 Ti",
        "spec": "16GB GDDR7",
        "price": 820
      },
      {
        "id": "rtx-5080",
        "name": "GeForce RTX 5080",
        "spec": "16GB GDDR7",
        "price": 1240
      },
      {
        "id": "rtx-5090",
        "name": "GeForce RTX 5090",
        "spec": "32GB GDDR7",
        "price": 2400
      }
    ],
    "ram": [
      {
        "id": "16-5200",
        "name": "16GB DDR5 5200",
        "spec": "2x8GB · dual channel",
        "price": 0
      },
      {
        "id": "32-6000",
        "name": "32GB DDR5 6000",
        "spec": "2x16GB · CL30",
        "price": 110
      },
      {
        "id": "64-6000",
        "name": "64GB DDR5 6000",
        "spec": "2x32GB · CL30",
        "price": 290
      },
      {
        "id": "96-6400",
        "name": "96GB DDR5 6400",
        "spec": "2x48GB · creator spec",
        "price": 480
      }
    ],
    "storage": [
      {
        "id": "1tb-gen4",
        "name": "1TB NVMe Gen4",
        "spec": "7,000 MB/s reads",
        "price": 0
      },
      {
        "id": "2tb-gen4",
        "name": "2TB NVMe Gen4",
        "spec": "7,000 MB/s reads",
        "price": 110
      },
      {
        "id": "2tb-gen5",
        "name": "2TB NVMe Gen5",
        "spec": "12,400 MB/s reads",
        "price": 240
      },
      {
        "id": "4tb-gen5",
        "name": "4TB NVMe Gen5",
        "spec": "12,400 MB/s reads",
        "price": 520
      },
      {
        "id": "8tb-dual",
        "name": "8TB Dual NVMe",
        "spec": "2x4TB Gen4 · media vault",
        "price": 780
      }
    ],
    "cooling": [
      {
        "id": "air-240",
        "name": "Phoenix Air Tower",
        "spec": "6-heatpipe · quiet",
        "price": 0
      },
      {
        "id": "lc-240-argb",
        "name": "Phoenix Liquid 240 ARGB",
        "spec": "AIO · ARGB pump block",
        "price": 140
      },
      {
        "id": "lc-360-argb",
        "name": "Phoenix Liquid 360 ARGB",
        "spec": "AIO · triple fan",
        "price": 220
      },
      {
        "id": "lc-360-lcd",
        "name": "Phoenix Liquid 360 LCD",
        "spec": "AIO · LCD pump display",
        "price": 340
      },
      {
        "id": "lc-custom",
        "name": "Phoenix Custom Loop",
        "spec": "Hardline · dual rad",
        "price": 690
      }
    ],
    "case": [
      {
        "id": "mesh-mid",
        "name": "Phoenix Aero Mesh",
        "spec": "Mid-tower · 3 ARGB fans",
        "price": 0
      },
      {
        "id": "stealth-mid",
        "name": "Phoenix Shadow",
        "spec": "Blacked-out · silent panels",
        "price": 40
      },
      {
        "id": "white-mid",
        "name": "Phoenix Frost White",
        "spec": "All-white · glass side",
        "price": 80
      },
      {
        "id": "glass-dual",
        "name": "Phoenix Panorama",
        "spec": "Dual-chamber · wraparound glass",
        "price": 140
      },
      {
        "id": "glass-full",
        "name": "Phoenix Titan",
        "spec": "Full tower · 9 ARGB fans",
        "price": 220
      }
    ]
  },
  "slot_info": {
    "cpu": "The brain of your build. X3D chips lead in gaming; higher core counts speed up streaming, rendering and compiling.",
    "gpu": "The biggest factor in frame rate and resolution. Step up for 1440p, 4K or ray tracing.",
    "ram": "32GB is the sweet spot for gaming in 2026. Go 64GB+ for 4K editing, VMs or heavy multitasking.",
    "storage": "NVMe means near-instant load times. Gen5 drives are the fastest you can buy.",
    "cooling": "Keeps clocks high and fans quiet. Liquid AIOs add ARGB flair and extra headroom.",
    "case": "Every case ships with pre-tuned ARGB lighting, dust filters and hand-done cable management."
  },
  "prebuilts": [
    {
      "id": "pb-cinder",
      "name": "Cinder Lite",
      "chipset": "AMD RYZEN",
      "gpu_chipset": "GeForce RTX 4060 · Ryzen 5 7600 · 16GB DDR5 · 1TB NVMe",
      "price": 1049,
      "was_price": 1149,
      "badge": "Best Value",
      "rating": "4.8",
      "reviews": 112,
      "image": "/images/ashfall.webp",
      "monthly": 35,
      "base_model": "ashfall",
      "config": {
        "cpu": "r5-7600",
        "gpu": "rtx-4060",
        "ram": "16-5200",
        "storage": "1tb-gen4",
        "cooling": "air-240",
        "case": "mesh-mid"
      },
      "blurb": "Our cheapest way into high-refresh esports gaming."
    },
    {
      "id": "pb-ember",
      "name": "Ember R5",
      "chipset": "AMD RYZEN",
      "gpu_chipset": "GeForce RTX 5060 Ti 16GB · Ryzen 5 7600 · 32GB DDR5 · 1TB NVMe",
      "price": 1599,
      "was_price": 1729,
      "badge": "In Stock",
      "rating": "4.9",
      "reviews": 41,
      "image": "/images/spark.webp",
      "monthly": 53,
      "base_model": "spark",
      "config": {
        "cpu": "r5-7600",
        "gpu": "rtx-5060ti",
        "ram": "32-6000",
        "storage": "1tb-gen4",
        "cooling": "lc-240-argb",
        "case": "mesh-mid"
      },
      "blurb": "A 1080p ultra crusher with liquid cooling at a mid-range price."
    },
    {
      "id": "pb-nova",
      "name": "Nova Mini",
      "chipset": "AMD RYZEN",
      "gpu_chipset": "Radeon RX 9070 XT · Ryzen 7 7800X3D · 32GB DDR5 · 2TB NVMe",
      "price": 2149,
      "was_price": 2299,
      "badge": "New",
      "rating": "4.9",
      "reviews": 27,
      "image": "/images/nova.webp",
      "monthly": 72,
      "base_model": "spark",
      "config": {
        "cpu": "r7-7800x3d",
        "gpu": "rx-9070xt",
        "ram": "32-6000",
        "storage": "2tb-gen4",
        "cooling": "air-240",
        "case": "stealth-mid"
      },
      "blurb": "Small form factor, full-size performance. Fits on any desk."
    },
    {
      "id": "pb-wraith",
      "name": "Wraith Stealth",
      "chipset": "INTEL CORE",
      "gpu_chipset": "GeForce RTX 5070 · Core Ultra 7 265K · 32GB DDR5 · 2TB NVMe",
      "price": 2299,
      "was_price": 2449,
      "badge": "Whisper Quiet",
      "rating": "4.8",
      "reviews": 38,
      "image": "/images/wraith.webp",
      "monthly": 77,
      "base_model": "pyre",
      "config": {
        "cpu": "u7-265k",
        "gpu": "rtx-5070",
        "ram": "32-6000",
        "storage": "2tb-gen4",
        "cooling": "lc-240-argb",
        "case": "stealth-mid"
      },
      "blurb": "Blacked-out and near-silent, for offices and late-night sessions."
    },
    {
      "id": "pb-blaze",
      "name": "Blaze Ultra",
      "chipset": "INTEL CORE",
      "gpu_chipset": "GeForce RTX 5070 · Core Ultra 7 265K · 32GB DDR5 · 2TB NVMe",
      "price": 2439,
      "was_price": 2619,
      "badge": "Only 4 left",
      "rating": "4.9",
      "reviews": 63,
      "image": "/images/pyre.webp",
      "monthly": 81,
      "base_model": "pyre",
      "config": {
        "cpu": "u7-265k",
        "gpu": "rtx-5070",
        "ram": "32-6000",
        "storage": "2tb-gen4",
        "cooling": "lc-360-argb",
        "case": "glass-dual"
      },
      "blurb": "Our best-selling 1440p streaming rig."
    },
    {
      "id": "pb-valkyrie",
      "name": "Valkyrie Frost",
      "chipset": "AMD RYZEN",
      "gpu_chipset": "GeForce RTX 5070 Ti · Ryzen 7 9800X3D · 32GB DDR5 · 2TB Gen5",
      "price": 2999,
      "was_price": 3199,
      "badge": "Fan Favorite",
      "rating": "5.0",
      "reviews": 54,
      "image": "/images/valkyrie.webp",
      "monthly": 100,
      "base_model": "pyre",
      "config": {
        "cpu": "r7-9800x3d",
        "gpu": "rtx-5070ti",
        "ram": "32-6000",
        "storage": "2tb-gen5",
        "cooling": "lc-360-argb",
        "case": "white-mid"
      },
      "blurb": "All-white with icy purple glow. Pure 1440p high-refresh firepower."
    },
    {
      "id": "pb-eclipse",
      "name": "Eclipse X",
      "chipset": "AMD RYZEN",
      "gpu_chipset": "GeForce RTX 5080 · Ryzen 7 9800X3D · 32GB DDR5 · 2TB Gen5",
      "price": 3299,
      "was_price": 3499,
      "badge": "Staff Pick",
      "rating": "5.0",
      "reviews": 22,
      "image": "/images/eclipse.webp",
      "monthly": 110,
      "base_model": "inferno",
      "config": {
        "cpu": "r7-9800x3d",
        "gpu": "rtx-5080",
        "ram": "32-6000",
        "storage": "2tb-gen5",
        "cooling": "lc-360-argb",
        "case": "glass-dual"
      },
      "blurb": "Panoramic glass, vertical GPU and a full purple-to-pink light show."
    },
    {
      "id": "pb-apex",
      "name": "Apex X3D",
      "chipset": "AMD RYZEN",
      "gpu_chipset": "GeForce RTX 5080 · Ryzen 7 9800X3D · 64GB DDR5 · 2TB Gen5",
      "price": 3699,
      "was_price": 3949,
      "badge": "Only 2 left",
      "rating": "5.0",
      "reviews": 18,
      "image": "/images/inferno.webp",
      "monthly": 123,
      "base_model": "inferno",
      "config": {
        "cpu": "r7-9800x3d",
        "gpu": "rtx-5080",
        "ram": "64-6000",
        "storage": "2tb-gen5",
        "cooling": "lc-360-lcd",
        "case": "glass-full"
      },
      "blurb": "4K-ready with the fastest gaming CPU on the planet."
    },
    {
      "id": "pb-talon",
      "name": "Talon Creator",
      "chipset": "AMD RYZEN",
      "gpu_chipset": "GeForce RTX 5090 · Ryzen 9 9950X3D · 96GB DDR5 · 8TB NVMe",
      "price": 5299,
      "was_price": 5699,
      "badge": "Workstation",
      "rating": "4.9",
      "reviews": 11,
      "image": "/images/talon.webp",
      "monthly": 177,
      "base_model": "inferno",
      "config": {
        "cpu": "r9-9950x3d",
        "gpu": "rtx-5090",
        "ram": "96-6400",
        "storage": "8tb-dual",
        "cooling": "lc-custom",
        "case": "glass-full"
      },
      "blurb": "Custom hardline loop and 16 cores for 8K editing, 3D and AI work."
    },
    {
      "id": "pb-eternal",
      "name": "Eternal 5090",
      "chipset": "INTEL CORE",
      "gpu_chipset": "GeForce RTX 5090 · Core Ultra 9 285K · 96GB DDR5 · 4TB Gen5",
      "price": 5499,
      "was_price": 5899,
      "badge": "Rare",
      "rating": "5.0",
      "reviews": 9,
      "image": "/images/inferno.webp",
      "monthly": 183,
      "base_model": "inferno",
      "config": {
        "cpu": "u9-285k",
        "gpu": "rtx-5090",
        "ram": "96-6400",
        "storage": "4tb-gen5",
        "cooling": "lc-custom",
        "case": "glass-full"
      },
      "blurb": "The ultimate Phoenix. Nothing held back."
    }
  ]
} as const;

export const ORDER_STAGES = ["paid_in_full", "building", "stress_testing", "shipped"];
