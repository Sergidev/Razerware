import random

from django.core.management.base import BaseCommand
from django.utils.text import slugify

from catalog.models import Category, Product

CATEGORIES = {
    "desktops": "Desktop PCs",
    "laptops": "Laptops",
    "mice": "Mice",
    "keyboards": "Keyboards",
    "headsets": "Headsets",
}

# (model, brand, cpu, gpu, ram, storage, price)
DESKTOPS = [
    ("Nova", "NZXT", "Intel Core i5-12400F", "RTX 3050 8GB", "16 GB DDR4", "500 GB NVMe", 649),
    ("Titan", "Voltion", "AMD Ryzen 5 5500", "RTX 3060 12GB", "16 GB DDR4", "1 TB NVMe", 749),
    ("R5", "Nexus", "AMD Ryzen 5 5600", "RX 6600 8GB", "16 GB DDR4", "500 GB NVMe", 729),
    ("R5 Pro", "Nexora", "AMD Ryzen 5 7600", "RTX 4060 8GB", "16 GB DDR5", "1 TB NVMe", 999),
    ("i5", "Kinetic", "Intel Core i5-14400F", "RTX 4060 8GB", "16 GB DDR5", "1 TB NVMe", 1049),
    ("Fallstar", "Aurora", "Intel Core i5-14600KF", "RTX 4060 Ti 8GB", "32 GB DDR5", "1 TB NVMe", 1299),
    ("X5", "Viper", "AMD Ryzen 5 7600X", "RX 7700 XT 12GB", "32 GB DDR5", "1 TB NVMe", 1249),
    ("D70", "Astra", "AMD Ryzen 7 7700", "RX 4070 Ti 16GB", "32 GB DDR5", "1 TB NVMe", 1449),
    ("i7", "NZXT", "Intel Core i7-14700KF", "RTX 4070 Super 12GB", "32 GB DDR5", "2 TB NVMe", 1699),
    ("Nexus Galaxy", "Core Nexus", "Intel Core i7-14700KF", "RTX 4070 Ti Super 16GB", "32 GB DDR5", "2 TB NVMe", 1899),
    ("Prime", "Astra", "AMD Ryzen 7 7800X3D", "RTX 4070 Ti 12GB", "32 GB DDR5", "2 TB NVMe", 1849),
    ("Techpower", "NZXT", "AMD Ryzen 7 7800X3D", "RTX 4080 Super 16GB", "32 GB DDR5", "2 TB NVMe", 2299),
    ("Phantom 9", "Aurora", "AMD Ryzen 9 7900X", "RTX 4070 Ti Super 16GB", "64 GB DDR5", "2 TB NVMe", 2199),
    ("Leviathan 9 X3D", "Aorus", "AMD Ryzen 9 7950X3D", "RTX 4080 Super 16GB", "64 GB DDR5", "2 TB NVMe", 2799),
    ("Tempo i9", "Aero", "Intel Core i9-14900K", "RTX 4080 Super 16GB", "64 GB DDR5", "2 TB NVMe", 2899),
    ("i9 Ultra", "Overlord", "Intel Core i9-14900K", "RTX 4090 24GB", "64 GB DDR5", "4 TB NVMe", 3999),
    ("Inferno", "ABUS", "AMD Ryzen 7 7700X", "RX 7900 XT 20GB", "32 GB DDR5", "2 TB NVMe", 1999),
    ("Stealth XTX", "Overlord", "AMD Ryzen 9 7900X3D", "RX 4070 Ti Super 32GB", "64 GB DDR5", "2 TB NVMe", 2599),
    ("G1", "Lumina", "AMD Ryzen 9 7950X3D", "RTX 4090 24GB", "128 GB DDR5", "4 TB NVMe", 4499),
    ("Core", "Quantum", "Intel Core i7-14700F", "RTX 4070 12GB", "32 GB DDR5", "2 TB NVMe", 1599),
]

