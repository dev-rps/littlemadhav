"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ChevronRight,
  ShoppingBag,
  ExternalLink,
  RotateCcw,
  Sparkles,
  AlertCircle,
  User as UserIcon,
  LogOut,
  MapPin,
  Calendar,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useUserStore } from "@/lib/userStore";
import { useCartStore } from "@/lib/store";

interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  variant?: string;
  imageUrl?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  awbCode?: string;
  courierName?: string;
  trackingUrl?: string;
  createdAt: string;
  items: OrderItem[];
}

export default function MyOrdersPage() {
  const router = useRouter();
  const { user, isLoading, logout, checkAuth } = useUserStore();
  const addItemToCart = useCartStore((s) => s.addItem);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    checkAuth().then((currentUser) => {
      if (!currentUser) {
        setLoadingOrders(false);
        return;
      }
      fetchMyOrders();
    });
  }, [checkAuth]);

  const fetchMyOrders = async () => {
    setLoadingOrders(true);
    setError("");
    try {
      const res = await fetch("/api/orders?myOrders=true");
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/login?redirect=/my-orders");
          return;
        }
        throw new Error("Failed to fetch orders");
      }
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err: any) {
      console.error(err);
      setError("Could not load orders. Please try refreshing.");
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleReorder = (item: OrderItem) => {
    addItemToCart({
      productId: item.productId,
      name: item.name,
      price: item.price,
      mrp: Math.round(item.price * 1.3),
      quantity: 1,
      variant: item.variant,
      imageUrl: item.imageUrl || "/images/placeholder.jpg",
      slug: item.productId,
    });
    toast.success(`Added ${item.name} to cart!`);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 size={14} /> Delivered
          </span>
        );
      case "shipped":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <Truck size={14} /> Shipped
          </span>
        );
      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock size={14} /> Confirmed
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 border border-orange-200">
            <Package size={14} /> Placed
          </span>
        );
    }
  };

  if (isLoading || loadingOrders) {
    return (
      <>
        <Header />
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-[#8B1E3F] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-gray-500">Loading your orders...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Header />
        <div className="min-h-[65vh] flex items-center justify-center px-4 py-12 bg-[#FFF8F0]">
          <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-amber-100 text-center">
            <div className="w-16 h-16 bg-amber-100 text-[#8B1E3F] rounded-full flex items-center justify-center mx-auto mb-4">
              <UserIcon size={32} />
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#8B1E3F] mb-2">Sign In Required</h2>
            <p className="text-gray-600 text-sm mb-6">
              Please sign in to view your past orders, delivery details, and saved wishlist.
            </p>
            <div className="space-y-3">
              <Link
                href="/login?redirect=/my-orders"
                className="block w-full py-3.5 bg-[#8B1E3F] text-white font-semibold rounded-xl hover:bg-[#6B1630] transition-colors text-sm shadow-md"
              >
                Sign In / Register
              </Link>
              <Link
                href="/track-order"
                className="block w-full py-3 bg-amber-50 text-amber-900 font-semibold rounded-xl hover:bg-amber-100 transition-colors text-sm border border-amber-200"
              >
                Track Guest Order with Order #
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-[#FFF8F0] via-orange-50/20 to-[#FFF8F0] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header Banner */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-amber-100/80 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#8B1E3F] text-white flex items-center justify-center font-serif text-2xl font-bold shadow-md">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div>
                <h1 className="text-2xl font-serif font-bold text-gray-900">
                  Hello, {user.name || "Devotee"} 👋
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
              <div className="px-4 py-2 bg-amber-50 rounded-xl border border-amber-100 text-center">
                <span className="block text-xs text-amber-700 font-medium">Total Orders</span>
                <span className="text-lg font-bold text-[#8B1E3F]">{orders.length}</span>
              </div>
              <button
                onClick={() => {
                  logout();
                  router.push("/");
                  toast.success("Logged out successfully");
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-600 hover:text-red-600 hover:bg-red-50 border border-gray-200 transition-colors flex items-center gap-1.5"
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          </div>

          {/* Section Title */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Package size={22} className="text-[#8B1E3F]" />
              <h2 className="text-xl font-serif font-bold text-gray-900">My Orders History</h2>
            </div>
            <button
              onClick={fetchMyOrders}
              className="text-xs text-[#8B1E3F] hover:underline font-semibold flex items-center gap-1"
            >
              <RotateCcw size={13} /> Refresh
            </button>
          </div>

          {/* Error notice */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Orders List */}
          {orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-12 text-center border border-amber-100 shadow-sm"
            >
              <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#8B1E3F]">
                <ShoppingBag size={36} />
              </div>
              <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">No Orders Placed Yet</h3>
              <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
                You haven't placed any orders with this account yet. Explore our divine Laddu Gopal dresses and festive decor items!
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#8B1E3F] text-white font-semibold text-sm rounded-xl hover:bg-[#6B1630] transition-colors shadow-md"
              >
                <span>Explore Shop</span>
                <ChevronRight size={16} />
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl border border-amber-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Order Header Bar */}
                  <div className="bg-amber-50/60 p-4 sm:p-6 border-b border-amber-100 flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-bold text-[#8B1E3F]">
                          {order.orderNumber}
                        </span>
                        {getStatusBadge(order.status)}
                        <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold ${
                          order.paymentStatus === "paid"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}>
                          {order.paymentStatus === "paid" ? "Paid Online" : "COD Pending"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar size={13} />
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin size={13} />
                          {order.city}, {order.state} ({order.pincode})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/track-order?orderNumber=${encodeURIComponent(order.orderNumber)}`}
                        className="px-4 py-2 rounded-xl bg-white border border-amber-200 text-xs font-semibold text-[#8B1E3F] hover:bg-amber-50 transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        <Truck size={14} />
                        <span>Track Package</span>
                      </Link>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-4 sm:p-6 divide-y divide-gray-100">
                    {order.items.map((item) => (
                      <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden relative border border-gray-100 shrink-0">
                            {item.imageUrl ? (
                              <Image
                                src={item.imageUrl}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <Package size={24} />
                              </div>
                            )}
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900">{item.name}</h4>
                            {item.variant && (
                              <p className="text-xs text-amber-800 font-medium mt-0.5">
                                Variant: {item.variant}
                              </p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              Qty: {item.quantity} × ₹{item.price.toLocaleString("en-IN")}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-gray-900">
                            ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                          </span>
                          <button
                            onClick={() => handleReorder(item)}
                            className="p-2 rounded-lg bg-gray-50 hover:bg-amber-100 text-amber-900 transition-colors"
                            title="Buy Again"
                          >
                            <ShoppingBag size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer & Tracking Details */}
                  <div className="bg-gray-50/80 px-4 sm:px-6 py-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4 text-xs">
                    <div>
                      {order.awbCode && (
                        <p className="text-gray-600 font-medium flex items-center gap-1.5">
                          <Truck size={14} className="text-[#8B1E3F]" />
                          Carrier: <span className="font-semibold text-gray-800">{order.courierName || "Shiprocket Express"}</span>
                          (AWB: <span className="font-mono font-bold text-[#8B1E3F]">{order.awbCode}</span>)
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <span className="text-gray-500">Subtotal: ₹{order.subtotal}</span>
                        {order.shippingFee > 0 ? (
                          <span className="text-gray-500 ml-2">Shipping: ₹{order.shippingFee}</span>
                        ) : (
                          <span className="text-emerald-600 font-medium ml-2">FREE Shipping</span>
                        )}
                      </div>
                      <div className="text-sm font-bold text-[#8B1E3F]">
                        Total: ₹{order.total.toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
