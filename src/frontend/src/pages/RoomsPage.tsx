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
import {
  BedDouble,
  CheckCircle,
  Droplets,
  Loader2,
  UtensilsCrossed,
  Wifi,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Variant_cancelled_pending_confirmed,
  Variant_dormitory_double_single,
} from "../backend.d";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const todayStr = new Date().toISOString().split("T")[0];

const rooms = [
  {
    type: Variant_dormitory_double_single.single,
    label: "Single Room",
    icon: "🛏️",
    price: 500,
    unit: "per night",
    desc: "Clean, comfortable single-occupancy room ideal for solo pilgrims. Includes attached bathroom.",
    amenities: ["Attached Bathroom", "Wi-Fi", "24/7 Hot Water", "Locker"],
  },
  {
    type: Variant_dormitory_double_single.double_,
    label: "Double Room",
    icon: "🏨",
    price: 800,
    unit: "per night",
    desc: "Spacious double room perfect for couples or family pairs. Modern amenities included.",
    amenities: ["Attached Bathroom", "Wi-Fi", "AC", "Daily Prasad"],
  },
  {
    type: Variant_dormitory_double_single.dormitory,
    label: "Dormitory",
    icon: "🛌",
    price: 150,
    unit: "per person",
    desc: "Affordable dormitory-style accommodation for budget pilgrims. Shared facilities available.",
    amenities: ["Shared Bathroom", "Wi-Fi", "Common Area", "Free Prasad"],
  },
];

const amenityIcons: Record<string, React.ReactNode> = {
  "Wi-Fi": <Wifi size={12} />,
  AC: <Droplets size={12} />,
  "Daily Prasad": <UtensilsCrossed size={12} />,
  "Free Prasad": <UtensilsCrossed size={12} />,
  default: <BedDouble size={12} />,
};

export default function RoomsPage() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const [selectedRoom, setSelectedRoom] = useState<(typeof rooms)[0] | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    checkIn: todayStr,
    checkOut: "",
    persons: "1",
  });

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor || !selectedRoom) return;
    if (!form.checkOut || form.checkOut <= form.checkIn) {
      toast.error("Check-out must be after check-in date.");
      return;
    }
    setLoading(true);
    try {
      const userId = identity ? identity.getPrincipal() : Principal.anonymous();
      await actor.createRoomBooking({
        id: BigInt(0),
        userId,
        name: form.name,
        phone: form.phone,
        checkIn: BigInt(new Date(form.checkIn).getTime()) * BigInt(1_000_000),
        checkOut: BigInt(new Date(form.checkOut).getTime()) * BigInt(1_000_000),
        numberOfPersons: BigInt(Number.parseInt(form.persons) || 1),
        roomType: selectedRoom.type,
        status: Variant_cancelled_pending_confirmed.pending,
      });
      setSuccess(true);
      toast.success("Room booked successfully!");
    } catch {
      toast.error("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedRoom(null);
    setSuccess(false);
    setForm({
      name: "",
      phone: "",
      checkIn: todayStr,
      checkOut: "",
      persons: "1",
    });
  };

  return (
    <main className="min-h-screen bg-temple-cream py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="text-saffron text-4xl mb-2">ॐ</div>
          <h1 className="font-display text-3xl font-bold text-maroon">
            Dharamshala Rooms
          </h1>
          <p className="text-muted-foreground mt-2">
            Comfortable accommodation for pilgrims and devotees
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rooms.map((room, i) => (
            <Card
              key={room.type}
              className="border-gold/20 hover:shadow-temple hover:-translate-y-1 transition-all duration-200 flex flex-col"
              data-ocid={`rooms.item.${i + 1}`}
            >
              <CardHeader>
                <div className="text-4xl mb-2">{room.icon}</div>
                <CardTitle className="text-maroon font-display">
                  {room.label}
                </CardTitle>
                <CardDescription>{room.desc}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-2">
                    Amenities
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {room.amenities.map((a) => (
                      <span
                        key={a}
                        className="flex items-center gap-1 bg-saffron/10 text-saffron text-xs rounded-full px-2 py-1"
                      >
                        {amenityIcons[a] ?? amenityIcons.default} {a}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <div>
                    <span className="text-2xl font-bold text-saffron">
                      ₹{room.price}
                    </span>
                    <span className="text-muted-foreground text-xs ml-1">
                      {room.unit}
                    </span>
                  </div>
                  <Button
                    className="bg-saffron hover:bg-saffron/90 text-white"
                    onClick={() => setSelectedRoom(room)}
                    data-ocid={`rooms.book.button.${i + 1}`}
                  >
                    Book Room
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog
        open={!!selectedRoom}
        onOpenChange={(open) => !open && handleClose()}
      >
        <DialogContent className="sm:max-w-md" data-ocid="rooms.dialog">
          <DialogHeader>
            <DialogTitle className="font-display text-maroon">
              {success ? "Room Booked! 🏠" : `Book ${selectedRoom?.label}`}
            </DialogTitle>
            <DialogDescription>
              {success
                ? "Your room has been reserved."
                : `₹${selectedRoom?.price} ${selectedRoom?.unit}`}
            </DialogDescription>
          </DialogHeader>
          {success ? (
            <div className="text-center py-6">
              <CheckCircle className="text-green-500 mx-auto mb-4" size={48} />
              <p className="text-muted-foreground mb-4">
                We look forward to welcoming you to our dharamshala.
              </p>
              <Button
                className="bg-saffron text-white"
                onClick={handleClose}
                data-ocid="rooms.close.button"
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
                  data-ocid="rooms.name.input"
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
                  data-ocid="rooms.phone.input"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Check-in *</Label>
                  <Input
                    type="date"
                    min={todayStr}
                    value={form.checkIn}
                    onChange={(e) =>
                      setForm({ ...form, checkIn: e.target.value })
                    }
                    required
                    className="mt-1"
                    data-ocid="rooms.checkin.input"
                  />
                </div>
                <div>
                  <Label>Check-out *</Label>
                  <Input
                    type="date"
                    min={form.checkIn || todayStr}
                    value={form.checkOut}
                    onChange={(e) =>
                      setForm({ ...form, checkOut: e.target.value })
                    }
                    required
                    className="mt-1"
                    data-ocid="rooms.checkout.input"
                  />
                </div>
              </div>
              <div>
                <Label>Number of Persons *</Label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={form.persons}
                  onChange={(e) =>
                    setForm({ ...form, persons: e.target.value })
                  }
                  required
                  className="mt-1"
                  data-ocid="rooms.persons.input"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={handleClose}
                  data-ocid="rooms.cancel.button"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-saffron hover:bg-saffron/90 text-white"
                  disabled={loading}
                  data-ocid="rooms.submit.button"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Booking...
                    </>
                  ) : (
                    "Book Room"
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
