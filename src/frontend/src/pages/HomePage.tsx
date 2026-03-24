import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { Clock, Mail, MapPin, Phone, Star } from "lucide-react";
import { motion } from "motion/react";

export default function HomePage() {
  const services = [
    {
      icon: "🕌",
      title: "Book Darshan",
      desc: "Reserve your sacred darshan slot and experience divine blessings.",
      to: "/darshan",
    },
    {
      icon: "🙏",
      title: "Book Seva",
      desc: "Participate in puja, aarti, havan and other holy sevas.",
      to: "/seva",
    },
    {
      icon: "🏠",
      title: "Book Room",
      desc: "Comfortable dharamshala accommodation for pilgrims.",
      to: "/rooms",
    },
    {
      icon: "💝",
      title: "Donate",
      desc: "Contribute to temple activities, annaPrasad and cow protection.",
      to: "/donation",
    },
  ];

  const timings = [
    {
      session: "Morning",
      time: "5:00 AM – 12:00 PM",
      darshan: "5:30 AM – 11:30 AM",
    },
    {
      session: "Afternoon",
      time: "12:00 PM – 4:00 PM",
      darshan: "Closed (Bhog)",
    },
    {
      session: "Evening",
      time: "4:00 PM – 9:00 PM",
      darshan: "4:30 PM – 8:30 PM",
    },
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-temple text-white">
        <div className="absolute inset-0 flex items-center justify-end pr-10 pointer-events-none select-none">
          <span
            className="text-white/5 font-display"
            style={{ fontSize: "20rem", lineHeight: 1 }}
          >
            ॐ
          </span>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="text-gold text-5xl mb-2">ॐ</div>
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-4 leading-tight">
              Shri Ram Mandir
            </h1>
            <p className="text-white/85 text-lg md:text-xl mb-2 font-display italic">
              जय श्री राम • Jai Shri Ram
            </p>
            <p className="text-white/70 mb-8 text-base md:text-lg">
              A sacred abode of Lord Ram — offering divine darshan, seva, and
              spiritual peace to all devotees.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/darshan">
                <Button
                  size="lg"
                  className="bg-gold text-maroon hover:bg-gold/90 font-semibold text-base"
                  data-ocid="hero.book_darshan.button"
                >
                  Book Darshan
                </Button>
              </Link>
              <Link to="/donation">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 bg-transparent text-base"
                  data-ocid="hero.donate.button"
                >
                  Donate Now
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-temple-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-maroon mb-2">
              Our Services
            </h2>
            <div className="w-16 h-1 bg-gold mx-auto rounded" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s, i) => (
              <motion.div
                key={s.to}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                data-ocid={`services.item.${i + 1}`}
              >
                <Link to={s.to}>
                  <Card className="text-center hover:shadow-temple hover:-translate-y-1 transition-all duration-200 border-gold/20 cursor-pointer group">
                    <CardHeader className="pb-2">
                      <div className="text-5xl mb-2">{s.icon}</div>
                      <CardTitle className="text-maroon font-display group-hover:text-saffron transition-colors">
                        {s.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm">{s.desc}</p>
                      <div className="mt-3 text-saffron text-sm font-medium group-hover:underline">
                        Book Now →
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timings */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-maroon mb-2">
              Temple Timings
            </h2>
            <div className="w-16 h-1 bg-saffron mx-auto rounded" />
          </div>
          <div className="overflow-x-auto rounded-lg border border-gold/30 shadow-xs">
            <table className="w-full text-sm">
              <thead className="bg-maroon text-white">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">Session</th>
                  <th className="px-6 py-3 text-left font-semibold">
                    Temple Hours
                  </th>
                  <th className="px-6 py-3 text-left font-semibold">
                    Darshan Hours
                  </th>
                </tr>
              </thead>
              <tbody>
                {timings.map((t, i) => (
                  <tr
                    key={t.session}
                    className={i % 2 === 0 ? "bg-temple-cream" : "bg-white"}
                  >
                    <td className="px-6 py-3 font-semibold text-saffron flex items-center gap-2">
                      <Clock size={14} /> {t.session}
                    </td>
                    <td className="px-6 py-3 text-foreground">{t.time}</td>
                    <td className="px-6 py-3 text-foreground">{t.darshan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-center text-muted-foreground text-xs mt-3">
            * Timings may vary on special occasions and festivals
          </p>
        </div>
      </section>

      {/* About */}
      <section className="py-16 bg-temple-cream">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-display text-3xl font-bold text-maroon mb-4">
                About Shri Ram Mandir
              </h2>
              <div className="w-12 h-1 bg-gold rounded mb-6" />
              <p className="text-foreground/80 mb-4 leading-relaxed">
                Shri Ram Mandir is one of the most revered Hindu temples
                dedicated to Lord Ram, the seventh avatar of Vishnu. Built in
                the traditional Nagara architectural style, the temple stands as
                a beacon of faith, devotion, and cultural heritage.
              </p>
              <p className="text-foreground/80 mb-6 leading-relaxed">
                The temple offers daily puja, aarti, bhajan, and various
                spiritual programs that attract thousands of devotees from
                across the country. Our Anna Prasad initiative serves free meals
                to pilgrims every day.
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-gold/10 rounded-full px-4 py-2 text-sm">
                  <Star size={14} className="text-gold" /> Est. 1892
                </div>
                <div className="flex items-center gap-2 bg-saffron/10 rounded-full px-4 py-2 text-sm">
                  <Star size={14} className="text-saffron" /> 500+ Daily
                  Devotees
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-maroon to-saffron rounded-2xl p-10 text-center text-white">
                <div className="text-8xl font-display mb-4">ॐ</div>
                <p className="font-display text-xl italic">
                  सियाराम मय सब जग जानी
                </p>
                <p className="text-white/70 text-sm mt-2">— Ramcharitmanas</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-maroon text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-display text-gold text-xl font-bold mb-3">
                ॐ Shri Ram Mandir
              </h3>
              <p className="text-white/60 text-sm">
                A place of peace, devotion and divine blessings for all seekers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gold mb-3">Quick Links</h4>
              <div className="space-y-1">
                {[
                  ["Darshan", "/darshan"],
                  ["Seva", "/seva"],
                  ["Rooms", "/rooms"],
                  ["Donation", "/donation"],
                ].map(([l, h]) => (
                  <div key={h}>
                    <Link
                      to={h}
                      className="text-white/60 hover:text-gold text-sm"
                    >
                      {l}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gold mb-3">Contact</h4>
              <div className="space-y-2 text-white/60 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin size={14} /> Ayodhya, Uttar Pradesh, India
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={14} /> +91 98765 43210
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={14} /> info@shrirammandir.org
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 text-center text-white/40 text-xs">
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              className="hover:text-gold underline"
              target="_blank"
              rel="noreferrer"
            >
              caffeine.ai
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
