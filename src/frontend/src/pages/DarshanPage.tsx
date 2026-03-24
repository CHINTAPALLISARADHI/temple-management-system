import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Principal } from "@icp-sdk/core/principal";
import { CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Variant_cancelled_pending_confirmed,
  Variant_morning_evening_afternoon,
} from "../backend.d";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const todayStr = new Date().toISOString().split("T")[0];

export default function DarshanPage() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const [loading, setLoading] = useState(false);
  const [bookingId, setBookingId] = useState<bigint | null>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: todayStr,
    timeSlot: Variant_morning_evening_afternoon.morning,
    numberOfPersons: "1",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) {
      toast.error("Please wait, connecting...");
      return;
    }
    setLoading(true);
    try {
      const userId = identity ? identity.getPrincipal() : Principal.anonymous();
      const id = await actor.createDarshanBooking({
        id: BigInt(0),
        userId,
        name: form.name,
        phone: form.phone,
        date: BigInt(new Date(form.date).getTime()) * BigInt(1_000_000),
        timeSlot: form.timeSlot,
        numberOfPersons: BigInt(Number.parseInt(form.numberOfPersons) || 1),
        status: Variant_cancelled_pending_confirmed.pending,
      });
      setBookingId(id);
      toast.success("Darshan booked successfully!");
    } catch {
      toast.error("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (bookingId !== null) {
    return (
      <main className="min-h-screen bg-temple-cream py-12 px-4">
        <div className="max-w-md mx-auto" data-ocid="darshan.success_state">
          <Card className="border-gold/30 shadow-temple text-center">
            <CardContent className="pt-10 pb-8">
              <CheckCircle className="text-green-500 mx-auto mb-4" size={56} />
              <h2 className="font-display text-2xl font-bold text-maroon mb-2">
                Booking Confirmed!
              </h2>
              <p className="text-muted-foreground mb-4">
                Your darshan has been booked successfully.
              </p>
              <div className="bg-saffron/10 rounded-lg p-4 mb-6">
                <p className="text-sm text-muted-foreground">Booking ID</p>
                <p className="text-2xl font-bold text-saffron">
                  #{bookingId.toString()}
                </p>
              </div>
              <Button
                className="bg-saffron hover:bg-saffron/90 text-white"
                onClick={() => setBookingId(null)}
                data-ocid="darshan.book_again.button"
              >
                Book Another
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-temple-cream py-12 px-4">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-saffron text-4xl mb-2">ॐ</div>
          <h1 className="font-display text-3xl font-bold text-maroon">
            Book Darshan
          </h1>
          <p className="text-muted-foreground mt-2">
            Reserve your slot for a blessed darshan at Shri Ram Mandir
          </p>
        </div>
        <Card className="border-gold/30 shadow-temple">
          <CardHeader className="bg-gradient-to-r from-maroon to-saffron rounded-t-lg">
            <CardTitle className="text-white font-display">
              Darshan Booking Form
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="mt-1"
                  data-ocid="darshan.name.input"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                  className="mt-1"
                  data-ocid="darshan.phone.input"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    min={todayStr}
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    required
                    className="mt-1"
                    data-ocid="darshan.date.input"
                  />
                </div>
                <div>
                  <Label>Time Slot *</Label>
                  <Select
                    value={form.timeSlot}
                    onValueChange={(v) =>
                      setForm({
                        ...form,
                        timeSlot: v as Variant_morning_evening_afternoon,
                      })
                    }
                  >
                    <SelectTrigger
                      className="mt-1"
                      data-ocid="darshan.timeslot.select"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        value={Variant_morning_evening_afternoon.morning}
                      >
                        Morning
                      </SelectItem>
                      <SelectItem
                        value={Variant_morning_evening_afternoon.afternoon}
                      >
                        Afternoon
                      </SelectItem>
                      <SelectItem
                        value={Variant_morning_evening_afternoon.evening}
                      >
                        Evening
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="persons">Number of Persons *</Label>
                <Input
                  id="persons"
                  type="number"
                  min="1"
                  max="50"
                  value={form.numberOfPersons}
                  onChange={(e) =>
                    setForm({ ...form, numberOfPersons: e.target.value })
                  }
                  required
                  className="mt-1"
                  data-ocid="darshan.persons.input"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-saffron hover:bg-saffron/90 text-white font-semibold"
                disabled={loading}
                data-ocid="darshan.submit.button"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Booking...
                  </>
                ) : (
                  "Book Darshan"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