# (model, brand, cpu, gpu, ram, storage, screen, price)
LAPTOPS = [
    ("15", "Aetheris", "Intel Core i5-12450H", "RTX 3050 6GB", "16 GB", "512 GB NVMe", '15.6" FHD 144Hz', 799),
    ("15 Plus", "Astra", "AMD Ryzen 5 7535HS", "RTX 4050 6GB", "16 GB", "512 GB NVMe", '15.6" FHD 144Hz', 949),
    ("X7", "Aurora", "Intel Core i5-13500H", "RTX 4060 8GB", "16 GB", "1 TB NVMe", '16" FHD+ 165Hz', 1199),
    ("16 Pro", "Aethel", "AMD Ryzen 7 7840HS", "RTX 4060 8GB", "32 GB", "1 TB NVMe", '16" QHD 165Hz', 1399),
    ("GX", "Aurora", "AMD Ryzen 7 8845HS", "RTX 4060 8GB", "16 GB", "1 TB NVMe", '14" QHD+ 120Hz OLED', 1549),
    ("X", "Axion", "AMD Ryzen 9 8945HS", "RTX 4070 8GB", "32 GB", "1 TB NVMe", '14" 2.8K 120Hz OLED', 1899),
    ("Zero", "Aurora", "Intel Core i7-13700H", "RTX 4070 8GB", "16 GB", "1 TB NVMe", '15.6" QHD 240Hz', 1699),
    ("17", "Axion", "Intel Core i7-14700HX", "RTX 4070 8GB", "32 GB", "1 TB NVMe", '17.3" QHD 240Hz', 1999),
    ("17 Lite Plus", "Axion", "AMD Ryzen 7 7745HX", "RTX 4060 8GB", "16 GB", "1 TB NVMe", '16" QHD+ 240Hz', 1499),
    ("Raptor", "Aurora", "AMD Ryzen 9 7945HX", "RTX 4080 12GB", "32 GB", "2 TB NVMe", '16" QHD+ 240Hz Mini-LED', 2599),
    ("Titan ZXE", "Astra", "Intel Core i9-14900HX", "RTX 4080 12GB", "32 GB", "2 TB NVMe", '18" QHD+ 240Hz', 2799),
    ("Nomad", "Aetherium", "Intel Core i9-14900HX", "RTX 4090 16GB", "64 GB", "4 TB NVMe", '18" UHD+ 120Hz Mini-LED', 3799),
    ("Overstack", "Voltra", "Intel Core i5-13420H", "RTX 4050 6GB", "16 GB", "512 GB NVMe", '15.6" FHD 144Hz', 899),
    ("Scorpion H2", "Aetheris", "Intel Core Ultra 9 185H", "RTX 4070 8GB", "32 GB", "2 TB NVMe", '16" 3.2K 120Hz OLED', 2399),
]

# (model, brand, dpi, weight, connection, buttons, price)
MICE = [
    ("G", "Aurora", "12,000", "58 g", "Wired", 6, 29.99),
    ("Axis", "Viper", "26,000", "49 g", "Wireless 2.4 GHz", 6, 79.99),
    ("Race XQ", "Nebula", "16,000", "72 g", "Wired", 7, 39.99),
    ("Pulse Pro", "Viper", "38,000", "63 g", "Wireless 2.4 GHz / Bluetooth", 8, 299.99),
    ("G", "Velocita", "20,000", "80 g", "Wired", 8, 49.99),
    ("Ultra", "Gaming Mouse", "32,000", "54 g", "Wireless 2.4 GHz", 5, 39.99),
    ("Phantom", "Gaming Mouse", "18,000", "115 g", "Wired", 12, 59.99),
    ("X10", "Nighthawk", "18,000", "60 g", "Wireless 2.4 GHz / Bluetooth", 6, 69.99),
]

# (model, brand, switch, layout, connection, lighting, price)
KEYBOARDS = [
    ("Forge 100", "Voltrix", "Red linear", "Full-size", "Wired", "RGB", 59.99),
    ("Forge TKL", "Voltrix", "Red linear", "TKL", "Wired", "RGB", 69.99),
    ("Strike 75", "Nexora", "Brown tactile", "75%", "Wireless 2.4 GHz / Bluetooth", "RGB", 109.99),
    ("Apex 60", "Apexion", "Optical linear", "60%", "Wired", "Per-key RGB", 89.99),
    ("Citadel Pro", "Kryon", "Hall-effect magnetic", "TKL", "Wired", "Per-key RGB", 169.99),
    ("Zen Silent", "Zenthor", "Silent linear", "65%", "Wireless 2.4 GHz / Bluetooth", "White backlight", 99.99),
    ("Mecha Lite", "Kryon", "Blue clicky", "Full-size", "Wired", "Red backlight", 44.99),
]

