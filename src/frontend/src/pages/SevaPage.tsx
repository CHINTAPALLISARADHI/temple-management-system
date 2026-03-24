import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Principal } from "@icp-sdk/core/principal";
import { CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Variant_aarti_havan_puja_archana_abhishek,
  Variant_cancelled_pending_confirmed,
} from "../backend.d";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const todayStr = new Date().toISOString().split("T")[0];

const sevaItems = [
  {
    type: Variant_aarti_havan_puja_archana_abhishek.abhishek,
    label: "Abhishek",
    icon: "🪔",
    price: 501,
    desc: "Sacred bathing of the deity with holy water, milk, and other offerings. A deeply purifying ritual.",
  },
  {
    type: Variant_aarti_havan_puja_archana_abhishek.aarti,
    label: "Aarti",
    icon: "🔔",
    price: 251,
    desc: "Traditional lamp offering ceremony accompanied by devotional songs and chanting of mantras.",
  },
  {
    type: Variant_aarti_havan_puja_archana_abhishek.puja,
    label: "Puja",
    icon: "🌸",
    price: 1001,
    desc: "Complete worship ceremony with flowers, incense, lamps and special offerings to the deity.",
  },
  {
    type: Variant_aarti_havan_puja_archana_abhishek.havan,
    label: "Havan",
    icon: "🔥",
    price: 5001,
    desc: "Sacred fire ritual performed by priests with specific mantras for prosperity and peace.",
  },
  {
    type: Variant_aarti_havan_puja_archana_abhishek.archana,
    label: "Archana",
    icon: "🙏",
    price: 151,
    desc: "Recitation of 108 names of the deity with flower offerings for divine blessings.",
  },
];

export default function SevaPage() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const [selectedSeva, setSelectedSeva] = useState<
    (typeof sevaItems)[0] | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", date: todayStr });

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor || !selectedSeva) return;
    setLoading(true);
    try {
      const userId = identity ? identity.getPrincipal() : Principal.anonymous();
      await actor.createSevaBooking({
        id: BigInt(0),
        userId,
        name: form.name,
        phone: form.phone,
        date: BigInt(new Date(form.date).getTime()) * BigInt(1_000_000),
        sevaType: selectedSeva.type,
        amount: selectedSeva.price,
        status: Variant_cancelled_pending_confirmed.pending,
      });
      setSuccess(true);
      toast.success(`${selectedSeva.label} seva booked!`);
    } catch {
      toast.error("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedSeva(null);
    setSuccess(false);
    setForm({ name: "", phone: "", date: todayStr });
  };

  return (
    <main className="min-h-screen bg-temple-cream py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="text-saffron text-4xl mb-2">ॐ</div>
          <h1 className="font-display text-3xl font-bold text-maroon">
            Book Seva
          </h1>
          <p className="text-muted-foreground mt-2">
            Choose a seva and be part of divine worship
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sevaItems.map((seva, i) => (
            <Card
              key={seva.type}
              className="border-gold/20 hover:shadow-temple hover:-translate-y-1 transition-all duration-200"
              data-ocid={`seva.item.${i + 1}`}
            >
              <CardHeader>
                <div className="text-4xl mb-2">{seva.icon}</div>
                <CardTitle className="text-maroon font-display">
                  {seva.label}
                </CardTitle>
                <CardDescription>{seva.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-saffron">
                    ₹{seva.price.toLocaleString("en-IN")}
                  </span>
                  <Button
                    className="bg-saffron hover:bg-saffron/90 text-white"
                    onClick={() => setSelectedSeva(seva)}
                    data-ocid={`seva.book.button.${i + 1}`}
                  >
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog
        open={!!selectedSeva}
        onOpenChange={(open) => !open && handleClose()}
      >
        <DialogContent className="sm:max-w-md" data-ocid="seva.dialog">
          <DialogHeader>
            <DialogTitle className="font-display text-maroon">
              {success
                ? "Booking Confirmed! 🙏"
                : `Book ${selectedSeva?.label}`}
            </DialogTitle>
            <DialogDescription>
              {success
                ? "Your seva has been booked successfully."
                : `₹${selectedSeva?.price?.toLocaleString("en-IN")} – Fill in your details`}
            </DialogDescription>
          </DialogHeader>
          {success ? (
            <div className="text-center py-6">
              <CheckCircle className="text-green-500 mx-auto mb-4" size={48} />
              <p className="text-muted-foreground mb-4">
                May Lord Ram bless you and your family.
              </p>
              <Button
                className="bg-saffron text-white"
                onClick={handleClose}
                data-ocid="seva.close.button"
              >
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handleBook} className="space-y-4">
              <div>
                <Label>Full Name *</Label>
                <Input
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="mt-1"
                  data-ocid="seva.name.input"
                />
              </div>
              <div>
                <Label>Phone *</Label>
                <Input
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                  className="mt-1"
                  data-ocid="seva.phone.input"
                />
              </div>
              <div>
                <Label>Date *</Label>
                <Input
                  type="date"
                  min={todayStr}
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                  className="mt-1"
                  data-ocid="seva.date.input"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={handleClose}
                  data-ocid="seva.cancel.button"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-saffron hover:bg-saffron/90 text-white"
                  disabled={loading}
                  data-ocid="seva.submit.button"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Booking...
                    </>
                  ) : (
                    "Confirm Booking"
                  )}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
