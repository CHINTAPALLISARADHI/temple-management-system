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
import { CheckCircle, Heart, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Variant_cash_online,
  Variant_education_templeConstruction_annaPrasad_general_cowProtection,
} from "../backend.d";
import { useActor } from "../hooks/useActor";

const QUICK_AMOUNTS = [101, 501, 1001, 5001];

export default function DonationPage() {
  const { actor } = useActor();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(501);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    purpose:
      Variant_education_templeConstruction_annaPrasad_general_cowProtection.general,
    paymentMode: Variant_cash_online.online,
    transactionId: "",
  });

  const finalAmount = customAmount
    ? Number.parseInt(customAmount)
    : (selectedAmount ?? 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) {
      toast.error("Please wait, connecting...");
      return;
    }
    if (finalAmount <= 0) {
      toast.error("Please select or enter an amount.");
      return;
    }
    setLoading(true);
    try {
      await actor.addDonation({
        id: BigInt(0),
        name: form.name,
        phone: form.phone,
        email: form.email,
        amount: finalAmount,
        purpose: form.purpose,
        paymentMode: form.paymentMode,
        transactionId:
          form.paymentMode === Variant_cash_online.online
            ? form.transactionId
            : undefined,
        date: BigInt(Date.now()) * BigInt(1_000_000),
      });
      setSuccess(true);
      toast.success("Donation recorded! Thank you for your generosity.");
    } catch {
      toast.error("Failed to submit donation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen bg-temple-cream py-12 px-4">
        <div className="max-w-md mx-auto" data-ocid="donation.success_state">
          <Card className="text-center border-gold/30 shadow-temple">
            <CardContent className="pt-12 pb-10">
              <div className="relative inline-block mb-6">
                <Heart className="text-saffron" size={64} fill="currentColor" />
                <CheckCircle
                  className="text-green-500 absolute -bottom-1 -right-1 bg-white rounded-full"
                  size={24}
                />
              </div>
              <h2 className="font-display text-3xl font-bold text-maroon mb-3">
                Thank You! 🙏
              </h2>
              <p className="text-muted-foreground mb-6">
                Your donation of{" "}
                <span className="font-bold text-saffron">
                  ₹{finalAmount.toLocaleString("en-IN")}
                </span>{" "}
                has been received. May Lord Ram bless you and your family with
                peace and prosperity.
              </p>
              <div className="text-gold text-5xl mb-6 font-display">ॐ</div>
              <Button
                className="bg-saffron text-white"
                onClick={() => {
                  setSuccess(false);
                  setCustomAmount("");
                  setSelectedAmount(501);
                  setForm({
                    name: "",
                    phone: "",
                    email: "",
                    purpose:
                      Variant_education_templeConstruction_annaPrasad_general_cowProtection.general,
                    paymentMode: Variant_cash_online.online,
                    transactionId: "",
                  });
                }}
                data-ocid="donation.donate_again.button"
              >
                Donate Again
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
          <div className="text-saffron text-4xl mb-2">💝</div>
          <h1 className="font-display text-3xl font-bold text-maroon">
            Make a Donation
          </h1>
          <p className="text-muted-foreground mt-2">
            Your generosity helps us serve the community and maintain the temple
          </p>
        </div>

        <Card className="border-gold/30 shadow-temple">
          <CardHeader className="bg-gradient-to-r from-maroon to-saffron rounded-t-lg">
            <CardTitle className="text-white font-display flex items-center gap-2">
              <Heart size={18} fill="currentColor" /> Donation Form
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Quick amounts */}
              <div>
                <Label className="mb-2 block">Select Amount</Label>
                <div className="grid grid-cols-4 gap-2">
                  {QUICK_AMOUNTS.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(amt);
                        setCustomAmount("");
                      }}
                      className={`py-2 rounded-lg border-2 text-sm font-semibold transition-all ${
                        selectedAmount === amt && !customAmount
                          ? "border-saffron bg-saffron text-white"
                          : "border-gold/30 hover:border-saffron text-foreground"
                      }`}
                      data-ocid="donation.amount.button"
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
                <div className="mt-3">
                  <Input
                    type="number"
                    min="1"
                    placeholder="Enter custom amount"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount(null);
                    }}
                    className="mt-1"
                    data-ocid="donation.custom_amount.input"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="dname">Full Name *</Label>
                <Input
                  id="dname"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="mt-1"
                  data-ocid="donation.name.input"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dphone">Phone</Label>
                  <Input
                    id="dphone"
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    className="mt-1"
                    data-ocid="donation.phone.input"
                  />
                </div>
                <div>
                  <Label htmlFor="demail">Email</Label>
                  <Input
                    id="demail"
                    type="email"
                    placeholder="email@example.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="mt-1"
                    data-ocid="donation.email.input"
                  />
                </div>
              </div>
              <div>
                <Label>Purpose *</Label>
                <Select
                  value={form.purpose}
                  onValueChange={(v) =>
                    setForm({ ...form, purpose: v as typeof form.purpose })
                  }
                >
                  <SelectTrigger
                    className="mt-1"
                    data-ocid="donation.purpose.select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value={
                        Variant_education_templeConstruction_annaPrasad_general_cowProtection.general
                      }
                    >
                      General
                    </SelectItem>
                    <SelectItem
                      value={
                        Variant_education_templeConstruction_annaPrasad_general_cowProtection.education
                      }
                    >
                      Education
                    </SelectItem>
                    <SelectItem
                      value={
                        Variant_education_templeConstruction_annaPrasad_general_cowProtection.templeConstruction
                      }
                    >
                      Temple Construction
                    </SelectItem>
                    <SelectItem
                      value={
                        Variant_education_templeConstruction_annaPrasad_general_cowProtection.annaPrasad
                      }
                    >
                      Anna Prasad
                    </SelectItem>
                    <SelectItem
                      value={
                        Variant_education_templeConstruction_annaPrasad_general_cowProtection.cowProtection
                      }
                    >
                      Cow Protection
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Payment Mode *</Label>
                <Select
                  value={form.paymentMode}
                  onValueChange={(v) =>
                    setForm({ ...form, paymentMode: v as Variant_cash_online })
                  }
                >
                  <SelectTrigger
                    className="mt-1"
                    data-ocid="donation.payment_mode.select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Variant_cash_online.online}>
                      Online
                    </SelectItem>
                    <SelectItem value={Variant_cash_online.cash}>
                      Cash
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {form.paymentMode === Variant_cash_online.online && (
                <div>
                  <Label htmlFor="txn">Transaction ID *</Label>
                  <Input
                    id="txn"
                    placeholder="UTR / Transaction ID"
                    value={form.transactionId}
                    onChange={(e) =>
                      setForm({ ...form, transactionId: e.target.value })
                    }
                    required
                    className="mt-1"
                    data-ocid="donation.transaction_id.input"
                  />
                </div>
              )}
              <Button
                type="submit"
                className="w-full bg-saffron hover:bg-saffron/90 text-white font-semibold"
                disabled={loading}
                data-ocid="donation.submit.button"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Processing...
                  </>
                ) : (
                  `Donate ₹${finalAmount > 0 ? finalAmount.toLocaleString("en-IN") : "--"}`
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