# (model, brand, sound, microphone, connection, battery, price)
HEADSETS = [
    ("Exodus Ultimate Pro", "Aurora", "Stereo with active noise cancelling", "Beamforming mics", "Bluetooth / 2.4 GHz", "50 h", 249.99),
    ("Neon X Pro", "Steelseries", "Spatial audio", "Retractable boom", "Wireless 2.4 GHz / Bluetooth", "60 h", 199.99),
    ("Omega", "Raptor", "Virtual 7.1 surround", "Retractable boom", "Wired USB", "N/A (wired)", 79.99),
    ("Cosmo", "Aurora", "Stereo", "Detachable boom", "Wireless 2.4 GHz", "40 h", 129.99),
    ("Echo One", "Steelseries", "Stereo", "Detachable boom", "Wired USB / 3.5 mm", "N/A (wired)", 59.99),
]


def tier(price):
    if price < 900:
        return "entry-level"
    if price < 1500:
        return "mid-range"
    if price < 2400:
        return "high-end"
    return "enthusiast-grade"


class Command(BaseCommand):
    help = "Load sample products into the catalog (safe to run multiple times)."

    def handle(self, *args, **options):
        rng = random.Random(42)
        cats = {
            slug: Category.objects.update_or_create(slug=slug, defaults={"name": name})[0]
            for slug, name in CATEGORIES.items()
        }
        count = 0

        def save(cat, prefix, i, brand, model, price, specs, description):
            nonlocal count
            name = f"{brand} {model}"
            Product.objects.update_or_create(
                slug=slugify(name),
                defaults={
                    "category": cats[cat],
                    "name": name,
                    "brand": brand,
                    "description": description,
                    "price": price,
                    "stock": rng.choice([0, 3, 5, 8, 12, 20, 25]),
                    "image": f"/images/products/{prefix}{i + 1}.jpg",
                    "specs": specs,
                    "featured": i % 6 == 0,
                },
            )
            count += 1

        for i, (model, brand, cpu, gpu, ram, storage, price) in enumerate(DESKTOPS):
            save("desktops", "PC", i, brand, model, price,
                 {"CPU": cpu, "GPU": gpu, "RAM": ram, "Storage": storage},
                 f"A {tier(price)} gaming desktop powered by the {cpu} and {gpu}, "
                 f"with {ram} and {storage} storage. Pre-built, tested and ready to play.")

        for i, (model, brand, cpu, gpu, ram, storage, screen, price) in enumerate(LAPTOPS):
            save("laptops", "Laptop", i, brand, model, price,
                 {"CPU": cpu, "GPU": gpu, "RAM": ram, "Storage": storage, "Display": screen},
                 f"A {tier(price)} gaming laptop with a {screen} display, the {cpu} and {gpu}. "
                 f"Includes {ram} RAM and {storage} storage.")

        for i, (model, brand, dpi, weight, conn, buttons, price) in enumerate(MICE):
            save("mice", "Mouse", i, brand, model, price,
                 {"DPI": dpi, "Weight": weight, "Connection": conn, "Buttons": buttons},
                 f"Gaming mouse with a {dpi} DPI sensor, {buttons} buttons and a {weight} body. "
                 f"Connection: {conn}.")

        for i, (model, brand, switch, layout, conn, light, price) in enumerate(KEYBOARDS):
            save("keyboards", "Keyboard", i, brand, model, price,
                 {"Switch": switch, "Layout": layout, "Connection": conn, "Lighting": light},
                 f"{layout} mechanical keyboard with {switch} switches and {light} lighting. "
                 f"Connection: {conn}.")

        for i, (model, brand, sound, mic, conn, battery, price) in enumerate(HEADSETS):
            save("headsets", "Ears", i, brand, model, price,
                 {"Sound": sound, "Microphone": mic, "Connection": conn, "Battery": battery},
                 f"Gaming headset with {sound.lower()} sound and a {mic.lower()}. "
                 f"Connection: {conn}. Battery: {battery}.")

        self.stdout.write(self.style.SUCCESS(f"Seeded {count} products."))