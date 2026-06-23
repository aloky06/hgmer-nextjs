"use client";

import { useState, useEffect } from "react";
import api from "../../../lib/api";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePushToShiprocket = async (orderId: number) => {
    try {
      await api.post(`/orders/${orderId}/shiprocket/push`);
      alert("Order successfully created in Shiprocket!");
      fetchOrders();
    } catch (error) {
      alert("Failed to push to Shiprocket.");
    }
  };

  const handleGenerateAWB = async (orderId: number, shipmentId: number) => {
    try {
      await api.post(`/orders/shiprocket/${shipmentId}/awb`);
      alert("AWB successfully generated & assigned!");
      fetchOrders();
    } catch (error) {
      alert("Failed to generate AWB.");
    }
  };

  const handleSchedulePickup = async (orderId: number, shipmentId: number) => {
    try {
      await api.post(`/orders/shiprocket/${shipmentId}/pickup`);
      alert("Pickup scheduled successfully with courier partner!");
    } catch (error) {
      alert("Failed to schedule pickup.");
    }
  };

  const handleGenerateLabel = async (orderId: number, shipmentId: number) => {
    try {
      await api.post(`/orders/shiprocket/${shipmentId}/label`);
      alert("Label generated! You can now print it.");
      fetchOrders();
    } catch (error) {
      alert("Failed to generate label.");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading orders...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manage Orders</h1>
      </div>

      <div className="bg-white shadow-sm border border-gray-100 rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fulfillment Node</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shiprocket Details</th>
              <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 font-bold text-gray-900">#{o.id}</td>
                <td className="py-3 px-4 text-gray-700">{o.customer?.name || 'Unknown'}</td>
                <td className="py-3 px-4 text-gray-700">₹{o.totalAmount}</td>
                <td className="py-3 px-4 text-sm text-gray-700">
                  {(() => {
                    const nodes = new Set();
                    o.orderItems?.forEach((item: any) => {
                      if (item.warehouse) nodes.add(item.warehouse.name);
                    });
                    const nodesArr = Array.from(nodes);
                    if (nodesArr.length === 0) return <span className="text-gray-400 italic">Unassigned</span>;
                    return (
                      <div className="flex flex-col space-y-1">
                        {nodesArr.map((n: any, idx) => (
                          <span key={idx} className="bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-1 rounded inline-block whitespace-nowrap">
                            {n}
                          </span>
                        ))}
                      </div>
                    );
                  })()}
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    o.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    o.status === 'SHIPPED' ? 'bg-green-100 text-green-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {o.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  {o.shiprocketShipmentId ? (
                    <div className="space-y-1">
                      <p>Shipment ID: <strong>{o.shiprocketShipmentId}</strong></p>
                      {o.awbCode && <p>AWB: <span className="font-mono text-blue-600">{o.awbCode}</span></p>}
                    </div>
                  ) : (
                    <span className="text-gray-400 italic">Not pushed to Shiprocket</span>
                  )}
                </td>
                <td className="py-3 px-4 flex justify-center space-x-2">
                  {!o.shiprocketShipmentId && (
                    <button
                      onClick={() => handlePushToShiprocket(o.id)}
                      className="bg-[#ff9933] text-white hover:bg-orange-600 px-3 py-1.5 rounded transition-colors text-xs font-medium shadow-sm"
                    >
                      Push to Shiprocket
                    </button>
                  )}

                  {o.shiprocketShipmentId && !o.awbCode && (
                    <button
                      onClick={() => handleGenerateAWB(o.id, o.shiprocketShipmentId)}
                      className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-1.5 rounded transition-colors text-xs font-medium shadow-sm"
                    >
                      Generate AWB
                    </button>
                  )}

                  {o.awbCode && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSchedulePickup(o.id, o.shiprocketShipmentId)}
                        className="bg-purple-600 text-white hover:bg-purple-700 px-3 py-1.5 rounded transition-colors text-xs font-medium shadow-sm"
                      >
                        Schedule Pickup
                      </button>
                      
                      {!o.shippingLabelUrl ? (
                         <button
                         onClick={() => handleGenerateLabel(o.id, o.shiprocketShipmentId)}
                         className="bg-gray-800 text-white hover:bg-gray-900 px-3 py-1.5 rounded transition-colors text-xs font-medium shadow-sm"
                       >
                         Generate Label
                       </button>
                      ) : (
                        <a
                          href={o.shippingLabelUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-green-600 text-white hover:bg-green-700 px-3 py-1.5 rounded transition-colors text-xs font-medium shadow-sm text-center inline-block"
                        >
                          Print Label
                        </a>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
