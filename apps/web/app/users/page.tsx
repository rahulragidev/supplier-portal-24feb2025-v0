"use client";

import { useEffect, useState } from "react";
import { AppUser } from "@workspace/database/types";
import { api } from "@workspace/api-client";
import { useStore } from "@workspace/store";
import Link from "next/link";
import { PlusCircle, Trash2, PencilLine, RefreshCw } from "lucide-react";

// Import UI components from your actual UI library path
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { CardContent } from "@workspace/ui/components/card";
import { CardDescription } from "@workspace/ui/components/card";
import { CardFooter } from "@workspace/ui/components/card";
import { CardHeader } from "@workspace/ui/components/card";
import { CardTitle } from "@workspace/ui/components/card";

export default function UsersPage() {
  // Use the store for state management
  const users = useStore((state) => state.users);
  const setUsers = useStore((state) => state.setUsers);
  const deleteStoreUser = useStore((state) => state.deleteUser);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const fetchedUsers = await api.getUsers();
      setUsers(fetchedUsers);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Failed to load users. Please try again later.");
      // Simple console notification instead of toast
      console.error("Failed to load users. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (uid: string) => {
    if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      setIsDeleting(uid);
      
      try {
        // Type assertion to handle the string/number mismatch
        await api.deleteUser(uid as any);
        // Update the store
        deleteStoreUser(uid);
        // Simple console notification instead of toast
        console.log("User deleted successfully");
      } catch (err) {
        console.error("Failed to delete user:", err);
        // Simple console notification instead of toast
        console.error("Failed to delete user. Please try again.");
      } finally {
        setIsDeleting(null);
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getUserTypeLabel = (userType: string) => {
    switch (userType) {
      case "EMPLOYEE":
        return <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">Employee</span>;
      case "SUPPLIER":
        return <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">Supplier</span>;
      case "SUPPLIER_SITE":
        return <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs">Supplier Site</span>;
      case "ADMIN":
        return <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">Admin</span>;
      default:
        return <span className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs">{userType}</span>;
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-gray-500">Manage system users</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchUsers} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button asChild>
            <Link href="/users/new">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add User
            </Link>
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
          <Button variant="link" onClick={fetchUsers} className="ml-2 p-0 h-auto text-red-700">
            Try again
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 6 }).map((_, index) => (
            <Card key={`skeleton-${index}`} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-3 w-24 bg-gray-200 animate-pulse rounded"></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 w-full bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-3 w-3/4 bg-gray-200 animate-pulse rounded"></div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="h-9 w-full bg-gray-200 animate-pulse rounded"></div>
              </CardFooter>
            </Card>
          ))
        ) : users.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-4">No users found</p>
            <Button onClick={fetchUsers}>Refresh</Button>
          </div>
        ) : (
          users.map((user) => (
            <Card key={user.uid} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium">
                      {getInitials(user.userName || "")}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{user.userName || "Unnamed User"}</CardTitle>
                      <CardDescription>{user.clerkId}</CardDescription>
                    </div>
                  </div>
                  <div>
                    {getUserTypeLabel(user.userType)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-500">
                  <p>Created: {new Date(user.createdAt).toLocaleDateString()}</p>
                  <p>Type: {user.userType}</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Button variant="outline" asChild>
                  <Link href={`/users/${user.uid}`}>
                    View Details
                  </Link>
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" asChild>
                    <Link href={`/users/${user.uid}/edit`}>
                      <PencilLine className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    onClick={() => handleDeleteUser(user.uid)}
                    disabled={isDeleting === user.uid}
                  >
                    {isDeleting === user.uid ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}