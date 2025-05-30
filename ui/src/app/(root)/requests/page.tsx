/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast"

export default function RequestsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
    const { toast } = useToast();

  useEffect(() => {
    if (status !== "authenticated") {
          toast({title:"You must be signed in to view this page."})
          setTimeout(() => {
              router.push("/sign-in");
          }, 750);
    }
    else if (status === "authenticated") {
      fetch("/api/gpu-request")
        .then(res => res.json())
        .then(data => {
          setRequests(data.requests || []);
          setLoading(false);
        });
    }
  }, [status, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-background py-16">
      <div className="w-full max-w-3xl px-4 py-4 mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-8 text-center">
          Your GPU Requests
        </h1>
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="animate-spin h-8 w-8 text-primary" />
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">
            You have not made any requests yet.
          </div>
        ) : (
          <div className="space-y-6">
            {requests.map((req, idx) => (
              <Card key={req._id || idx} className="border-primary/20">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                      Incomplete
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="mb-2">
                        <span className="font-semibold text-primary">OS:</span> {req.criteria.os}
                      </div>
                      <div className="mb-2">
                        <span className="font-semibold text-primary">Budget:</span> ${req.criteria.budget}
                      </div>
                      <div className="mb-2">
                        <span className="font-semibold text-primary">Country:</span> {req.criteria.country}
                      </div>
                      <div className="mb-2">
                        <span className="font-semibold text-primary">Region:</span> {req.criteria.region}
                      </div>
                    </div>
                    <div>
                      <div className="mb-2">
                        <span className="font-semibold text-primary">vCPUs:</span> {req.criteria.cpus}
                      </div>
                      <div className="mb-2">
                        <span className="font-semibold text-primary">RAM:</span> {req.criteria.ram} GB
                      </div>
                      <div className="mb-2">
                        <span className="font-semibold text-primary">VRAM:</span> {req.criteria.vram} GB
                      </div>
                      <div className="mb-2 text-muted-foreground text-xs">
                        Requested on: {new Date(req.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}