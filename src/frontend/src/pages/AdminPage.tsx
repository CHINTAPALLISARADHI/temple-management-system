import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  CalendarDays,
  Heart,
  Loader2,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  type DarshanBooking,
  type Donation,
  type RoomBooking,
  type SevaBooking,
  type User,
  Variant_cancelled_pending_confirmed,
} from "../backend.d";
import { useActor } from "../hooks/useActor";

const STATUS_COLORS: Record<string, string> = {
  [Variant_cancelled_pending_confirmed.pending]:
    "bg-yellow-100 text-yellow-800",
  [Variant_cancelled_pending_confirmed.confirmed]:
    "bg-green-100 text-green-800",
  [Variant_cancelled_pending_confirmed.cancelled]: "bg-red-100 text-red-800",
};

function formatDate(ns: bigint) {
  return new Date(Number(ns) / 1_000_000).toLocaleDateString("en-IN");
}

export default function AdminPage() {
  const { actor } = useActor();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [darshanBookings, setDarshanBookings] = useState<DarshanBooking[]>([]);
  const [sevaBookings, setSevaBookings] = useState<SevaBooking[]>([]);
  const [roomBookings, setRoomBookings] = useState<RoomBooking[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!actor) return;
    actor
      .isCallerAdmin()
      .then((isAdmin) => {
        if (!isAdmin) {
          toast.error("Access denied. Admin only.");
          navigate({ to: "/login" });
          return;
        }
        setChecking(false);
        Promise.all([
          actor.getAllActiveDarshanBookings(),
          actor.getAllActiveSevaBookings(),
          actor.getAllActiveRoomBookings(),
          actor.getAllActiveDonations(),
          actor.getAllUsers(),
        ])
          .then(([d, s, r, don, u]) => {
            setDarshanBookings(d);
            setSevaBookings(s);
            setRoomBookings(r);
            setDonations(don);
            setUsers(u);
          })
          .catch(() => toast.error("Failed to load data."));
      })
      .catch(() => {
        navigate({ to: "/login" });
      });
  }, [actor, navigate]);

  const updateDarshanStatus = async (
    id: bigint,
    status: Variant_cancelled_pending_confirmed,
  ) => {
    if (!actor) return;
    try {
      await actor.updateDarshanBookingStatus(id, status);
      setDarshanBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b)),
      );
      toast.success("Status updated.");
    } catch {
      toast.error("Failed to update.");
    }
  };

  const updateSevaStatus = async (
    id: bigint,
    status: Variant_cancelled_pending_confirmed,
  ) => {
    if (!actor) return;
    try {
      await actor.updateSevaBookingStatus(id, status);
      setSevaBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b)),
      );
      toast.success("Status updated.");
    } catch {
      toast.error("Failed to update.");
    }
  };

  const updateRoomStatus = async (
    id: bigint,
    status: Variant_cancelled_pending_confirmed,
  ) => {
    if (!actor) return;
    try {
      await actor.updateRoomBookingStatus(id, status);
      setRoomBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b)),
      );
      toast.success("Status updated.");
    } catch {
      toast.error("Failed to update.");
    }
  };

  if (checking) {
    return (
      <main
        className="min-h-screen bg-temple-cream flex items-center justify-center"
        data-ocid="admin.loading_state"
      >
        <div className="text-center">
          <Loader2
            className="text-saffron animate-spin mx-auto mb-3"
            size={40}
          />
          <p className="text-muted-foreground">Checking admin access...</p>
        </div>
      </main>
    );
  }

  const stats = [
    {
      label: "Darshan Bookings",
      value: darshanBookings.length,
      icon: <CalendarDays size={24} />,
      color: "text-saffron",
    },
    {
      label: "Seva Bookings",
      value: sevaBookings.length,
      icon: <BookOpen size={24} />,
      color: "text-gold",
    },
    {
      label: "Room Bookings",
      value: roomBookings.length,
      icon: <ShieldCheck size={24} />,
      color: "text-maroon",
    },
    {
      label: "Donations",
      value: donations.length,
      icon: <Heart size={24} />,
      color: "text-saffron",
    },
  ];

  return (
    <main className="min-h-screen bg-temple-cream py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center gap-3">
          <ShieldCheck className="text-saffron" size={32} />
          <div>
            <h1 className="font-display text-3xl font-bold text-maroon">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground text-sm">
              ॐ Shri Ram Mandir — Temple Management
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <Card
              key={s.label}
              className="border-gold/20"
              data-ocid={`admin.stats.item.${i + 1}`}
            >
              <CardContent className="pt-5 pb-4">
                <div className={`${s.color} mb-2`}>{s.icon}</div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-muted-foreground text-xs">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="darshan">
          <TabsList className="mb-4 bg-white border border-gold/20">
            <TabsTrigger value="darshan" data-ocid="admin.darshan.tab">
              Darshan
            </TabsTrigger>
            <TabsTrigger value="seva" data-ocid="admin.seva.tab">
              Seva
            </TabsTrigger>
            <TabsTrigger value="rooms" data-ocid="admin.rooms.tab">
              Rooms
            </TabsTrigger>
            <TabsTrigger value="donations" data-ocid="admin.donations.tab">
              Donations
            </TabsTrigger>
            <TabsTrigger value="users" data-ocid="admin.users.tab">
              Users
            </TabsTrigger>
          </TabsList>

          {/* Darshan */}
          <TabsContent value="darshan">
            <Card className="border-gold/20">
              <CardHeader>
                <CardTitle className="font-display text-maroon text-lg">
                  Darshan Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {darshanBookings.length === 0 ? (
                  <div
                    className="text-center py-8 text-muted-foreground"
                    data-ocid="admin.darshan.empty_state"
                  >
                    No bookings yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table data-ocid="admin.darshan.table">
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Slot</TableHead>
                          <TableHead>Persons</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {darshanBookings.map((b, i) => (
                          <TableRow
                            key={b.id.toString()}
                            data-ocid={`admin.darshan.row.${i + 1}`}
                          >
                            <TableCell className="font-mono text-xs">
                              {b.id.toString()}
                            </TableCell>
                            <TableCell>{b.name}</TableCell>
                            <TableCell>{b.phone}</TableCell>
                            <TableCell>{formatDate(b.date)}</TableCell>
                            <TableCell className="capitalize">
                              {b.timeSlot}
                            </TableCell>
                            <TableCell>
                              {b.numberOfPersons.toString()}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={`${STATUS_COLORS[b.status]} text-xs`}
                              >
                                {b.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Select
                                value={b.status}
                                onValueChange={(v) =>
                                  updateDarshanStatus(
                                    b.id,
                                    v as Variant_cancelled_pending_confirmed,
                                  )
                                }
                              >
                                <SelectTrigger
                                  className="w-32 h-7 text-xs"
                                  data-ocid={`admin.darshan.status.select.${i + 1}`}
                                >
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem
                                    value={
                                      Variant_cancelled_pending_confirmed.pending
                                    }
                                  >
                                    Pending
                                  </SelectItem>
                                  <SelectItem
                                    value={
                                      Variant_cancelled_pending_confirmed.confirmed
                                    }
                                  >
                                    Confirmed
                                  </SelectItem>
                                  <SelectItem
                                    value={
                                      Variant_cancelled_pending_confirmed.cancelled
                                    }
                                  >
                                    Cancelled
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Seva */}
          <TabsContent value="seva">
            <Card className="border-gold/20">
              <CardHeader>
                <CardTitle className="font-display text-maroon text-lg">
                  Seva Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {sevaBookings.length === 0 ? (
                  <div
                    className="text-center py-8 text-muted-foreground"
                    data-ocid="admin.seva.empty_state"
                  >
                    No seva bookings yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table data-ocid="admin.seva.table">
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Seva</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sevaBookings.map((b, i) => (
                          <TableRow
                            key={b.id.toString()}
                            data-ocid={`admin.seva.row.${i + 1}`}
                          >
                            <TableCell className="font-mono text-xs">
                              {b.id.toString()}
                            </TableCell>
                            <TableCell>{b.name}</TableCell>
                            <TableCell>{b.phone}</TableCell>
                            <TableCell>{formatDate(b.date)}</TableCell>
                            <TableCell className="capitalize">
                              {b.sevaType}
                            </TableCell>
                            <TableCell>₹{b.amount}</TableCell>
                            <TableCell>
                              <Badge
                                className={`${STATUS_COLORS[b.status]} text-xs`}
                              >
                                {b.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Select
                                value={b.status}
                                onValueChange={(v) =>
                                  updateSevaStatus(
                                    b.id,
                                    v as Variant_cancelled_pending_confirmed,
                                  )
                                }
                              >
                                <SelectTrigger
                                  className="w-32 h-7 text-xs"
                                  data-ocid={`admin.seva.status.select.${i + 1}`}
                                >
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem
                                    value={
                                      Variant_cancelled_pending_confirmed.pending
                                    }
                                  >
                                    Pending
                                  </SelectItem>
                                  <SelectItem
                                    value={
                                      Variant_cancelled_pending_confirmed.confirmed
                                    }
                                  >
                                    Confirmed
                                  </SelectItem>
                                  <SelectItem
                                    value={
                                      Variant_cancelled_pending_confirmed.cancelled
                                    }
                                  >
                                    Cancelled
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rooms */}
          <TabsContent value="rooms">
            <Card className="border-gold/20">
              <CardHeader>
                <CardTitle className="font-display text-maroon text-lg">
                  Room Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {roomBookings.length === 0 ? (
                  <div
                    className="text-center py-8 text-muted-foreground"
                    data-ocid="admin.rooms.empty_state"
                  >
                    No room bookings yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table data-ocid="admin.rooms.table">
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Check-In</TableHead>
                          <TableHead>Check-Out</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Persons</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {roomBookings.map((b, i) => (
                          <TableRow
                            key={b.id.toString()}
                            data-ocid={`admin.rooms.row.${i + 1}`}
                          >
                            <TableCell className="font-mono text-xs">
                              {b.id.toString()}
                            </TableCell>
                            <TableCell>{b.name}</TableCell>
                            <TableCell>{b.phone}</TableCell>
                            <TableCell>{formatDate(b.checkIn)}</TableCell>
                            <TableCell>{formatDate(b.checkOut)}</TableCell>
                            <TableCell className="capitalize">
                              {b.roomType}
                            </TableCell>
                            <TableCell>
                              {b.numberOfPersons.toString()}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={`${STATUS_COLORS[b.status]} text-xs`}
                              >
                                {b.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Select
                                value={b.status}
                                onValueChange={(v) =>
                                  updateRoomStatus(
                                    b.id,
                                    v as Variant_cancelled_pending_confirmed,
                                  )
                                }
                              >
                                <SelectTrigger
                                  className="w-32 h-7 text-xs"
                                  data-ocid={`admin.rooms.status.select.${i + 1}`}
                                >
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem
                                    value={
                                      Variant_cancelled_pending_confirmed.pending
                                    }
                                  >
                                    Pending
                                  </SelectItem>
                                  <SelectItem
                                    value={
                                      Variant_cancelled_pending_confirmed.confirmed
                                    }
                                  >
                                    Confirmed
                                  </SelectItem>
                                  <SelectItem
                                    value={
                                      Variant_cancelled_pending_confirmed.cancelled
                                    }
                                  >
                                    Cancelled
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Donations */}
          <TabsContent value="donations">
            <Card className="border-gold/20">
              <CardHeader>
                <CardTitle className="font-display text-maroon text-lg">
                  Donations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {donations.length === 0 ? (
                  <div
                    className="text-center py-8 text-muted-foreground"
                    data-ocid="admin.donations.empty_state"
                  >
                    No donations yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table data-ocid="admin.donations.table">
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Purpose</TableHead>
                          <TableHead>Payment</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {donations.map((d, i) => (
                          <TableRow
                            key={d.id.toString()}
                            data-ocid={`admin.donations.row.${i + 1}`}
                          >
                            <TableCell className="font-mono text-xs">
                              {d.id.toString()}
                            </TableCell>
                            <TableCell>{d.name}</TableCell>
                            <TableCell>{d.phone}</TableCell>
                            <TableCell>{d.email}</TableCell>
                            <TableCell className="font-semibold text-saffron">
                              ₹{d.amount}
                            </TableCell>
                            <TableCell className="capitalize text-xs">
                              {d.purpose}
                            </TableCell>
                            <TableCell className="capitalize">
                              {d.paymentMode}
                            </TableCell>
                            <TableCell>{formatDate(d.date)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users */}
          <TabsContent value="users">
            <Card className="border-gold/20">
              <CardHeader>
                <CardTitle className="font-display text-maroon text-lg flex items-center gap-2">
                  <Users size={18} /> Registered Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                {users.length === 0 ? (
                  <div
                    className="text-center py-8 text-muted-foreground"
                    data-ocid="admin.users.empty_state"
                  >
                    No users registered yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table data-ocid="admin.users.table">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Principal</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((u, i) => (
                          <TableRow
                            key={u.id.toText()}
                            data-ocid={`admin.users.row.${i + 1}`}
                          >
                            <TableCell className="font-mono text-xs">
                              {u.id.toText().slice(0, 15)}...
                            </TableCell>
                            <TableCell>{u.name}</TableCell>
                            <TableCell>{u.email}</TableCell>
                            <TableCell>{u.phone}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
